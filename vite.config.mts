import { qwikVite } from '@qwik.dev/core/optimizer';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import pkg from './package.json';
import { qwikReact } from '@qwik.dev/react/vite';
import { qwikDevtools } from './plugin';
import { createRequire } from 'module';
const { dependencies = {}, peerDependencies = {} } = pkg as any;
const makeRegex = (dep) => new RegExp(`^${dep}(/.*)?$`);
const excludeAll = (obj) => Object.keys(obj).map(makeRegex);
const require = createRequire(import.meta.url);
const isBuild = process.argv.includes('lib');

export default defineConfig(() => {
  return {
    resolve: {
      alias: isBuild
        ? undefined
        : {
            '@devtools/ui': require.resolve('.'),
            '@qwik.dev/devtools/ui': require.resolve('.'),
          },
    },
    build: {
      target: 'es2020',
      lib: {
        entry: './src/index.ts',
        formats: ['es', 'cjs'],
        fileName: (format, entryName) =>
          `${entryName}.qwik.${format === 'es' ? 'mjs' : 'cjs'}`,
      },
      rollupOptions: {
        output: {
          preserveModules: true,
          preserveModulesRoot: 'src',
        },
        // externalize deps that shouldn't be bundled into the library
        external: [
          'stream',
          'util',
          /^node:.*/,
          ...excludeAll(peerDependencies),
          ...excludeAll(dependencies),
        ],
      },
    },
    plugins: [qwikVite(), tsconfigPaths(), qwikReact(), qwikDevtools()],
  };
});
