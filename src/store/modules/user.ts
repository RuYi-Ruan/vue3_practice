//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type { UserState } from './types/type'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入常量路由
import { anyRoute, asyncRoute, constantRoute } from '@/router/routes'
import {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type'
import router from '@/router'
// @ts-ignore
import lodash from 'lodash' 

// 用于过滤当前用户需要过滤的异步路由
const filterAsyncRoute = (asyncRoute: any, routes: any) => {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  })

}

//创建用户小仓库
const useUserStore = defineStore('User', {
  //小仓库存储数据地方
  state: (): UserState => {
    return {
      token: GET_TOKEN(), // 用户唯一标识token
      menuRoutes: constantRoute,
      username: '',
      avatar: '',
      // 存储当前用户的按钮权限
      buttons: []
    }
  },
  //异步|逻辑的地方
  actions: {
    //用户登录的方法
    async userLogin(data: loginFormData) {
      //登录请求
      const result: loginResponseData = await reqLogin(data)
      //登录请求:成功200->token
      //登录请求:失败201->登录失败错误的信息
      if (result.code == 200) {
        //pinia仓库存储一下token
        this.token = result.data as string
        // 本地存储持久化存储一份
        SET_TOKEN(result.data as string)
        return 'ok' // 保证当前async函数返回一个成功的promise
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 获取用户信息方法
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()

      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = '../src/assets/images/avatar1.gif'
        this.buttons = result.data.buttons;
        // 过滤得到当前用户所需的异步路由
        // 通过深拷贝解决不同用户登录导致的路由覆盖问题
        let userAsyncRoute = filterAsyncRoute(lodash.cloneDeep(asyncRoute), result.data.routes);
        // 菜单的数据
        this.menuRoutes = [...constantRoute, ...userAsyncRoute, ...anyRoute];
        // 目前路由管理器只有常量路由：将过滤后的异步路由、任意路由动态追加
        [...userAsyncRoute, ...anyRoute].forEach((route: any) => {
          router.addRoute(route);
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    // 退出登录方法
    async userLogout() {
      // 目前没有mock接口：退出登录接口(通知服务器本地用户唯一标识失效)
      let result: any = await reqLogout()
      if (result.code == 200) {
        this.token = ''
        this.username = ''
        this.avatar = ''
        REMOVE_TOKEN()
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})
//对外暴露获取小仓库方法
export default useUserStore
