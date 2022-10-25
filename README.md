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

function isPerson(value: any): value is Person {
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
With this, we immediatelly known, when we receive data that didn't meet our expectations. The error thrown directly points to the `getPerson` function. The problem with this approach is, that we now have to encode our expectations twice. Once with `type Person` and the other time with `isPerson`. Let's try to resolve this issue with the next approach:
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






Additionally there can be errors hard to catch in `isPerson` since it processes an `any` value. We could change `value` to `unknown`, which would catch many coding errors, but even with recent TypeScript versions, a line such as `if (!("lastName" in value) || typeof value.lastName !== "string") return false;` would only resolve the type of `value` to `object & Record<"lastName", unknown>` instead of `object & Record<"lastName", string>`.
