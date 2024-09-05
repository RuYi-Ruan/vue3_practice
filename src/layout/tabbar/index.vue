<template>
  <div class="tabbar">
    <!-- 导航栏左侧区域 -->
    <div>
      <Breadcrumb />
    </div>
    <!-- 导航栏右侧区域 -->
    <div>
      <Setting />
    </div>
  </div>
</template>

<script setup lang="ts">
import Breadcrumb from './breadcrumb/index.vue'
import Setting from './setting/index.vue'
</script>

<script lang="ts">
export default {
  name: 'Tabbar',
}
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-image: linear-gradient(90deg, #3a3f51, #2d323e); /* 深色调渐变 */
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15); /* 轻微阴影 */
  border: none; /* 无圆角 */
}
</style>
