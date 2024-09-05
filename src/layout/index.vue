<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div
      class="layout_slider"
      :class="{ fold: layoutSettingStore.fold ? true : false }"
    >
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="layoutSettingStore.fold ? true : false"
          :default-active="$route.path"
          background-color="#001529"
          text-color="white"
          active-text-color="#bf528f"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">
      <Tabbar></Tabbar>
    </div>
    <!-- 内容展示区域 -->
    <div class="layout_main">
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
// 获取路由对象
import { useRoute } from 'vue-router'
// 引入左侧菜单logo子组件
import Logo from './logo/index.vue'
import Menu from './menu/index.vue'
// 引入顶部导航组件
import Tabbar from './tabbar/index.vue'
// 右侧内容展示区域
import Main from './main/index.vue'
// 获取用户的小仓库
import useUserStore from '@/store/modules/user'
import useLayoutSettingStore from '@/store/modules/setting'
let userStore = useUserStore()
let layoutSettingStore = useLayoutSettingStore()

// 获取路由对象
let $route = useRoute()
</script>

<script lang="ts">
export default {
  name: 'Layout',
}
</script>

<style scoped lang="scss">
.layout_container {
  position: relative;
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base_menu_width;
    height: 100vh;
    background-color: $base_menu_background;
    transition: width 0.5s; /* 过渡效果 */

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base_menu_logo_height);

      .el-menu {
        border-right: none;
      }
    }

    &.fold {
      width: $base_menu_min_width; /* 折叠时的宽度 */
    }
  }

  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base_menu_width; /* 初始左侧边栏宽度 */
    width: calc(100% - $base_menu_width);
    height: $base_tabbar_height;
    transition:
      left 0.5s,
      width 0.5s; /* 过渡效果 */
  }

  .layout_main {
    position: absolute;
    top: $base_tabbar_height;
    left: $base_menu_width; /* 初始左侧边栏宽度 */
    width: calc(100% - $base_menu_width);
    height: calc(100vh - $base_tabbar_height);
    background-color: bisque;
    padding: 20px;
    overflow: auto;
    transition:
      left 0.5s,
      width 0.5s; /* 过渡效果 */
  }

  /* 当侧边栏折叠时，调整布局 */
  .layout_slider.fold ~ .layout_tabbar {
    left: $base_menu_min_width; /* 折叠后的左侧边栏宽度 */
    width: calc(100% - $base_menu_min_width); /* 调整宽度 */
  }

  .layout_slider.fold ~ .layout_main {
    left: $base_menu_min_width; /* 折叠后的左侧边栏宽度 */
    width: calc(100% - $base_menu_min_width); /* 调整宽度 */
  }
}
</style>
