import * as TC from "./type-checking.js";

function someFunctionA() {}
someFunctionA.a = 123;

function someFunctionB() {}

function addressExampleFunction() {}
addressExampleFunction.street = "";
addressExampleFunction.houseNumber = 123;

/** @param { function(unknown): void } assert */
function hasKeyTest(assert) {
    assert(TC.hasKey("a", TC.isNumber)({ a: 123 }));
    assert(!TC.hasKey("a", TC.isNumber)({ a: "123" }));
    assert(!TC.hasKey("a", TC.isNumber)({ a: undefined }));
    assert(!TC.hasKey("a", TC.isNumber)({ a: null }));
    assert(!TC.hasKey("a", TC.isNumber)({}));

    assert(TC.hasKey("a", TC.isNumber)(someFunctionA));
    assert(!TC.hasKey("a", TC.isString)(someFunctionA));
    assert(!TC.hasKey("a", TC.isNumber)(someFunctionB));

    assert(TC.hasKey("a", TC.isUndefined)({ a: undefined }));
    assert(!TC.hasKey("a", TC.isUndefined)({}));

    assert(!TC.hasKey("a", TC.isNull)({ a: undefined }));
    assert(!TC.hasKey("a", TC.isNull)({}));
    assert(TC.hasKey("a", TC.isNull)({ a: null }));
}

/** @param { function(unknown): void } assert */
function hasOptionalKeyTest(assert) {
    assert(TC.hasOptionalKey("a", TC.isNumber)({ a: 123 }));
    assert(!TC.hasOptionalKey("a", TC.isNumber)({ a: "123" }));
    assert(!TC.hasOptionalKey("a", TC.isNumber)({ a: undefined }));
    assert(!TC.hasOptionalKey("a", TC.isNumber)({ a: null }));
    assert(TC.hasOptionalKey("a", TC.isNumber)({}));

    assert(TC.hasOptionalKey("a", TC.isNumber)(someFunctionA));
    assert(TC.hasOptionalKey("a", TC.isNumber)(someFunctionB));

    assert(TC.hasOptionalKey("a", TC.isUndefined)({ a: undefined }));
    assert(TC.hasOptionalKey("a", TC.isUndefined)({}));

    assert(!TC.hasOptionalKey("a", TC.isNull)({ a: undefined }));
    assert(TC.hasOptionalKey("a", TC.isNull)({}));
    assert(TC.hasOptionalKey("a", TC.isNull)({ a: null }));
}

/** @param { function(unknown): void } assert */
function isStringTest(assert) {
    assert(!TC.isString({ a: 123 }));
    assert(!TC.isString(123));
    assert(!TC.isString(123.4));
    assert(!TC.isString([""]));
    assert(!TC.isString([]));
    assert(!TC.isString(null));
    assert(!TC.isString(undefined));
    assert(!TC.isString(new String("")));
    assert(TC.isString("123"));
    assert(!TC.isString(true));
    assert(!TC.isString(false));
}

/** @param { function(unknown): void } assert */
function isNumberTest(assert) {
    assert(!TC.isNumber({ a: 123 }));
    assert(TC.isNumber(123));
    assert(TC.isNumber(123.4));
    assert(!TC.isNumber([""]));
    assert(!TC.isNumber([]));
    assert(!TC.isNumber(null));
    assert(!TC.isNumber(undefined));
    assert(!TC.isNumber(new String("")));
    assert(!TC.isNumber("123"));
    assert(!TC.isNumber(true));
    assert(!TC.isNumber(false));
}

/** @param { function(unknown): void } assert */
function isBooleanTest(assert) {
    assert(!TC.isBoolean({ a: 123 }));
    assert(!TC.isBoolean(123));
    assert(!TC.isBoolean(123.4));
    assert(!TC.isBoolean([""]));
    assert(!TC.isBoolean([]));
    assert(!TC.isBoolean(null));
    assert(!TC.isBoolean(undefined));
    assert(!TC.isBoolean(new String("")));
    assert(!TC.isBoolean("123"));
    assert(TC.isBoolean(true));
    assert(TC.isBoolean(false));
}

/** @param { function(unknown): void } assert */
function isNullTest(assert) {
    assert(!TC.isNull({ a: 123 }));
    assert(!TC.isNull(123));
    assert(!TC.isNull(123.4));
    assert(!TC.isNull([""]));
    assert(!TC.isNull([]));
    assert(TC.isNull(null));
    assert(!TC.isNull(undefined));
    assert(!TC.isNull(new String("")));
    assert(!TC.isNull("123"));
    assert(!TC.isNull(true));
    assert(!TC.isNull(false));
}

/** @param { function(unknown): void } assert */
function isArrayTest(assert) {
    assert(!TC.isArray(TC.isNull)({ a: 123 }));
    assert(!TC.isArray(TC.isNull)(123));
    assert(!TC.isArray(TC.isNull)(123.4));
    assert(!TC.isArray(TC.isNull)([""]));
    assert(TC.isArray(TC.isNull)([]));
    assert(TC.isArray(TC.isString)([]));
    assert(TC.isArray(TC.isString)([""]));
    assert(!TC.isArray(TC.isNumber)([""]));
    assert(!TC.isArray(TC.isNull)(null));
    assert(!TC.isArray(TC.isNull)(undefined));
    assert(!TC.isArray(TC.isNull)(new String("")));
    assert(!TC.isArray(TC.isNull)("123"));
    assert(!TC.isArray(TC.isString)("123"));
    assert(!TC.isArray(TC.isNull)(true));
    assert(!TC.isArray(TC.isNull)(false));
}

/** @param { function(unknown): void } assert */
function isEither2Test(assert) {
    assert(!TC.isEither2(TC.isNull, TC.isNumber)({ a: 123 }));
    assert(TC.isEither2(TC.isNull, TC.isNumber)(123));
    assert(TC.isEither2(TC.isNull, TC.isNumber)(123.4));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)([""]));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)([]));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)([]));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)([""]));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)([""]));
    assert(TC.isEither2(TC.isNull, TC.isNumber)(null));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)(undefined));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)(new String("")));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)("123"));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)("123"));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)(true));
    assert(!TC.isEither2(TC.isNull, TC.isNumber)(false));
}

/** @param { function(unknown): void } assert */
function isEither3Test(assert) {
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)({ a: 123 }));
    assert(TC.isEither3(TC.isNull, TC.isNumber, TC.isString)(123));
    assert(TC.isEither3(TC.isNull, TC.isNumber, TC.isString)(123.4));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)([""]));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)([]));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)([]));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)([""]));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)([""]));
    assert(TC.isEither3(TC.isNull, TC.isNumber, TC.isString)(null));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)(undefined));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)(new String("")));
    assert(TC.isEither3(TC.isNull, TC.isNumber, TC.isString)("123"));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)(true));
    assert(!TC.isEither3(TC.isNull, TC.isNumber, TC.isString)(false));
}

/** @param { function(unknown): void } assert */
function isInstanceOfTest(assert) {
    class A {}
    class C {}
    class C1 extends C {}

    assert(!TC.isInstanceOf(C)(new A()));
    assert(TC.isInstanceOf(C)(new C()));
    assert(TC.isInstanceOf(C)(new C1()));

    assert(!TC.isInstanceOf(C)({ a: 123 }));
    assert(!TC.isInstanceOf(C)(123));
    assert(!TC.isInstanceOf(C)(123.4));
    assert(!TC.isInstanceOf(C)([""]));
    assert(!TC.isInstanceOf(C)([]));
    assert(!TC.isInstanceOf(C)([]));
    assert(!TC.isInstanceOf(C)([""]));
    assert(!TC.isInstanceOf(C)([""]));
    assert(!TC.isInstanceOf(C)(null));
    assert(!TC.isInstanceOf(C)(undefined));
    assert(!TC.isInstanceOf(C)(new String("")));
    assert(!TC.isInstanceOf(C)("123"));
    assert(!TC.isInstanceOf(C)(true));
    assert(!TC.isInstanceOf(C)(false));
}

/** @param { unknown } value */
function addressOrThrow(value) {
    TC.assert(value, TC.hasKey("street", TC.isString));
    TC.assert(value, TC.hasKey("houseNumber", TC.isNumber));
    return value;
}

/** @typedef { ReturnType<typeof addressOrThrow> } Address */

/** @param { unknown } value */
function personOrThrow(value) {
    TC.assert(value, TC.hasKey("firstName", TC.isString));
    TC.assert(value, TC.hasKey("lastName", TC.isString));
    TC.assert(value, TC.hasOptionalKey("middleName", TC.isString));
    TC.assert(value, TC.hasKey("addresses", TC.isArray(TC.throwing(addressOrThrow))));
    return value;
}

/** @typedef { ReturnType<typeof personOrThrow> } Person */

/** @param { function } f */
function isThrowing(f) {
    try { f(); return false; } catch (e) { return true; }
}

/** @param { function(unknown): void } assert */
function runTests(assert) {
    hasKeyTest(assert);
    hasOptionalKeyTest(assert);
    isArrayTest(assert);
    isBooleanTest(assert);
    isEither2Test(assert);
    isEither3Test(assert);
    isNullTest(assert);
    isNumberTest(assert);
    isStringTest(assert);
    isInstanceOfTest(assert);
}

runTests(result => { if (!result) throw new Error(); });
