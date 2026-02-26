import { readFileSync } from 'fs';
import path from 'path';

const getFilePath = (filepath) => path.resolve(process.cwd(), filepath);

const parseFile = (filepath) => {
  const data = readFileSync(getFilePath(filepath), 'utf-8');
  return JSON.parse(data);
};

export default parseFile;

