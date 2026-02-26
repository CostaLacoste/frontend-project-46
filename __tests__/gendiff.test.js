import { fileURLToPath } from 'url';
import path from 'path';
import { readFileSync } from 'fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('genDiff', () => {
  test('compares two flat JSON files and returns stylish diff', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');
    const expectedPath = getFixturePath('expected-stylish.txt');

    const result = genDiff(filepath1, filepath2);
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });

  test('returns string', () => {
    const filepath1 = getFixturePath('file1.json');
    const filepath2 = getFixturePath('file2.json');

    const result = genDiff(filepath1, filepath2);

    expect(typeof result).toBe('string');
  });

  test('identical files produce no minus/plus lines for values', () => {
    const filepath1 = getFixturePath('file1.json');
    const result = genDiff(filepath1, filepath1);

    expect(result).toContain('host: hexlet.io');
    expect(result).not.toMatch(/\s[-+]\s/);
  });

  test('compares two flat YAML files and returns stylish diff', () => {
    const filepath1 = getFixturePath('file1.yml');
    const filepath2 = getFixturePath('file2.yml');
    const expectedPath = getFixturePath('expected-stylish.txt');

    const result = genDiff(filepath1, filepath2);
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });

  test('YAML and JSON with same data produce same diff', () => {
    const json1 = getFixturePath('file1.json');
    const yaml2 = getFixturePath('file2.yml');
    const expectedPath = getFixturePath('expected-stylish.txt');

    const result = genDiff(json1, yaml2);
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });
});
