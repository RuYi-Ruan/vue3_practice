<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade-scale">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
</script>

<script lang="ts">
export default {
  name:'Main'
}
</script>

<style lang="scss" scoped>
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95); /* 初始缩小 */
}
.fade-scale-enter-active {
  transition: opacity 0.4s ease-out, transform 0.4s ease-out; /* 平滑过渡 */
}
.fade-scale-enter-to {
  opacity: 1;
  transform: scale(1); /* 恢复原始大小 */
}

.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1); /* 保持原始大小 */
}
.fade-scale-leave-active {
  transition: opacity 0.3s ease-in, transform 0.3s ease-in; /* 离开时动画略快 */
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95); /* 离开时缩小 */
}
</style>
