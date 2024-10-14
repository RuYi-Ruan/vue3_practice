// 路由鉴权：项目当中路由能否被访问的权限设置
import router from './router'
import nprogress from 'nprogress'
import setting from './setting'
// 引入进度条样式
import 'nprogress/nprogress.css'
import pinia from './store'
// 获取用户相关的小仓库内部token数据，去判断用户是否登陆成功
import useUserStore from './store/modules/user'
nprogress.configure({ showSpinner: false })

// 全局守卫：项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to, _from, next) => {
  // to: 你将要访问那个路由
  // from：你从哪个路由而来
  // next: 路由的放行函数
  // 访问某一个路由之前的守卫
  nprogress.start()
  let userStore = useUserStore(pinia)
  // 获取用户token，去判断用户登录、还是未登录
  let token = userStore.token
  let username = userStore.username
  // 用户登录判断
  if (token) {
    // 用户登陆成功
    // 登录成功访问login，不能访问指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      // 登录成功访问其它六个路由
      // 如果有用户信息则放行
      if (username) {
        next()
      } else {
        try {
          // 如果没有则等待获取到用户信息然后放行
          await userStore.userInfo()
          // 刷新时如果是异步路由有可能获取到用户信息，但是异步路由还没加载完毕，因此会出现白屏效果

          next({ ...to })
        } catch (error) {
          // token过期：获取不到用户信息 | 用户手动修改本地存储token
          // 退出登录 -> 用户相关的数据清空
          await userStore.userLogout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
  next()
})

// 全局后置守卫
router.afterEach((to, _from, _next) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.done()
})
