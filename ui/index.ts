import { App } from 'vue'
import * as components from './src/components'
import { WithInstall } from './src/utils'

export default {
  install: (app: App) => {
    for (const component in components) {
      ;(component as WithInstall<any>).install(app)
    }
  },
}
