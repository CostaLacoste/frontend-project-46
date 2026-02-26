import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import genDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

describe('genDiff', () => {
  test('compares two nested JSON files and returns stylish diff', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');
    const expectedPath = getFixturePath('expected-nested-stylish.txt');

    const result = genDiff(filepath1, filepath2);
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });

  test('returns string', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');

    const result = genDiff(filepath1, filepath2);

    expect(typeof result).toBe('string');
  });

  test('identical files produce no minus/plus lines for values', () => {
    const filepath1 = getFixturePath('nested1.json');
    const result = genDiff(filepath1, filepath1);

    expect(result).toContain('setting1: Value 1');
    expect(result).not.toMatch(/\s[-+]\s/);
  });

  test('compares two nested YAML files and returns stylish diff', () => {
    const filepath1 = getFixturePath('nested1.yml');
    const filepath2 = getFixturePath('nested2.yml');
    const expectedPath = getFixturePath('expected-nested-stylish.txt');

    const result = genDiff(filepath1, filepath2);
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });

  test('nested YAML and JSON with same data produce same diff', () => {
    const json1 = getFixturePath('nested1.json');
    const yaml2 = getFixturePath('nested2.yml');
    const expectedPath = getFixturePath('expected-nested-stylish.txt');

    const result = genDiff(json1, yaml2);
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });

  test('default format is stylish', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');
    const expectedPath = getFixturePath('expected-nested-stylish.txt');

    const result = genDiff(filepath1, filepath2, 'stylish');
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });

  test('plain format: compares nested files and returns plain diff', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');
    const expectedPath = getFixturePath('expected-plain.txt');

    const result = genDiff(filepath1, filepath2, 'plain');
    const expected = readFileSync(expectedPath, 'utf-8').trim();

    expect(result).toBe(expected);
  });

  test('plain format: uses [complex value] for nested objects', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');

    const result = genDiff(filepath1, filepath2, 'plain');

    expect(result).toContain('[complex value]');
    expect(result).toContain("was added with value: [complex value]");
    expect(result).toContain("From [complex value] to 'str'");
  });

  test('json format: returns valid JSON array of changes', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');

    const result = genDiff(filepath1, filepath2, 'json');

    expect(() => JSON.parse(result)).not.toThrow();
    const parsed = JSON.parse(result);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBeGreaterThan(0);
    parsed.forEach((node) => {
      expect(node).toHaveProperty('type');
      expect(node).toHaveProperty('key');
      expect(['added', 'removed', 'updated']).toContain(node.type);
    });
  });

  test('json format: contains expected change types and keys', () => {
    const filepath1 = getFixturePath('nested1.json');
    const filepath2 = getFixturePath('nested2.json');

    const result = genDiff(filepath1, filepath2, 'json');
    const parsed = JSON.parse(result);

    const added = parsed.find((n) => n.type === 'added' && n.key === 'common.follow');
    expect(added).toBeDefined();
    expect(added.value).toBe(false);

    const removed = parsed.find((n) => n.type === 'removed' && n.key === 'group2');
    expect(removed).toBeDefined();

    const updated = parsed.find((n) => n.type === 'updated' && n.key === 'common.setting3');
    expect(updated).toBeDefined();
    expect(updated.oldValue).toBe(true);
    expect(updated.newValue).toBe(null);
  });
});
