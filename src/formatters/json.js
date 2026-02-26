const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

const buildChanges = (data1, data2, pathPrefix = '') => {
  const keys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])).sort();
  const changes = [];

  for (const key of keys) {
    const path = pathPrefix ? `${pathPrefix}.${key}` : key;
    const has1 = Object.prototype.hasOwnProperty.call(data1, key);
    const has2 = Object.prototype.hasOwnProperty.call(data2, key);
    const val1 = data1[key];
    const val2 = data2[key];
    const obj1 = has1 && isObject(val1);
    const obj2 = has2 && isObject(val2);

    if (has1 && has2) {
      if (obj1 && obj2) {
        changes.push(...buildChanges(val1, val2, path));
      } else if (val1 !== val2 || obj1 || obj2) {
        changes.push({ type: 'updated', key: path, oldValue: val1, newValue: val2 });
      }
    } else if (has1) {
      changes.push({ type: 'removed', key: path });
    } else {
      changes.push({ type: 'added', key: path, value: val2 });
    }
  }
  return changes;
};

const toJsonNode = (change) => {
  if (change.type === 'added') {
    return { type: 'added', key: change.key, value: change.value };
  }
  if (change.type === 'removed') {
    return { type: 'removed', key: change.key };
  }
  return {
    type: 'updated',
    key: change.key,
    oldValue: change.oldValue,
    newValue: change.newValue,
  };
};

const formatJson = (data1, data2) => {
  const changes = buildChanges(data1, data2);
  changes.sort((a, b) => a.key.localeCompare(b.key));
  return JSON.stringify(changes.map(toJsonNode), null, 2);
};

export default formatJson;
