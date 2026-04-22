export type PlainObject<T = unknown> = {
    [k in string]: T;
};

function isPlainObject(value: unknown): value is PlainObject {
    return typeof value === 'object'
      && value !== null
      && value.constructor === Object
      && Object.prototype.toString.call(value) === '[object Object]';
  } 

function isArrayOrObject(value: unknown): value is ([] | PlainObject) {
    return isPlainObject(value) || Array.isArray(value);
}

export default function isEqual(
    lhs: PlainObject | unknown[],
    rhs: PlainObject | unknown[],
) {
  const leftComparable = lhs as Record<string, unknown>;
  const rightComparable = rhs as Record<string, unknown>;

    // Сравнение количества ключей объектов и массивов
  if (Object.keys(leftComparable).length !== Object.keys(rightComparable).length) {
    return false;
  }

  for (const [key, value] of Object.entries(leftComparable)) {
    const rightValue = rightComparable[key];
    if (isArrayOrObject(value) && isArrayOrObject(rightValue)) {
            // Здесь value и rightValue может быть только массивом или объектом
            // И TypeScript это обрабатывает
      if (isEqual(value, rightValue)) {
        continue;
      }
      return false;
    }

    if (value !== rightValue) {
      return false;
    }
  }

  return true;
}
