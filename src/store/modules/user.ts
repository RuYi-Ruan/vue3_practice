//创建用户相关的小仓库
import { defineStore } from 'pinia'
//引入接口
import { reqLogin } from '@/api/user'
import type {
    loginFormData,
} from '@/api/user/type'

//创建用户小仓库
const useUserStore = defineStore('User', {
    //小仓库存储数据地方
    state: () => {
        return {
            token:localStorage.getItem("TOKEN")
        }
    },
    //异步|逻辑的地方
    actions: {
        //用户登录的方法
        async userLogin(data: loginFormData) {
            //登录请求
            const result:any = await reqLogin(data)
            //登录请求:成功200->token
            //登录请求:失败201->登录失败错误的信息
            if (result.code == 200) {
                //pinia仓库存储一下token    
                this.token = result.data.token
                // 本地存储持久化存储一份
                localStorage.setItem("TOKEN", result.data.token);
                return 'ok';  // 保证当前async函数返回一个成功的promise
            } else {
                return Promise.reject(new Error(result.data.message));
            }
        },
    },
    getters: {},
})
//对外暴露获取小仓库方法
export default useUserStore