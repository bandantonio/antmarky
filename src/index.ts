#! /usr/bin/env node

import { Command } from 'commander';
const pkg = require('../package.json');
import buildDocs from './commands/build';
import serveDocs from './commands/serve';

const program = new Command();

program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version)

program.command('build')
    .description('Build documentation from the default (docs) directory')
    .action(async () => {
        await buildDocs();
    });

program.command('serve')
    .description('Serve documentation from the default (docs) directory')
    .action(async () => {
        await serveDocs();
    });

program.parse(process.argv);