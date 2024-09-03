<template>
  <svg :style="{ width, height }">
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
defineProps({
  // xlink:href 属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  // 使用图标的名字
  name: {
    type: String,
  },
  color: {
    type: String,
    default: '',
  },
  width: {
    type: String,
    default: '16px',
  },
  height: {
    type: String,
    default: '16px',
  },
})
</script>

<style scoped lang="less"></style>
