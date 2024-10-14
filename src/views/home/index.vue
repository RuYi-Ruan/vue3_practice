<template>
  <el-card shadow="hover" class="card">
    <div class="box">
      <img src="@/assets/images/avatar2.gif" alt="用户头像" class="avatar">
      <div class="bottom">
        <h3 class="title">{{ get_cur_time() }}, {{ userStore.username }}</h3>
        <p class="subtitle">硅谷甄选运营平台</p>
      </div>
    </div>
  </el-card>

  <div class="svg">
    <svg-icon name="welcome" width="400px" height="400px" class="welcome-icon"></svg-icon>
  </div>
</template>

<script setup lang="ts">
// 引入用户相关仓库，获取当前用户的头像与名称
import useUserStore from '@/store/modules/user';
import { get_cur_time } from '@/utils/time';
// 获取用户仓库
let userStore = useUserStore();
</script>

<style scoped lang="scss">
.card {
  padding: 20px;
  border-radius: 15px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.box {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    transition: transform 0.3s ease-in-out;

    &:hover {
      transform: scale(1.05);
    }
  }

  .bottom {
    margin-left: 20px;

    .title {
      font-size: 32px;
      font-weight: 700;
      color: #333;
      margin-bottom: 10px;
      transition: color 0.3s ease-in-out;

      &:hover {
        color: #ff5e57;
      }
    }

    .subtitle {
      font-size: 18px;
      font-style: italic;
      font-weight: 300;
      color: #999;
    }
  }
}

.svg {
  margin-top: 40px;
  display: flex;
  justify-content: center;

  .welcome-icon {
    transition: transform 0.5s ease-in-out;

    &:hover {
      transform: rotate(10deg) scale(1.1);
    }
  }
}
</style>
