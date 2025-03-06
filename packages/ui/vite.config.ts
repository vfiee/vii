import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { version } from './package.json'

export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(version),
  },
  build: {
    minify: true,
    sourcemap: true,
    lib: {
      name: 'VUI',
      entry: resolve(__dirname, 'index.ts'),
    },
    rollupOptions: {
      external: ['vue', /\.less/, '@vii/shared'],
      output: [
        {
          format: 'cjs',
          preserveModules: true,
          preserveModulesRoot: __dirname,
          dir: 'lib',
          entryFileNames: '[name].cjs',
        },
        {
          format: 'es',
          preserveModules: true,
          preserveModulesRoot: __dirname,
          dir: 'es',
          entryFileNames: '[name].mjs',
        },
      ],
    },
  },
  plugins: [
    vue(),
    dts({
      exclude: ['node_modules'],
      outDir: ['es', 'lib'],
      compilerOptions: {
        sourceMap: false,
        paths: {
          '@/*': ['./*'],
          vui: ['.'],
          vant: ['node_modules/vant'],
        },
      },
      rollupTypes: true,
      copyDtsFiles: true,
      pathsToAliases: false,
    }),
  ],
})
