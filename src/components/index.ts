import { App } from 'vue'
import SvgIcon from './SvgIcon/index.vue'
import pagination from './pagination/index.vue'
import Category from './Category/index.vue'
// 引入element-plus提供的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局对象
const allGlobalComponent = { SvgIcon, pagination, Category }

// 对外暴露插件对象
export default {
  install(app: App) {
    Object.keys(allGlobalComponent).forEach((key) => {
      // 使用类型断言，将 key 断言为 allGlobalComponent 的键
      app.component(
        key,
        allGlobalComponent[key as keyof typeof allGlobalComponent],
      )
    })
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
