<template>
  <div class="tabbar_right">
    <el-button
      size="small"
      icon="Refresh"
      circle
      @click="updateRefresh"
    ></el-button>
    <el-button
      size="small"
      icon="FullScreen"
      circle
      @click="fullScreen"
    ></el-button>
    <el-button size="small" icon="Setting" circle></el-button>
    <img
      :src="userStore.avatar"
      alt=""
      style="width: 36px; height: 36px; margin: 0 10px"
    />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        {{ userStore.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
// 引入用户仓库
import useUserStore from '@/store/modules/user'
// 引入setting小仓库
import useLayoutSettingStore from '@/store/modules/setting'
// 引入路由器
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

let userStore = useUserStore()
let layoutSettingStore = useLayoutSettingStore()
let $router = useRouter()
let $route = useRoute()

// 刷新按钮回调
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh
}
// 全屏点击按钮回调
const fullScreen = () => {
  console.log(document.fullscreenElement)
  // DOM对象的一个属性：可以用来判断当前是不是全屏模式[全屏：true，不是全屏：false]
  let full = document.fullscreenElement
  // 如果不是全屏则切换为全屏模式
  if (!full) {
    // 文档根节点的方法requestFullscreen，实现全屏模式
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏模式
    document.exitFullscreen()
  }
}
// 退出登录按钮回调
const logout = async () => {
  // 第一件事情：需要向服务器发请求[退出登录接口]
  // 第二件事情：仓库当中关于用于相关的数据情况[token|username|avatar]
  await userStore.userLogout()
  // 跳转到登录页面
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style lang="scss" scoped>
.tabbar_right {
  display: flex;
  align-items: center;

  img {
    border-radius: 50%; /* 圆形图片 */
    border: 1px solid #fff; /* 给图片添加白色边框 */
  }
}

.el-button {
  color: #fff;
  background-color: transparent; /* 透明背景 */
  border: none; /* 移除边框 */
  margin: 0 5px;
  font-size: 18px; /* 增大字体大小 */
  padding: 6px; /* 增加内边距以扩大按钮区域 */

  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* 悬停效果 */
  }
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px; /* 调整下拉菜单字体大小 */

  .el-icon--right {
    margin-left: 5px;
    font-size: 18px; /* 调整下拉图标大小 */
  }
}

.el-icon {
  font-size: 20px; /* 放大图标的尺寸 */
}
</style>
