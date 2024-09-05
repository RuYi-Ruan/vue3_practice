<template>
  <div class="tabbar_left">
    <!-- 顶部左侧静态 -->
    <el-icon style="margin-right: 10px" @click="changeIcon">
      <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <!-- 左侧面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
      <!-- 面包屑动态展示路由名字与标题 -->
      <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title" :to="item.path">
        <!-- 图标 -->
        <el-icon style="margin: 2px;">
          <component :is="item.meta.icon"></component>
        </el-icon>
        <!-- 标题 -->
        {{ item.meta.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting'
import { useRoute } from 'vue-router';
let layoutSettingStore = useLayoutSettingStore()

let $route = useRoute()

// 点击图标的切换方法
const changeIcon = () => {
  // 切换图标
  layoutSettingStore.fold = !layoutSettingStore.fold
}
</script>

<script lang="ts">
export default {
  name: 'Breadcrumb',
}
</script>

<style lang="scss" scoped>
.tabbar_left {
  display: flex;
  align-items: center;

  /* 确保所有文字都是白色 */
  * {
    color: #ffffff !important; /* 强制设为白色 */
    font-weight: 500; /* 适度加粗 */
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); /* 轻微的文字阴影增强对比度 */
  }
}

.el-breadcrumb {
  color: #ffffff !important; /* 强制设为白色 */
  font-weight: 500; /* 适度加粗 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); /* 轻微的文字阴影增强对比度 */
}
</style>
