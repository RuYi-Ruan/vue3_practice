<template>
  <div>
    <el-table border style="margin: 10px 0;" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" align="center" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" align="center" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" align="center" width="150px">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" :alt="row.skuDesc" style="width: 100%; height: 80px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" align="center" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300px">
        <template #="{ row, $index }">
          <el-button :type="row.isSale == 1 ? 'primary' : 'success'" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateIsSale(row)"></el-button>
          <el-button type="warning" icon="Edit"></el-button>
          <el-button type="info" icon="InfoFilled"></el-button>
          <el-button type="danger" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
      style="margin: 10px 0; text-align: right;" @current-change="getHasSku" @size-change="handler">
    </el-pagination>
  </div>
</template>

<script setup lang="ts">
import { reqCalcelSaleSku, reqOnSaleSku, reqSkuInfo } from '@/api/product/sku';
import { SkuData, SkuResponseData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue'
let pageNo = ref<number>(1);
let pageSize = ref<number>(10);
let total = ref<number>(0);
// 存储SKU数据
let skuArr = ref<SkuData[]>([]);
// 组件挂载完毕
onMounted(() => {
  getHasSku()
})
// 获取已有SKU
const getHasSku = async (pager = 1) => {
  pageNo.value = pager;
  let result: SkuResponseData = await reqSkuInfo(pageNo.value, pageSize.value);
  console.log(result);

  if (result.code == 200) {
    skuArr.value = result.data.records;
  }

}
// pageSize变化回调
const handler = (pageSize: number) => {
  getHasSku();
}

// 商品上架与下架请求
const updateIsSale = async (row: SkuData) => {
  const isCurrentlyOnSale = row.isSale === 1;
  const result = isCurrentlyOnSale ? await reqCalcelSaleSku(row.id as number) : await reqOnSaleSku(row.id as number);

  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: isCurrentlyOnSale ? '下架成功' : '上架成功'
    });

    // 更新 skuArr 中对应的行的 isSale 状态
    row.isSale = isCurrentlyOnSale ? 0 : 1; // 或根据你的逻辑设置
  } else {
    ElMessage({
      type: 'error',
      message: isCurrentlyOnSale ? '下架失败' : '上架失败'
    });
  }
}
</script>

<style lang="scss" scoped></style>
