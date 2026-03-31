import parseFile from './parsers.js';
import getFormatter from './formatters/index.js';

const defaultFormat = 'stylish';

const genDiff = (filepath1, filepath2, format = defaultFormat) => {
  const data1 = parseFile(filepath1);
  const data2 = parseFile(filepath2);
  const formatFn = getFormatter(format);
  return formatFn(data1, data2);
};

export default genDiff;

