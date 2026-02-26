const INDENT_STEP = 4;

const isObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value);

const formatValue = (value, depth) => {
  if (!isObject(value)) {
    if (value === null) return 'null';
    return String(value);
  }

  const indent = ' '.repeat(depth * INDENT_STEP);
  const bracketIndent = ' '.repeat((depth - 1) * INDENT_STEP);

  const lines = Object.entries(value).map(
    ([key, val]) =>
      `${indent}${key}: ${formatValue(val, depth + 1)}`
  );

  return `{\n${lines.join('\n')}\n${bracketIndent}}`;
};

const formatStylish = (data1, data2) => {
  const iter = (obj1, obj2, depth) => {
    const keys = [...new Set([...Object.keys(obj1), ...Object.keys(obj2)])].sort();

    const indent = ' '.repeat(depth * INDENT_STEP - 2);
    const bracketIndent = ' '.repeat((depth - 1) * INDENT_STEP);

    const lines = keys.flatMap((key) => {
      const has1 = Object.prototype.hasOwnProperty.call(obj1, key);
      const has2 = Object.prototype.hasOwnProperty.call(obj2, key);

      if (has1 && !has2) {
        return `${indent}- ${key}: ${formatValue(obj1[key], depth + 1)}`;
      }

      if (!has1 && has2) {
        return `${indent}+ ${key}: ${formatValue(obj2[key], depth + 1)}`;
      }

      if (isObject(obj1[key]) && isObject(obj2[key])) {
        const nested = iter(obj1[key], obj2[key], depth + 1);
        return [
          `${' '.repeat(depth * INDENT_STEP)}${key}: {`,
          ...nested,
          `${' '.repeat(depth * INDENT_STEP)}}`,
        ];
      }

      if (obj1[key] === obj2[key]) {
        return `${' '.repeat(depth * INDENT_STEP)}${key}: ${formatValue(obj1[key], depth + 1)}`;
      }

      return [
        `${indent}- ${key}: ${formatValue(obj1[key], depth + 1)}`,
        `${indent}+ ${key}: ${formatValue(obj2[key], depth + 1)}`,
      ];
    });

    return lines;
  };

  const result = [
    '{',
    ...iter(data1, data2, 1),
    '}',
  ];

  return result.join('\n');
};

export default formatStylish;
