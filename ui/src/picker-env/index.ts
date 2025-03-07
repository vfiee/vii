import { withInstall } from '../utils'
import _PickerEnv from './pickerEnv.vue'

export const PickerEnv = withInstall(_PickerEnv)
export default PickerEnv
export { pickerEnvProps } from './type'
export type { PickerEnvProps } from './type'

declare module 'vue' {
  export interface GlobalComponents {
    PickerEnv: typeof PickerEnv
  }
}
