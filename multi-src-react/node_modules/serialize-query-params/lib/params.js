"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelimitedNumericArrayParam = exports.DelimitedArrayParam = exports.NumericObjectParam = exports.BooleanParam = exports.DateTimeParam = exports.DateParam = exports.JsonParam = exports.NumericArrayParam = exports.ArrayParam = exports.ObjectParam = exports.NumberParam = exports.createEnumParam = exports.StringParam = void 0;
var Serialize = require("./serialize");
/**
 * String values
 */
exports.StringParam = {
    encode: Serialize.encodeString,
    decode: Serialize.decodeString,
};
/**
 * String enum
 */
var createEnumParam = function (enumValues) { return ({
    encode: Serialize.encodeString,
    decode: function (input) { return Serialize.decodeEnum(input, enumValues); },
}); };
exports.createEnumParam = createEnumParam;
/**
 * Numbers (integers or floats)
 */
exports.NumberParam = {
    encode: Serialize.encodeNumber,
    decode: Serialize.decodeNumber,
};
/**
 * For flat objects where values are strings
 */
exports.ObjectParam = {
    encode: Serialize.encodeObject,
    decode: Serialize.decodeObject,
};
/**
 * For flat arrays of strings, filters out undefined values during decode
 */
exports.ArrayParam = {
    encode: Serialize.encodeArray,
    decode: Serialize.decodeArray,
};
/**
 * For flat arrays of strings, filters out undefined values during decode
 */
exports.NumericArrayParam = {
    encode: Serialize.encodeNumericArray,
    decode: Serialize.decodeNumericArray,
};
/**
 * For any type of data, encoded via JSON.stringify
 */
exports.JsonParam = {
    encode: Serialize.encodeJson,
    decode: Serialize.decodeJson,
};
/**
 * For simple dates (YYYY-MM-DD)
 */
exports.DateParam = {
    encode: Serialize.encodeDate,
    decode: Serialize.decodeDate,
    equals: function (valueA, valueB) {
        if (valueA === valueB)
            return true;
        if (valueA == null || valueB == null)
            return valueA === valueB;
        // ignore time of day
        return (valueA.getFullYear() === valueB.getFullYear() &&
            valueA.getMonth() === valueB.getMonth() &&
            valueA.getDate() === valueB.getDate());
    },
};
/**
 * For dates in simplified extended ISO format (YYYY-MM-DDTHH:mm:ss.sssZ or ±YYYYYY-MM-DDTHH:mm:ss.sssZ)
 */
exports.DateTimeParam = {
    encode: Serialize.encodeDateTime,
    decode: Serialize.decodeDateTime,
    equals: function (valueA, valueB) {
        if (valueA === valueB)
            return true;
        if (valueA == null || valueB == null)
            return valueA === valueB;
        return valueA.valueOf() === valueB.valueOf();
    },
};
/**
 * For boolean values: 1 = true, 0 = false
 */
exports.BooleanParam = {
    encode: Serialize.encodeBoolean,
    decode: Serialize.decodeBoolean,
};
/**
 * For flat objects where the values are numbers
 */
exports.NumericObjectParam = {
    encode: Serialize.encodeNumericObject,
    decode: Serialize.decodeNumericObject,
};
/**
 * For flat arrays of strings, filters out undefined values during decode
 */
exports.DelimitedArrayParam = {
    encode: Serialize.encodeDelimitedArray,
    decode: Serialize.decodeDelimitedArray,
};
/**
 * For flat arrays where the values are numbers, filters out undefined values during decode
 */
exports.DelimitedNumericArrayParam = {
    encode: Serialize.encodeDelimitedNumericArray,
    decode: Serialize.decodeDelimitedNumericArray,
};
