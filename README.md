# js-type-checking
## Problem
When dealing with JSON data coming from `fetch` or files, we often end up with code as such (implementation details and error handling left out for brevity):
```ts
async function getPerson(): Promise<Person> {
  return await (await fetch(...)).json();
}

type Person = {
  firstName: string,
  lastName: string,
  middleName?: string,
  addresses: Address[]
};
```
Since the JSON we receive is actually never checked during the runtime of the program, we can end up with errors being thrown in parts of the program far removed from the actual source of the issue. For example, we access `addresses` and call `map` on it in a React component, which will raise an error since that key was actually missing in the JSON we received. When we debug this problem, we would have no direct link to where the issue originated from, namely a faulty assumption about what we receive from a specific endpoint. Only experience tells us, that that's often the source of that kind of issue. We can move the detection of problems closer to the source, by checking the actual result, with code as such:
```ts
async function getPerson(): Promise<Person> {
  const result = await (await fetch(...)).json();
  if (isPerson(result)) return result;
  throw new Error();
}

function isPerson(value: unknown): value is Person {
  if (typeof value !== "object" || value == null) return false;
  if (!("firstName" in value) || typeof value.firstName !== "string") return false;
  if (!("lastName" in value) || typeof value.lastName !== "string") return false;
  if ("middleName" in value && typeof value.middleName !== "string") return false;
  if (!("addresses" in value) || !Array.isArray(value.addresses) || value.addresses.every(isAddress)) return false;
  return true;
}

type Person = {
  firstName: string,
  lastName: string,
  middleName?: string,
  addresses: Address[]
};
```
With this, we immediatelly known, if we receive data that didn't meet our expectations. The error thrown directly points to the `getPerson` function. The problem with this approach is, that we now have to encode our expectations twice. Once with `type Person` and the other time with `isPerson`. Even worse, those definitions can drift apart or not match up at all with inaccurate implementations of `isPerson`. Let's try to resolve this issue with the next approach:
```ts
async function getPerson(): Promise<Person> {
  return personOrThrow(await (await fetch(...)).json());
}

function personOrThrow(value: unknown) {
  if (typeof value !== "object" || value == null) throw new TypeError();
  if (!("firstName" in value) || typeof value.firstName !== "string") throw new TypeError();
  if (!("lastName" in value) || typeof value.lastName !== "string") throw new TypeError();
  if ("middleName" in value && typeof value.middleName !== "string") throw new TypeError();
  if (!("addresses" in value) || !Array.isArray(value.addresses) || value.addresses.every(isAddress)) throw new TypeError();
  return value;
}

type Person = ReturnType<typeof personOrThrow>;
```
Here we derive the type `Person` from the actual code, which results in a single source of truth. When we change `personOrThrow`, the type changes along automatically. There is a problem though. The resulting `Person` type lost details. Even with recent TypeScript versions (4.9.0), a line such as `if (!("lastName" in value) || typeof value.lastName !== "string") return false;` would only resolve the type of `value` to `object & Record<"lastName", unknown>` instead of `object & Record<"lastName", string>`. TypeScript resolves `Person` to `object & Record<"firstName", unknown> & Record<"lastName", unknown> & Record<"addresses", unknown>`. We were so close to an usable solution! This is where this library comes in.
## Solution
This library implements TypeScript type guards, but with narrower type inference. With these, we can implement our checks as such:
```ts
import * as TC from "./type-checking.js";

async function getPerson(): Promise<Person> {
  return personOrThrow(await (await fetch(...)).json());
}

function addressOrThrow(value: unknown) {
  TC.assert(value, TC.hasKey("street", TC.isString));
  TC.assert(value, TC.hasKey("houseNumber", TC.isNumber));
  return value;
}

type Address = ReturnType<typeof addressOrThrow>;

function personOrThrow(value: unknown) {
  TC.assert(value, TC.hasKey("firstName", TC.isString));
  TC.assert(value, TC.hasKey("lastName", TC.isString));
  TC.assert(value, TC.hasOptionalKey("middleName", TC.isString));
  TC.assert(value, TC.hasKey("addresses", TC.isArray(TC.throwing(addressOrThrow))));
  return value;
}

type Person = ReturnType<typeof personOrThrow>;
```
The central concept are type guards. Many of the functions in the library can take type guards and always return type guards. `TC.hasKey("firstName", TC.isString)` for example returns a type guard function, checking whether some value supplied to it has a key `firstName` which is of type `string`. `TC.throwing` takes a function that throws and returns a type guard, without catching, to preserve accurate errors. Such a design makes the library much more composable. The main feature is, that it preserves accurate inferred types. Here `Person` is inferred as `Record<"firstName", string> & Record<"lastName", string> & Partial<Record<"middleName", string>> & Record<"addresses", Address[]>`.
