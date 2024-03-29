export function assert<T>(value: unknown, typeGuard: (value: unknown) => value is T): asserts value is T;
export function hasKey<EntryKey extends string | number | symbol, EntryValue>(entryKey: EntryKey, entryTypeGuard: (entryValue: unknown) => entryValue is EntryValue): (value: any) => value is Record<EntryKey, EntryValue>;
export function hasOptionalKey<EntryKey extends string | number | symbol, EntryValue>(entryKey: EntryKey, entryTypeGuard: (entryValue: unknown) => entryValue is EntryValue): (value: any) => value is Partial<Record<EntryKey, EntryValue>>;
export function isArray<Item>(itemTypeGuard: (item: unknown) => item is Item): (value: unknown) => value is Item[];
export function isBoolean(value: unknown): value is boolean;
export function isTrue(value: unknown): value is true;
export function isFalse(value: unknown): value is false;
export function isEither2<A, B>(typeGuardA: (item: unknown) => item is A, typeGuardB: (item: unknown) => item is B): (value: unknown) => value is A | B;
export function isEither3<A, B, C>(typeGuardA: (item: unknown) => item is A, typeGuardB: (item: unknown) => item is B, typeGuardC: (item: unknown) => item is C): (value: unknown) => value is A | B | C;
export function isFunction(value: unknown): value is Function;
export function isInstanceOf<T extends abstract new (...args: any) => any>(constructor: T): (value: unknown) => value is InstanceType<T>;
export function isNull(value: unknown): value is null;
export function isNullish(value: unknown): value is null | undefined;
export function isNumber(value: unknown): value is number;
export function isObject(value: unknown): value is object;
export function isString(value: unknown): value is string;
export function isUndefined(value: unknown): value is undefined;
export function throwing<T>(throwingFunction: (value: unknown) => T): (value: unknown) => value is T;
