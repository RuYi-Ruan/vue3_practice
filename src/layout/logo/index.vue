<template>
  <div class="logo" v-if="setting.logo_view">
    <img :src="setting.logo" alt="" />
    <p :class="{ hidden: layoutSettingStore.fold }">{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from '@/setting';
import useLayoutSettingStore from '@/store/modules/setting';
let layoutSettingStore = useLayoutSettingStore();
</script>

<script lang="ts">
export default {
  name: 'Logo',
};
</script>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  width: 100%;
  height: $base_menu_logo_height;
  color: #fff;
  padding: 5px;
  overflow: hidden; /* 防止内容被挤压 */
  transition: all 0.5s; /* 平滑的过渡效果 */

  img {
    width: 40px;
    height: 40px;
    transition: all 0.5s; /* 平滑的过渡效果 */
  }

  p {
    font-size: $base_logo_title_fontSize;
    margin-left: 5px;
    white-space: nowrap; /* 防止文字换行 */
    transition: opacity 0.3s, width 0.3s; /* 平滑的过渡效果 */
  }

  .hidden {
    opacity: 0;
    width: 0; /* 折叠时隐藏文字 */
  }
}
</style>
