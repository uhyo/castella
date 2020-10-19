/**
 * Maps given array to values of the same type.
 * If values are the same, reuses the input array.
 */
export function mapMaybeSame<T>(arr: T[], callback: (v: T) => T): T[] {
  const length = arr.length;
  for (let i = 0; i < length; i++) {
    const ret = callback(arr[i]);
    if (arr[i] !== ret) {
      const result = arr.slice(0, i);
      result.push(ret);
      for (let j = i + 1; j < length; j++) {
        result.push(callback(arr[j]));
      }
      return result;
    }
  }
  return arr;
}
