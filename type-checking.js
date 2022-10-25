/**
 * @template T
 * @param { unknown } value
 * @param { (value: unknown) => value is T } typeGuard
 * @return { asserts value is T }
 * @throws { TypeError }
 */
export function assert(value, typeGuard) {
    if (!typeGuard(value)) throw new TypeError();
}

/**
 * @template { string | number | symbol } EntryKey
 * @template EntryValue
 * @param { EntryKey } entryKey
 * @param { (entryValue: unknown) => entryValue is EntryValue } entryTypeGuard
 */
export function hasKey(entryKey, entryTypeGuard) {
    /**
     * @param { any } value
     * @return { value is Record<EntryKey, EntryValue> }
     */
    return function hasKeyCheck(value) {
        return typeof value === "object" && value != null && entryKey in value && entryTypeGuard(value[entryKey]);
    };
}

/**
 * @template { string | number | symbol } EntryKey
 * @template EntryValue
 * @param { EntryKey } entryKey
 * @param { (entryValue: unknown) => entryValue is EntryValue } entryTypeGuard
 */
export function hasOptionalKey(entryKey, entryTypeGuard) {
    /**
     * @param { any } value
     * @return { value is Partial<Record<EntryKey, EntryValue>> }
     */
    return function hasOptionalKeyCheck(value) {
        return typeof value === "object" && value != null && (!(entryKey in value) || entryTypeGuard(value[entryKey]));
    };
}

/**
 * @template Item
 * @param { (item: unknown) => item is Item } itemTypeGuard
 */
export function isArray(itemTypeGuard) {
    /**
     * @param { unknown } value
     * @return { value is Array<Item> }
     */
    return function isArrayCheck(value) {
        return Array.isArray(value) && value.every(itemTypeGuard);
    };
}

/**
 * @param { unknown } value
 * @return { value is boolean }
 */
export function isBoolean(value) {
    return typeof value === "boolean";
}

/**
 * @param { unknown } value
 * @return { value is true }
 */
export function isTrue(value) {
    return value === true;
}

/**
 * @param { unknown } value
 * @return { value is false }
 */
export function isFalse(value) {
    return value === false;
}

/**
 * @template A
 * @template B
 * @param { (item: unknown) => item is A } typeGuardA
 * @param { (item: unknown) => item is B } typeGuardB
 */
export function isEither2(typeGuardA, typeGuardB) {
    /**
     * @param { unknown } value
     * @return { value is A | B }
     */
    return function isEither2Check(value) {
        return typeGuardA(value) || typeGuardB(value);
    };
}

/**
 * @template A
 * @template B
 * @template C
 * @param { (item: unknown) => item is A } typeGuardA
 * @param { (item: unknown) => item is B } typeGuardB
 * @param { (item: unknown) => item is C } typeGuardC
 */
export function isEither3(typeGuardA, typeGuardB, typeGuardC) {
    /**
     * @param { unknown } value
     * @return { value is A | B | C }
     */
    return function isEither3Check(value) {
        return typeGuardA(value) || typeGuardB(value) || typeGuardC(value);
    };
}

/**
 * @template { Function } T
 * @param { T } constructor
 */
export function isInstanceOf(constructor) {
    /**
     * @param { unknown } value
     * @return { value is InstanceType<T> }
     */
    return function isInstanceOfCheck(value) {
        return value instanceof constructor;
    };
}

/**
 * @param { unknown } value
 * @return { value is null }
 */
export function isNull(value) {
    return value === null;
}

/**
 * @param { unknown } value
 * @return { value is number }
 */
export function isNumber(value) {
    return typeof value === "number";
}

/**
 * @param { unknown } value
 * @return { value is string }
 */
export function isString(value) {
    return typeof value === "string";
}

/**
 * @param { unknown } value
 * @return { value is undefined }
 */
export function isUndefined(value) {
    return value === undefined;
}

/**
 * @template T
 * @param { (value: unknown) => T } throwingFunction
 */
export function throwing(throwingFunction) {
    /**
     * @param { unknown } value
     * @return { value is T }
     * @throws
     */
    return function throwingCheck(value) {
        throwingFunction(value);
        return true;
    };
}
