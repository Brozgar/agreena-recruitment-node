/**
 * @method isEmpty
 * @param {String | Number | Object} value
 * @returns {Boolean} true & false
 * @description Check if this value is empty
 */
export const isEmpty = (value: string | number | object): boolean => {
  if (value === null) {
    return true;
  } else if (typeof value !== "number" && value === "") {
    return true;
  } else if (typeof value === "undefined" || value === undefined) {
    return true;
  } else if (value !== null && typeof value === "object" && !Object.keys(value).length) {
    return true;
  } else {
    return false;
  }
};

/**
 * @method isEmpty
 * @param {String[] | Number[] | Object[]} values
 * @returns {Boolean} true & false
 * @description Check if values contain empty
 */
export const isSomeEmpty = (values: string[] | number[] | object[]): boolean => {
  return values.some(v => isEmpty(v));
};
