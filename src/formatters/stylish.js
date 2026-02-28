const INDENT_STEP = 4;

const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const formatValue = (value, depth) => {
  if (!isObject(value)) {
    if (value === null) return 'null';
    return String(value);
  }
  const indent = ' '.repeat((depth + 1) * INDENT_STEP);
  const bracketIndent = ' '.repeat(depth * INDENT_STEP);
  const lines = Object.entries(value).map(
    ([key, val]) => `${indent}${key}: ${formatValue(val, depth + 1)}`
  );
  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const formatStylish = (data1, data2) => {
  const iter = (obj1, obj2, depth = 1) => {
    const keys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])].sort();
    const currentIndent = ' '.repeat(depth * INDENT_STEP);
    const signIndent = ' '.repeat(depth * INDENT_STEP - 2);

    const lines = keys.flatMap((key) => {
      const has1 = Object.hasOwn(obj1, key);
      const has2 = Object.hasOwn(obj2, key);

      if (has1 && !has2) {
        return `${signIndent}- ${key}: ${formatValue(obj1[key], depth)}`;
      }
      if (!has1 && has2) {
        return `${signIndent}+ ${key}: ${formatValue(obj2[key], depth)}`;
      }
      if (isObject(obj1[key]) && isObject(obj2[key])) {
        return [
          `${currentIndent}${key}: {`,
          ...iter(obj1[key], obj2[key], depth + 1),
          `${currentIndent}}`,
        ];
      }
      if (obj1[key] === obj2[key]) {
        return `${currentIndent}${key}: ${formatValue(obj1[key], depth)}`;
      }
      return [
        `${signIndent}- ${key}: ${formatValue(obj1[key], depth)}`,
        `${signIndent}+ ${key}: ${formatValue(obj2[key], depth)}`,
      ];
    });

    return lines;
  };

  return ['{', ...iter(data1, data2, 1), '}'].join('\n');
};

export default formatStylish;
