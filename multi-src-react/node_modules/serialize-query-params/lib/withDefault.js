"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDefault = void 0;
function withDefault(param, defaultValue, includeNull) {
    if (includeNull === void 0) { includeNull = true; }
    var decodeWithDefault = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var decodedValue = param.decode.apply(param, args);
        if (decodedValue === undefined) {
            return defaultValue;
        }
        if (includeNull) {
            if (decodedValue === null) {
                return defaultValue;
            }
            else {
                return decodedValue;
            }
        }
        return decodedValue;
    };
    return __assign(__assign({}, param), { decode: decodeWithDefault });
}
exports.withDefault = withDefault;
exports.default = withDefault;
