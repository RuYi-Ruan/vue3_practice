import { createApp } from 'vue'
import App from './App.vue'

// 引入element-plus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// svg插件配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件，注册整个项目的全局组件
import globalComponent from '@/components'
// 引入模版的全局样式
import '@/styles/index.scss'
// 引入路由
import router from './router/index'
// 引入仓库pinia
import pinia from './store'
// 引入路由鉴权文件
import './permission'

const app = createApp(App)
app.use(ElementPlus, {
  locale: zhCn,
})
// 安装自定义插件
app.use(globalComponent)
app.use(ElementPlus)
// 注册模板路由
app.use(router)
// 安装pinia
app.use(pinia)
app.mount('#app')
