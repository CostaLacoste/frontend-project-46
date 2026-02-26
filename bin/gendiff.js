#!/usr/bin/env node
import { Command } from 'commander';
import { createRequire } from 'module';
import genDiff from '../src/index.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const program = new Command();

program
  .name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version(pkg.version)
  .argument('<filepath1>')
  .argument('<filepath2>')
  .option('-f, --format [type]', 'output format')
  .action((filepath1, filepath2, options) => {
    const diff = genDiff(filepath1, filepath2, options.format);
    if (diff !== undefined) {
      console.log(diff);
    }
  });

program.parse();
