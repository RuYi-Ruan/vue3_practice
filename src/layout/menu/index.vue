<template>
  <div>
    <template v-for="(item, index) in menuList" :key="item.path">
      <!-- 没有子路由 -->
      <template v-if="!item.children">
        <el-menu-item
          :index="item.path"
          v-if="!item.meta.hidden"
          @click="goRoute"
        >
          <span>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
          </span>
          <template #title>
            <span>{{ item.meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 只有一个子路由 -->
      <template v-if="item.children && item.children.length == 1">
        <el-menu-item
          v-if="!item.children[0].meta.hidden"
          :index="item.children[0].path"
          @click="goRoute"
        >
          <span>
            <el-icon>
              <component :is="item.children[0].meta.icon"></component>
            </el-icon>
          </span>
          <template #title>
            <span>{{ item.children[0].meta.title }}</span>
          </template>
        </el-menu-item>
      </template>
      <!-- 多个子路由 -->
      <el-sub-menu
        v-if="item.children && item.children.length > 1"
        :index="item.path"
      >
        <template #title>
          <span>
            <el-icon>
              <component :is="item.meta.icon"></component>
            </el-icon>
          </span>
          <span>{{ item.meta.title }}</span>
        </template>
        <!-- 递归 -->
        <Menu :menuList="item.children"></Menu>
      </el-sub-menu>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
// 获取父组件传递过来的路由数组
defineProps(['menuList'])
let $router = useRouter()

// 点击菜单的回调
const goRoute = (vc: any) => {
  // 编程式导航实现路由跳转
  $router.push(vc.index)
}
</script>
<!-- 递归组件必须要有名字 -->
<script lang="ts">
export default {
  name: 'Menu',
}
</script>

<style scoped lang="scss">
div {
  color: white;
}

.el-icon {
  margin-right: 11px;
}

.el-menu-item,
.el-sub-menu {
  margin-left: -5px; /* Adjust the value as needed */
}
</style>
