import { App } from 'vue'
import * as components from './src/index'
import { WithInstall } from './src/utils'
export * from './src/index'

export default {
  install: (app: App) => {
    for (const component in components) {
      ;(component as WithInstall<any>).install(app)
    }
  },
}
