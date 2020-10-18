export function upsert<K extends object, V>(
  map: WeakMap<K, V>,
  key: K,
  create: () => V
): V {
  const val = map.get(key);
  if (val !== undefined) {
    return val;
  }
  const newVal = create();
  map.set(key, newVal);
  return newVal;
}
