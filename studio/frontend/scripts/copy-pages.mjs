import {cp,mkdir} from 'node:fs/promises';
import path from 'node:path';
const repo=path.resolve(import.meta.dirname,'../../..');
await mkdir(path.join(repo,'.svelte-kit/cloudflare'),{recursive:true});
await cp(path.resolve(import.meta.dirname,'../dist'),path.join(repo,'.svelte-kit/cloudflare'),{recursive:true});
