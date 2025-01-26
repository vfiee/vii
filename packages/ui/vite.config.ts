import vue from '@vitejs/plugin-vue'
import DefineOptions from 'unplugin-vue-define-options/vite'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    minify: true,
    rollupOptions: {
      external: ['vue', /\.less/, '@vii/shared'],
      input: ['./src/picker-env/index.ts'],
      output: [
        {
          dir: './es',
          format: 'es',
          exports: 'named',
          entryFileNames: '[name].mjs',
        },
        {
          dir: './lib',
          format: 'cjs',
          exports: 'named',
          entryFileNames: '[name].js',
        },
      ],
    },
    lib: {
      entry: './index.ts',
      name: 'ui',
    },
  },
  plugins: [
    vue(),
    dts({
      entryRoot: './src',
      rollupTypes: true,
      outDir: ['./es', './lib'],
      tsconfigPath: './tsconfig.json',
    }),
    DefineOptions(),
    {
      name: 'file',
      generateBundle(config, bundle) {
        const keys = Object.keys(bundle)
        for (const key of keys) {
          this.emitFile({
            type: 'asset',
            fileName: key,
          })
        }
      },
    },
  ],
})
