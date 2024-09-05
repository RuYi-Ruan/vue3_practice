<template>
  <div class="tabbar_right">
    <el-button size="small" icon="Refresh" circle></el-button>
    <el-button size="small" icon="FullScreen" circle></el-button>
    <el-button size="small" icon="Setting" circle></el-button>
    <img
      src="../../../../public/logo.png"
      alt=""
      style="width: 24px; height: 24px; margin: 0 10px"
    />
    <!-- 下拉菜单 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        admin
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>

      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts"></script>

<script lang="ts">
export default {
  name: 'Setting',
}
</script>

<style lang="scss" scoped>
.tabbar_right {
  display: flex;
  align-items: center;

  img {
    border-radius: 50%; /* 圆形图片 */
    border: 1px solid #fff; /* 给图片添加白色边框 */
  }
}

.el-button {
  color: #fff;
  background-color: transparent; /* 透明背景 */
  border: none; /* 移除边框 */
  margin: 0 5px;
  font-size: 18px; /* 增大字体大小 */
  padding: 6px; /* 增加内边距以扩大按钮区域 */

  &:hover {
    background-color: rgba(255, 255, 255, 0.1); /* 悬停效果 */
  }
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 16px; /* 调整下拉菜单字体大小 */

  .el-icon--right {
    margin-left: 5px;
    font-size: 18px; /* 调整下拉图标大小 */
  }
}

.el-icon {
  font-size: 20px; /* 放大图标的尺寸 */
}
</style>
