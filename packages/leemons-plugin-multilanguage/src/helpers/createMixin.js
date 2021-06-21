/**
 * Iterates over the classes array and creates an unique class that extends all the others
 *
 * The first element must be a class, it will be the base
 *
 * The following elements, must be a function whose paramater would be
 * the other classes and should return a class extending from it
 * @param {*[]} classes
 *
 * @example
 * class Base {}
 * const class1 = (base) => class extends base {};
 * const class2 = (base) => class extends base {};
 *
 * const finalClass = createMixin([Base, class1, class2]);
 */
module.exports = (classes) => classes.reduce((result, mixin) => mixin(result));
