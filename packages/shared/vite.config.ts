import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    target: 'modules',
    outDir: 'es',
    minify: true,
    rollupOptions: {
      input: ['./src/index.ts'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          dir: resolve(__dirname, 'es'),
        },
        {
          format: 'cjs',
          entryFileNames: '[name].cjs.js',
          dir: resolve(__dirname, 'lib'),
        },
      ],
    },
    lib: {
      entry: './src/index.ts',
      name: 'shared',
    },
  },

  plugins: [
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
      tsconfigPath: resolve(__dirname, './tsconfig.json'),
    }),
  ],
})
