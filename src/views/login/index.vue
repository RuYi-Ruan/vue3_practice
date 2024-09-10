<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <!-- 登录表单 -->
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <!-- 标题 -->
          <h1>Hello</h1>
          <h2>欢迎来到鬼谷甄选</h2>
          <!-- 账户 -->
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.username"
            ></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.password"
              show-password
            ></el-input>
          </el-form-item>
          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
// 收集账号与密码
import { reactive, ref } from 'vue'
// 引入用户相关的小仓库
import useUserStroe from '@/store/modules/user'
import { loginFormData } from '@/api/user/type'
import { useRouter, useRoute} from 'vue-router'
import { ElNotification } from 'element-plus'
import { get_cur_time } from '@/utils/time'

// 获取el-form组件爱你
let loginForms = ref()
// 获取路由器对象
let $router = useRouter()
// 获取路由对象
let $route = useRoute()
// 定义变量控制按钮加载效果
let loading = ref(false)
const userStore = useUserStroe()
// 收集账号与密码的数据
let loginForm: loginFormData = reactive({
  username: '',
  password: '',
})
// 登录按钮回调
const login = async () => {
  // 要保证全部表单校验通过再发请求
  await loginForms.value.validate()
  // 启动加载效果
  loading.value = true
  // 通知仓库发登录请求
  // 请求成功->首页展示数据的地方
  // 请求失败->弹出登陆失败的信息
  try {
    // 保证登录成功
    await userStore.userLogin(loginForm)
    // 通过编程式导航跳转到数据首页
    // 判断登录的时刻，路由路径当中是否有query参数，如果有就往query参数跳转，没有则跳回首页
    let redirect: any = $route.query.redirect
    $router.push({path: redirect || '/'})
    // 登陆成功提示信息
    ElNotification({
      type: 'success',
      message: '欢迎回来',
      title: `Hi, ${get_cur_time()}`,
    })
    loading.value = false
  } catch (error) {
    // 登陆失败提示信息
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
    loading.value = false
  }
}

// 自定义校验规则，用于检查用户名中是否包含空格
const check_space = (_rule: any, value: any, callback: any) => {
  // _rule: FormItemRule -> 该参数表示当前校验规则对象，但在这个自定义校验中未被使用，因此用下划线命名，表示未使用
  // value: string -> 当前被校验的输入值，在这里是用户名的输入
  // callback: (error?: Error) => void -> 回调函数，用于返回校验结果
  if (value.includes(' ')) {
    // 检查当前输入的用户名中是否包含空格
    // 如果包含空格，则调用 callback 函数并传入一个新的 Error 对象作为参数
    // Error 对象的消息为 '用户名中不能含有空格'
    callback(new Error('用户名中不能含有空格'))
  } else {
    // 如果用户名中不包含空格，表示校验通过
    // 调用 callback 函数且不传入参数，表示没有错误
    callback()
  }
}

// 定义表单校验需要配置的对象
// 规则对象属性:
// required,代表这个字段务必要校验的//min:文本长度至少多少位
// max:文本长度最多多少位//message:错误的提示信息
// trigger:触发校验表单的时机 change->文本发生变化触发校验, blur:失去焦点的时候触发校验规则
const rules = {
  // 需要校验的字段
  username: [
    { min: 4, max: 10, message: '字数限制在4-10之间', trigger: 'change' },
    { validator: check_space, trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 15, message: '密码至少需要6位', trigger: 'change' },
    { validator: check_space, trigger: 'change' },
  ],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/name_bg.jpg') no-repeat;
  background-size: cover;
}

.login_form {
  position: relative;
  width: 80%;
  top: 30vh;
  background: url('@/assets/images/login_form.png');
  background-size: cover;
  padding: 40px;

  h1 {
    color: white;
    font-size: 40px;
  }

  h2 {
    color: white;
    font-size: 20px;
    margin: 20px 0;
  }
}

.login_btn {
  width: 100%;
}
</style>
