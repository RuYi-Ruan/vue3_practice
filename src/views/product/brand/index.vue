<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus">添加品牌</el-button>
    <!-- 表格组件:用于展示已有得平台数据 -->
    <el-table style="margin: 10px 0px" border stripe fixed="left" :data="trademarkArr">
      <!-- 序号 -->
      <el-table-column
        label="序号"
        width="80px"
        align="center"
        type="index"
      ></el-table-column>

      <el-table-column label="品牌名称" align="center">
        <!-- 
          使用prop的话品牌名称是通过div展示的，也可通过以下写法通过插槽展示
         -->
        <template #="{row,$index}">
          <pre style="color: cyan; font-size: 24px; font-weight: 600;">{{ row.tmName }}</pre>
        </template>
      </el-table-column>

      <el-table-column label="品牌LOGO" align="center">
        <template #="{row,$index}">
            <img :src="getFullLogoUrl(row.logoUrl)" alt="" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>

      <el-table-column label="品牌操作" align="center">
        
        <template #>
          <el-button 
          size="small" 
          type="primary" 
          icon="Edit"
          >
            Edit
          </el-button>
          <el-button
            size="small"
            type="danger"
            icon="Delete"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器组件 -->
    <el-pagination
      @current-change="getHasTrademark"
      @size-change="sizeChange"
      v-model:current-page="pageNo"
      :page-sizes="[3, 6, 9, 12]"
      v-model:page-size="limit"
      layout="prev, pager, next, jumper,->,total, sizes"
      :total="total"
      :background="true"
      :page-count="9"
    ></el-pagination>
  </el-card>
</template>

<script setup lang="ts">
// 引入组合式API函数ref
import { ref, onMounted } from 'vue'
import { reqHasTrademark } from '@/api/product/brand';
import { Records, TradeMarkResponseData } from '@/api/product/brand/type';
// 当前页码
let pageNo = ref<number>(1);
// 每一页展示多少条数据
let limit = ref<number>(3);
// 存储已有品牌数据总数
let total = ref<number>(0);
// 存储已有品牌的数据
let trademarkArr = ref<Records>([]);
// 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用函数即可
const getHasTrademark = async (pager=1) => {
  pageNo.value = pager;
  let result:TradeMarkResponseData = await reqHasTrademark(pageNo.value, limit.value);
  if (result.code == 200) {
    // 已有品牌的总数
    total.value = result.data.total;
    // 每一页的数据
    trademarkArr.value = result.data.records;
  } 
  
}
// 组件挂载完毕---发送一次请求，获取一页，一页有三个品牌
onMounted(() => {
  getHasTrademark();
})

// 补全URL
const getFullLogoUrl = (url:string) => {
  const prefix = 'http://';
  // 检查 URL 是否已经包含前缀
  if (!url.startsWith('http')) {
    return prefix + url;
  }
  return url;
};

// 页码发生变化时触发
// 自定义事件会将当前页面回传
// const changePageNo = (page) => {
//   // 当页码发生变化时，再次发请求获取指定页码已有品牌的数据
//   getHasTrademark(page);
// }

// 下拉菜单 -/条每页 发生变化时触发
// 回传当前页面品牌数限制
const sizeChange = () => {
  // 当页面数据量发生变化时，页码置1
  getHasTrademark();
}

</script>

<style lang="scss" scoped></style>
