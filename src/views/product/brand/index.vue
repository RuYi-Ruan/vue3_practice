<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
     <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
     <!-- 表格组件:用于展示已有得平台数据 -->
      <el-table style="margin: 10px 0px;" border stripe fixed="left">
        <el-table-column label="序号" width="80px" align="center"></el-table-column>
        <el-table-column label="品牌名称" align="center"></el-table-column>
        <el-table-column label="品牌LOGO" align="center"></el-table-column>
        <el-table-column label="品牌操作" align="center"></el-table-column>
      </el-table>
      <!-- 分页器组件 -->
      <el-pagination
      v-model:current-page="pageNo"
      :page-sizes="[3,6,9,12]"
      v-model:page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="400"
      :background="true">
    </el-pagination>
  </el-card>
</template>

<script setup lang="ts">
// 引入组合式API函数ref
import { ref } from 'vue';
// 当前页码
let pageNo = ref<number>(1);
// 每一页展示多少条数据
let limit = ref<number>(3);
</script>

<style lang="scss" scoped>

</style>
