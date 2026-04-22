import { type Indexed } from './merge';
import merge from './merge';

function set(object: Indexed, path: string, value: unknown): Indexed;
function set(object: unknown, path: string, value: unknown): unknown;
function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  if (typeof path !== 'string') {
    throw new Error('path must be string');
  }

  const result = path.split('.').reduceRight<unknown>(
    (acc, key) => ({ [key]: acc }),
    value,
  ) as Indexed;

  return merge(object as Indexed, result);
}

export default set;
