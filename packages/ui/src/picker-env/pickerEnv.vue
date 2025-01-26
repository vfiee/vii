<script lang="ts" setup>
import { PickerConfirmEventParams } from 'vant';
import { watch } from 'vue';
import { EnvConfig } from './type';
import { getEnvs, useEnvStore } from './utils';

defineOptions({
  name: 'PickerEnv',
})

const props = defineProps<{
  envs: EnvConfig[]
}>()

const envStore = useEnvStore()
const columnsFieldNames = { text: 'name', value: 'env' }

const onConfirm = ({ selectedIndexes }: PickerConfirmEventParams) => {
  const [selectedIndex] = selectedIndexes
  envStore.setCurrentEnvByIndex(selectedIndex)
  envStore.hide()
}

watch(
  props.envs,
  (newEnvs) => {
    envStore.envs.value = getEnvs(newEnvs)
  },
  { immediate: true },
)
</script>
<template>
  <van-popup
    v-model:show="envStore.visible.value"
    destroy-on-close
    round
    position="bottom"
    safe-area-inset-bottom
    safe-area-inset-top
    teleport="body"
  >
    <van-picker
      title="请选择环境"
      :model-value="[envStore.currentEnv.value.env]"
      :columns="envStore.mapColumns.value"
      :columnsFieldNames="columnsFieldNames"
      @cancel="envStore.hide"
      @confirm="onConfirm"
    />
  </van-popup>
</template>
