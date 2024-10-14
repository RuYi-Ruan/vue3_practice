<template>
  <div class="box">
    <img src="../../assets//images/error_images/404.png" alt="">
    <button @click="backHome">返回首页</button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter();
// 跳转回首页
const backHome = () => {
  $router.push('/home');
}

</script>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  background-color: $theme-background-color;
  display: flex;
  justify-content: center;

  img {
    width: 1000px;
    height: 500px;
    margin-left: 400px;
    margin-top: 100px;
  }
}
</style>
