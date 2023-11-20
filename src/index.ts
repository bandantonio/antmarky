#! /usr/bin/env node

import { Command } from 'commander';
import pkg from '../package.json';
import config from '../src/config/defaultConfiguration'
import buildDocs from './commands/build';
import serveDocs from './commands/serve';

const program = new Command();

program
    .name(pkg.name)
    .description(pkg.description)
    .version(pkg.version, '-v, --version', 'Display version information')
    .helpOption('-h, --help', 'Display help information')
    .action(() => {
        program.outputHelp();
        process.exit(0);
    });

program.command('build')
    .description('Build documentation from the default directory')
    .argument('[source]', 'Source directory with Asciidoctor files', config.docsDirectory)
    .argument('[destination]', 'Destination directory for the generated site', config.outputDirectory)
    .action(async () => {
        await buildDocs();
    });

program.command('serve')
    .description('Serve documentation from the default directory')
    .action(async () => {
        await serveDocs();
    });

program.parse(process.argv);