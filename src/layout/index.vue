<template>
  <div class="layout_container">
    <!-- 左侧菜单 -->
    <div class="layout_slider">124</div>
    <!-- 顶部导航 -->
    <div class="layout_tabbar">456</div>
    <!-- 内容展示区域 -->
    <div class="layout_main">
      <p style="height: 1000px; width: 500px; background-color: purple">
        李雪琳在干嘛
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.layout_container {
  position: relative;
  width: 100%;
  height: 100vh;

  .layout_slider {
    width: $base_menu_width;
    height: 100vh;
    background-color: $base_menu_background;
  }

  .layout_tabbar {
    position: fixed;
    top: 0;
    left: $base_menu_width;
    width: calc(100% - $base_menu_width);
    height: $base_tabbar_height;
    background-color: aqua;
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base_menu_width);
    height: calc(100vh - $base_tabbar_height);
    background-color: bisque;
    left: $base_menu_width;
    top: $base_tabbar_height;
    padding: 20px;
    overflow: auto;
  }
}
</style>
