import type { App, Component } from 'vue'

export const camelize = (str: string): string =>
  str.replace(/-(\w)/g, (_, c) => c.toUpperCase())

type EventShim = {
  new (...args: any[]): {
    $props: {
      onClick?: (...args: any[]) => void
    }
  }
}

export type WithInstall<T> = T & {
  install(app: App): void
} & EventShim

export function withInstall<T extends Component>(options: T) {
  ;(options as Record<string, unknown>).install = (app: App) => {
    const { name } = options
    if (name) {
      app.component(name, options)
      app.component(camelize(`-${name}`), options)
    }
  }

  return options as WithInstall<T>
}
