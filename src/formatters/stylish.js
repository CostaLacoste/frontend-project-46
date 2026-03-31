const INDENT_STEP = 4;
const MARKER_PREFIX = '  - ';
const MARKER_ADD = '  + ';

const isObject = (val) => val !== null && typeof val === 'object' && !Array.isArray(val);

const formatPrimitive = (value) => {
  if (value === null) return 'null';
  if (typeof value === 'string') return value;
  return String(value);
};

const keyIndent = (depth) => ' '.repeat(INDENT_STEP * (depth + 1));
const markerIndent = (depth) => (
  depth === 0 ? '' : ' '.repeat(2 + INDENT_STEP * (2 ** depth - 1))
);

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

const pushRemoved = (lines, mIndent, kIndent, key, val, depth) => {
  if (isObject(val)) {
    lines.push(`${mIndent}${MARKER_PREFIX}${key}: {`);
    lines.push(...formatObjectValue(val, depth));
    lines.push(`${kIndent}}`);
  } else {
    const v = formatPrimitive(val);
    lines.push(`${mIndent}${MARKER_PREFIX}${key}: ${v === '' ? '' : v}`);
  }
};

const pushAdded = (lines, mIndent, kIndent, key, val, depth) => {
  if (isObject(val)) {
    lines.push(`${mIndent}${MARKER_ADD}${key}: {`);
    lines.push(...formatObjectValue(val, depth));
    lines.push(`${kIndent}}`);
  } else {
    lines.push(`${mIndent}${MARKER_ADD}${key}: ${formatPrimitive(val)}`);
  }
};

const handleBothKeys = (lines, key, val1, val2, kIndent, mIndent, depth) => {
  const obj1 = isObject(val1);
  const obj2 = isObject(val2);
  if (obj1 && obj2) {
    lines.push(`${kIndent}${key}: {`);
    lines.push(...formatStylishRec(val1, val2, depth + 1));
    lines.push(`${kIndent}}`);
  } else if (obj1 && !obj2) {
    pushRemoved(lines, mIndent, kIndent, key, val1, depth);
    lines.push(`${mIndent}${MARKER_ADD}${key}: ${formatPrimitive(val2)}`);
  } else if (!obj1 && obj2) {
    lines.push(`${mIndent}${MARKER_PREFIX}${key}: ${formatPrimitive(val1)}`);
    pushAdded(lines, mIndent, kIndent, key, val2, depth);
  } else if (val1 === val2) {
    lines.push(`${kIndent}${key}: ${formatPrimitive(val1)}`);
  } else {
    const v1 = formatPrimitive(val1);
    const v2 = formatPrimitive(val2);
    lines.push(`${mIndent}${MARKER_PREFIX}${key}: ${v1 === '' ? '' : v1}`);
    lines.push(`${mIndent}${MARKER_ADD}${key}: ${v2}`);
  }
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

    if (has1 && has2) {
      handleBothKeys(lines, key, val1, val2, kIndent, mIndent, depth);
    } else if (has1) {
      pushRemoved(lines, mIndent, kIndent, key, val1, depth);
    } else {
      pushAdded(lines, mIndent, kIndent, key, val2, depth);
    }
  }
  return lines;
};

const formatStylish = (data1, data2) => {
  const lines = ['{', ...formatStylishRec(data1, data2, 0), '}'];
  return lines.join('\n');
};

export default formatStylish;
