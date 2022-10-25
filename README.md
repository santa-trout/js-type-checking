# js-type-checking
## Problem
When dealing with JSON data coming from `fetch` or files, we often end up with code as such (implementation details and error handling left out for brevity):
```ts
async function getPerson(): Person {
  return await (await fetch(...)).json();
}

type Person = {
  firstName: string,
  lastName: string,
  middleName?: string,
  addresses: Address[]
};
```
Since the JSON we receive is actually never checked during the runtime of the program, we can end up with errors being thrown in parts of the program far removed from the actual source of the issue. For example, we access `addresses` and call `map` on it in a React component, which will raise an error since that key was actually missing in the JSON we received. When we debug this problem, we would have no direct link to where the issue originated from, namely a faulty assumption about what we receive from a specific endpoint. Only experience tells us, that that's often the source of that kind of issue.
