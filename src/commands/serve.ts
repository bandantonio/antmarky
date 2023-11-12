import * as esbuild from 'esbuild';
import { watch } from 'fs/promises';
import path from 'path';
import config from '../config/defaultConfiguration';
import buildDocs from "./build";

const serveDocs = async () => {

    let esbuildServeContext = await esbuild.context({
        bundle: true,
        platform: 'node',
        preserveSymlinks: true,
        outdir: 'dist',
    });

    await buildDocs();
    await esbuildServeContext.watch()

    let { host, port } = await esbuildServeContext.serve({
        servedir: 'dist'
    }).catch(() => {
        throw new Error('Failed to serve files');
    });

    console.log(`Serving docs at http://${host}:${port}`);

    let wather = watch(path.resolve(config.docsDirectory), { recursive: true });

    for await (let event of wather) {
        console.log(`File ${event.filename} changed`);
        await buildDocs();
    }

}

export default serveDocs;