import { ComputedRef, ExtractPropTypes, PropType, Ref } from 'vue'

export type EnvStore = EnvStoreState & EnvStoreActions & EnvStoreGetters

export interface EnvStoreState {
  visible: Ref<boolean>
  envs: Ref<EnvConfig[]>
}

export interface EnvStoreActions {
  show: () => void
  hide: () => void
  toggle: (visible?: boolean) => void
  setCurrentEnv: (env: EnvConfig) => void
  getCurrentEnvModule: (moduleName?: EnvModuleName) => EnvModule
  setCurrentEnvByIndex: (index: number) => void
}

export interface EnvStoreGetters {
  mapColumns: ComputedRef<EnvConfig[]>
  currentEnv: ComputedRef<EnvConfig>
}

export interface EnvStoreOptions {
  config: EnvConfig[]
}

export type EnvType = 'development' | 'test' | 'production' | 'mock'

export type EnvModuleName = 'common' | string

export interface EnvModule {
  url: string
  proxyPrefix: string
  [key: string]: any
}

export interface EnvModules {
  [key: EnvModuleName]: EnvModule
}

export interface EnvConfig {
  env: EnvType
  name: string
  active?: boolean
  modules: EnvModules
  [key: string]: any
}

export const pickerEnvProps = {
  envs: {
    type: Array as PropType<EnvConfig[]>,
  },
}

export type PickerEnvProps = ExtractPropTypes<typeof pickerEnvProps>
