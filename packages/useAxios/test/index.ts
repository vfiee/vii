import axios, { AxiosRequestConfig } from 'axios'
import { watch } from 'vue'
import { useAxios as baseUseAxios, type UseAxiosOptions } from '../src'

const instance = axios.create({
  timeout: 30000,
  adapter: 'fetch',
  timeoutErrorMessage: '请求超时',
  headers: {
    'Content-Type': 'application/json',
  },
})

function onRejected(error: any) {
  console.error(`onRejected:`, error)
}

instance.interceptors.request.use((config) => {
  console.log(`config:`, config)
  return config
})

instance.interceptors.response.use(
  (response) => {
    const { code } = response?.data || {}
    if (code === 1) {
      return Promise.resolve(response?.data)
    }
    onRejected(response)
    return Promise.reject(response)
  },
  (error) => {
    console.log(`catch error:`, error)
    if (!error?.request?.signal?.aborted) {
      onRejected(error?.response || error)
    }
    return Promise.reject(error)
  },
)

export const useAxios = (
  url: string,
  config: AxiosRequestConfig,
  options?: UseAxiosOptions,
) => {
  return baseUseAxios(url, config, instance, {
    immediate: false,
    ...(options || {}),
  })
}

const { isLoading, data, error, execute } = useAxios(
  'https://api.thecatapi.com/v1/images/search',
  { method: 'get' },
)

watch([isLoading, data, error], (list) => {
  console.log(`list:`, list)
})

await execute()
