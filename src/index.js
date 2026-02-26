import parseFile from './parsers.js';

const formatValue = (value) => {
  if (typeof value === 'string') {
    return value;
  }
  return String(value);
};

const genDiff = (filepath1, filepath2, _format) => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);

  const keys = Array.from(
    new Set([...Object.keys(data1), ...Object.keys(data2)]),
  ).sort();

  const lines = keys.flatMap((key) => {
    const hasFirst = Object.prototype.hasOwnProperty.call(data1, key);
    const hasSecond = Object.prototype.hasOwnProperty.call(data2, key);

    if (hasFirst && hasSecond) {
      const value1 = data1[key];
      const value2 = data2[key];

      if (value1 === value2) {
        return `    ${key}: ${formatValue(value1)}`;
      }

      return [
        `  - ${key}: ${formatValue(value1)}`,
        `  + ${key}: ${formatValue(value2)}`,
      ];
    }

    if (hasFirst) {
      return `  - ${key}: ${formatValue(data1[key])}`;
    }

    return `  + ${key}: ${formatValue(data2[key])}`;
  });

  return ['{', ...lines, '}'].join('\n');
};

export default genDiff;

