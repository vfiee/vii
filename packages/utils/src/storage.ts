// 获取存储中的值，可以通过路径获取嵌套对象的值
export function getStorage(
  key: string,
  path?: string,
  defaultValue?: any,
): any {
  const value = localStorage.getItem(key)
  if (value) {
    const parsedValue = JSON.parse(value)

    // 解析自定义路径
    const keys = path ? parsePath(path) : [] // 如果没有路径，则使用空数组
    let temp: any = parsedValue

    for (const key of keys) {
      if (temp && key in temp) {
        temp = temp[key]
      } else {
        return defaultValue // 如果路径不存在，返回默认值
      }
    }
    return temp // 返回指定路径的值
  }
  return defaultValue // 如果没有值，返回默认值
}

// 解析路径
function parsePath(path: string): (string | number)[] {
  const regex = /(\w+|\d+)/g // 匹配键和数组索引
  return (
    path.match(regex)?.map((key) => (isNaN(Number(key)) ? key : Number(key))) ||
    []
  )
}

// 设置存储的值
export function setStorage(key: string, value: any): void {
  localStorage.setItem(key, JSON.stringify(value))
}

// 移除存储，可以一次移除多个key
export function removeStorage(key: string | string[]): void {
  if (Array.isArray(key)) {
    key.forEach((k) => localStorage.removeItem(k))
  } else {
    localStorage.removeItem(key)
  }
}

// 清空所有存储
export function clearStorage(): void {
  localStorage.clear()
}
