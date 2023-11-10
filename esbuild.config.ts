import { argv } from 'node:process';
import { watch } from 'node:fs/promises';
import * as esbuild from 'esbuild'
import { buildDocs } from './src/index';
import config from './src/config/defaultConfiguration';

const isProductionMode = (argv[3] === 'production');

if (!isProductionMode) {
    await buildDocs();

    const watchContext = await esbuild.context({
        entryPoints: ['./src/index.ts'],
        format: 'esm',
        platform: 'node',
        bundle: true,
        outdir: config.buildDirectory,
    });

    await watchContext.watch();

    const serveContext = await esbuild.context({ platform: 'node' })

    let { host, port } = await serveContext.serve({
        servedir: config.outputDirectory,
    });

    console.log(`Server is listening on http://${host}:${port}\nWatching for changes...`);

    const watcher = watch(config.docsDirectory, { recursive: true });

    for await (const event of watcher) {
        console.log(event);

        console.log(`Detected changes in ${event.filename}, rebuilding docs...`);
        await buildDocs();
    }

} else {
    await esbuild.build({
        entryPoints: ['./src/index.ts'],
        format: 'esm',
        platform: 'node',
        bundle: true,
        outdir: 'build',
    });
}