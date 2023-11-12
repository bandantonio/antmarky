import { argv } from 'node:process';
import * as esbuild from 'esbuild';

const esbuildContext = {
    entryPoints: ['src/index.ts'],
    external: ['esbuild', 'asciidoctor'],
    outfile: `bin/index.cjs`,
    platform: 'node',
    logLevel: 'info',
    bundle: true,
    minify: true,
    metafile: true,
};

const isProductionMode = (argv[3] === 'production');

if (!isProductionMode) {
    const ctx = await esbuild.context(esbuildContext);

    await ctx.watch();
} else {
    await esbuild.build(esbuildContext)
        .then(() => {
            console.log('Bundling completed successfully!');
        })
        .catch(() => process.exit(1));
}