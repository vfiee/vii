import { rm } from 'node:fs/promises'
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  clean: true,
  declaration: true,
  rollup: {
    inlineDependencies: true,
    esbuild: {
      target: 'node18',
      minify: true,
    },
  },
  hooks: {
    async 'build:done'() {
      await rm('dist/index.d.cts')
      await rm('dist/index.d.mts')
    },
  },
})
