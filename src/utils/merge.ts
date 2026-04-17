export type Indexed<T = unknown> = {
    [key in string]: T;
};
  
function isPlainObject(value: unknown): value is Indexed {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.getPrototypeOf(value) === Object.prototype
    );
}

function merge(lhs: Indexed, rhs: Indexed): Indexed {
    const result: Indexed = {};
    for (const key of Object.keys(lhs)) {
      const left = lhs[key];
      const right = rhs[key];
      if (right === undefined) {
        result[key] = left;
        continue;
      }
      if (isPlainObject(left) && isPlainObject(right)) {
        result[key] = merge(left, right);
      } else {
        result[key] = right;
      }
    }
    for (const key of Object.keys(rhs)) {
      if (!(key in lhs)) {
        result[key] = rhs[key];
      }
    }
    return result;
}
  
export default merge;