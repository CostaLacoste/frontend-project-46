#!/usr/bin/env node
import { Command } from 'comander'
import pkg from '../package.json' assert { type: 'json' }

const program = new Command();

program