<template>
  <div>
    <el-card>
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select
            v-model="categoryStore.d1ID"
            @change="handler_d1"
            :disabled="scene == 0 ? false : true"
          >
            <el-option
              v-for="(d1, index) in categoryStore.d1Arr"
              :key="d1.id"
              :value="d1.id"
              :label="d1.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select
            v-model="categoryStore.d2ID"
            @change="handler_d2"
            :disabled="scene == 0 ? false : true"
          >
            <el-option
              v-for="(d2, index) in categoryStore.d2Arr"
              :key="d2.id"
              :label="d2.name"
              :value="d2.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="三级分类">
          <el-select
            v-model="categoryStore.d3ID"
            :disabled="scene == 0 ? false : true"
          >
            <el-option
              v-for="(d3, index) in categoryStore.d3Arr"
              :key="d3.id"
              :label="d3.name"
              :value="d3.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 引入组件挂载完毕方法
import { onMounted } from 'vue'
// 引入分类相关的仓库
import useCategoryStore from '@/store/modules/category'
let categoryStore = useCategoryStore()

onMounted(() => {
  getD1Store()
})

// 通知仓库获取一级分类的方法
const getD1Store = () => {
  // 通知分类仓库发请求获取一级分类的数据
  categoryStore.getD1()
}

// 一级下拉菜单的change事件
const handler_d1 = () => {
  // 需要将二级、三级分类的数据清空
  categoryStore.d2ID = ''
  categoryStore.d2Arr = []
  categoryStore.d3ID = ''
  // 通知仓库获取二级分类的数据
  categoryStore.getD2()
}

// 二级菜单的change事件
const handler_d2 = () => {
  // 需要将三级分类的数据清空
  categoryStore.d3Arr = []
  categoryStore.d3ID = ''
  // 通知仓库获取三级分类的数据
  categoryStore.getD3()
}

// 接收父组件传递过来的scene
defineProps(['scene'])
</script>

<style lang="scss" scoped>
.el-select {
  width: 220px;
}
</style>
