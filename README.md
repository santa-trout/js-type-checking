# js-type-checking
## Problem
When dealing with JSON data coming from `fetch` or files, we often end up with code as such (implementation details and error handling left out for brevity):
```ts
async function getPerson(): Promise<Person> {
  return await (await fetch(...)).json();
}

type Address = {
  street: string,
  houseNumber: number
};

type Person = {
  firstName: string,
  lastName: string,
  middleName?: string,
  addresses: Address[]
};
```
Since the JSON we receive is actually never checked during the runtime of the program, we can end up with errors being thrown in parts of the program far removed from the actual source of the issue. For example, we access `addresses` and call `map` on it in a React component, which will raise an error since that key was actually missing in the JSON we received. When we debug this problem, we would have no direct link to where the issue originated from, namely a faulty assumption about what we receive from a specific endpoint. Only experience tells us, that that's often the source of that kind of issue. We can move the detection of problems closer to the source, by checking the actual result, with code as such:
```ts
async function getPerson() { // : Promise<Person> inferred from now on
  const result = await (await fetch(...)).json();
  if (isPerson(result)) return result;
  throw new Error();
}

function isAddress(value: unknown): value is Address {
  if (typeof value !== "object" || value == null) return false;

  if (!("street" in value) || typeof value.street !== "string")
    return false;

  if (!("houseNumber" in value) || typeof value.houseNumber !== "number")
    return false;

  return true;
}

function isPerson(value: unknown): value is Person {
  if (typeof value !== "object" || value == null) return false;

  if (!("firstName" in value) || typeof value.firstName !== "string")
    return false;

  if (!("lastName" in value) || typeof value.lastName !== "string")
    return false;

  if ("middleName" in value && typeof value.middleName !== "string")
    return false;

  if (!("addresses" in value) || !Array.isArray(value.addresses))
    return false;

  if (!value.addresses.every(isAddress))
    return false;

  return true;
}

type Address = {
  street: string,
  houseNumber: number
};

type Person = {
  firstName: string,
  lastName: string,
  middleName?: string,
  addresses: Address[]
};
```
With this, we immediatelly known, if we receive data that didn't meet our expectations. The error thrown directly points to the `getPerson` function. The problem with this approach is, that we now have to encode our expectations twice. Once with `type Person` and the other time with `isPerson`. Even worse, those definitions can drift apart or not match up at all with inaccurate implementations of `isPerson`. Let's try to resolve this issue with the next approach:
```ts
async function getPerson() {
  return personOrThrow(await (await fetch(...)).json());
}

function addressOrThrow(value: unknown) {
  if (typeof value !== "object" || value == null) throw new TypeError();

  if (!("street" in value) || typeof value.street !== "string")
    throw new TypeError();

  if (!("houseNumber" in value) || typeof value.houseNumber !== "number")
    throw new TypeError();

  return value;
}

function addressOrThrowTG(value: unknown): value is Address {
  addressOrThrow(value);
  return true;
}

function personOrThrow(value: unknown) {
  if (typeof value !== "object" || value == null) throw new TypeError();

  if (!("firstName" in value) || typeof value.firstName !== "string")
    throw new TypeError();

  if (!("lastName" in value) || typeof value.lastName !== "string")
    throw new TypeError();

  if ("middleName" in value && typeof value.middleName !== "string")
    throw new TypeError();

  if (!("addresses" in value) || !Array.isArray(value.addresses))
    throw new TypeError();

  if (!value.addresses.every(addressOrThrowTG))
    throw new TypeError();

  return value;
}

type Address = ReturnType<typeof addressOrThrow>;

type Person = ReturnType<typeof personOrThrow>;
```
Here we derive the type `Person` from the actual code, which results in a single source of truth. When we change `personOrThrow`, the type changes along automatically. There is a problem though. The resulting `Person` type lost details. Even with recent TypeScript versions (4.9.0), a line such as `if (!("lastName" in value) || typeof value.lastName !== "string") return false;` would only resolve the type of `value` to `object & Record<"lastName", unknown>` instead of `object & Record<"lastName", string>`. TypeScript resolves `Person` to `object & Record<"firstName", unknown> & Record<"lastName", unknown> & Record<"addresses", unknown>`. Interestingly enough, TypeScript (4.9.0) resolves all types within `personOrThrow` correctly. Inside the function, there is no loss of precision. Somehow that same precision isn't yet applied to the return type.
## Solution
This library implements TypeScript type guards, but with narrower type inference. With these, we can implement our checks as such:
```ts
import * as T from "./type-checking.js";

async function getPerson() {
  return personOrThrow(await (await fetch(...)).json());
}

function addressOrThrow(value: unknown) {
  T.assert(value, T.hasKey("street", T.isString));
  T.assert(value, T.hasKey("houseNumber", T.isNumber));
  return value;
}

function personOrThrow(v: unknown) {
  T.assert(v, T.hasKey("firstName", T.isString));
  T.assert(v, T.hasKey("lastName", T.isString));
  T.assert(v, T.hasOptionalKey("middleName", T.isString));
  T.assert(v, T.hasKey("addresses", T.isArray(T.throwing(addressOrThrow))));
  return v;
}

type Address = ReturnType<typeof addressOrThrow>;

type Person = ReturnType<typeof personOrThrow>;
```
The central concept are type guards. Many of the functions in the library can take type guards and return type guards. `TC.hasKey("firstName", TC.isString)` for example returns a type guard function, checking whether some value supplied to it has a key `firstName` which is of type `string`. `TC.throwing` takes a function that throws and returns a type guard, without catching, to preserve accurate errors. Such a design makes the library much more composable. The main feature is, that it preserves accurate inferred types. Here `Person` is inferred as `Record<"firstName", string> & Record<"lastName", string> & Partial<Record<"middleName", string>> & Record<"addresses", Address[]>`.
