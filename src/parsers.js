import { readFileSync } from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const getFilePath = (filepath) => path.resolve(process.cwd(), filepath);

const parseJson = (content) => JSON.parse(content);

const parseYaml = (content) => yaml.load(content);

const parsers = {
  '.json': parseJson,
  '.yml': parseYaml,
  '.yaml': parseYaml,
};

const parseFile = (filepath) => {
  const absolutePath = getFilePath(filepath);
  const ext = path.extname(absolutePath);
  const parser = parsers[ext];

  if (!parser) {
    throw new Error(`Unsupported format: ${ext}`);
  }

  const content = readFileSync(absolutePath, 'utf-8');
  return parser(content);
};

export default parseFile;
