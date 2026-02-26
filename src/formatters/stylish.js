const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

const formatPrimitive = (value) => {
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  return String(value);
};

const keyIndent = (depth) => ' '.repeat(4 * (depth + 1));
const markerIndent = (depth) => (depth === 0 ? '' : ' '.repeat(2 + 4 * (2 ** depth - 1)));

const formatObjectValue = (obj, depth) => {
  const lines = [];
  const keys = Object.keys(obj).sort();
  const indent = keyIndent(depth + 1);
  for (const key of keys) {
    const val = obj[key];
    if (isObject(val)) {
      lines.push(`${indent}${key}: {`);
      lines.push(...formatObjectValue(val, depth + 1));
      lines.push(`${indent}}`);
    } else {
      lines.push(`${indent}${key}: ${formatPrimitive(val)}`);
    }
  }
  return lines;
};

const formatStylishRec = (data1, data2, depth) => {
  const keys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])).sort();
  const lines = [];
  const kIndent = keyIndent(depth);
  const mIndent = markerIndent(depth);

  for (const key of keys) {
    const has1 = Object.prototype.hasOwnProperty.call(data1, key);
    const has2 = Object.prototype.hasOwnProperty.call(data2, key);
    const val1 = data1[key];
    const val2 = data2[key];
    const obj1 = has1 && isObject(val1);
    const obj2 = has2 && isObject(val2);

    if (has1 && has2) {
      if (obj1 && obj2) {
        lines.push(`${kIndent}${key}: {`);
        lines.push(...formatStylishRec(val1, val2, depth + 1));
        lines.push(`${kIndent}}`);
      } else if (obj1 && !obj2) {
        lines.push(`${mIndent}  - ${key}: {`);
        lines.push(...formatObjectValue(val1, depth));
        lines.push(`${kIndent}}`);
        lines.push(`${mIndent}  + ${key}: ${formatPrimitive(val2)}`);
      } else if (!obj1 && obj2) {
        lines.push(`${mIndent}  - ${key}: ${formatPrimitive(val1)}`);
        lines.push(`${mIndent}  + ${key}: {`);
        lines.push(...formatObjectValue(val2, depth));
        lines.push(`${kIndent}}`);
      } else if (val1 === val2) {
        lines.push(`${kIndent}${key}: ${formatPrimitive(val1)}`);
      } else {
        const v1 = formatPrimitive(val1);
        const v2 = formatPrimitive(val2);
        lines.push(`${mIndent}  - ${key}: ${v1 === '' ? '' : v1}`);
        lines.push(`${mIndent}  + ${key}: ${v2}`);
      }
    } else if (has1) {
      if (obj1) {
        lines.push(`${mIndent}  - ${key}: {`);
        lines.push(...formatObjectValue(val1, depth));
        lines.push(`${kIndent}}`);
      } else {
        const v = formatPrimitive(val1);
        lines.push(`${mIndent}  - ${key}: ${v === '' ? '' : v}`);
      }
    } else {
      if (obj2) {
        lines.push(`${mIndent}  + ${key}: {`);
        lines.push(...formatObjectValue(val2, depth));
        lines.push(`${kIndent}}`);
      } else {
        lines.push(`${mIndent}  + ${key}: ${formatPrimitive(val2)}`);
      }
    }
  }
  return lines;
};

const formatStylish = (data1, data2) => {
  const lines = ['{', ...formatStylishRec(data1, data2, 0), '}'];
  return lines.join('\n');
};

export default formatStylish;
