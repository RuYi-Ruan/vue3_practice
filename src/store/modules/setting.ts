import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, // 用户控制菜单折叠还是收起
      refresh: false, // 用于控制刷新效果
      dark: false  // 用于控制暗黑模式的切换
    }
  },
})

export default useLayoutSettingStore
