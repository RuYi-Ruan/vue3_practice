<template>
  <div>
    <el-table border style="margin: 10px 0" :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
      <el-table-column label="名称" align="center" show-overflow-tooltip width="150px" prop="skuName"></el-table-column>
      <el-table-column label="描述" align="center" show-overflow-tooltip width="150px" prop="skuDesc"></el-table-column>
      <el-table-column label="图片" align="center" width="150px">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" :alt="row.skuDesc" style="width: 100%; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="重量" align="center" width="150px" prop="weight"></el-table-column>
      <el-table-column label="价格" align="center" width="150px" prop="price"></el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="300px">
        <template #="{ row, $index }">
          <el-button :type="row.isSale == 1 ? 'primary' : 'success'" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateIsSale(row)"></el-button>
          <el-button type="warning" icon="Edit"></el-button>
          <el-button type="info" icon="InfoFilled" @click="showSku(row)"></el-button>
          <el-popconfirm 
            confirm-button-text="OK"  
            icon="InfoFilled"
            icon-color="#626AEF" 
            :title="`确定要删除${row.skuName}吗？`" 
            @confirm="deleteSku(row)"
            width="200px"
          >
            <template #reference>
              <el-button type="danger" icon="Delete"></el-button>
            </template>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器组件 -->
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
      style="margin: 10px 0; text-align: right" @current-change="getHasSku" @size-change="handler"></el-pagination>
    <!-- 抽屉组件：展示商品详情 -->
    <el-drawer v-model="drawer" close-on-press-escape size="666">
      <template #title>
        <h4>商品信息</h4>
      </template>
      <template #default>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">名称</el-col>
          <el-col :span="18">{{ skuDetail.skuName }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">描述</el-col>
          <el-col :span="18">{{ skuDetail.skuDesc }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">价格</el-col>
          <el-col :span="18">{{ skuDetail.price }}</el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">平台属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px;" v-for="item in skuDetail.skuAttrValueList" :key="item.id"> {{ item.valueName
              }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">销售属性</el-col>
          <el-col :span="18">
            <el-tag style="margin: 5px;" v-for="item in skuDetail.skuSaleAttrValueList" :key="item.id">{{
              item.saleAttrValueName }}</el-tag>
          </el-col>
        </el-row>
        <el-row style="margin: 10px 0;">
          <el-col :span="6">商品图片</el-col>
          <el-col :span="18">
            <el-carousel :interval="4000" type="card" height="250px">
              <el-carousel-item v-for="item in skuDetail.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="商品图片" style="width: 100%; height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { reqCalcelSaleSku, reqOnSaleSku, reqRemoveSku, reqSkuDetail, reqSkuInfo } from '@/api/product/sku'
import { SkuData, skuDetailData, SkuResponseData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus';
import { onMounted, ref } from 'vue'
let pageNo = ref<number>(1)
let pageSize = ref<number>(10)
let total = ref<number>(0)
// 存储SKU数据
let skuArr = ref<SkuData[]>([])
// 控制抽屉组件的显示与隐藏
let drawer = ref<boolean>(false)
// 商品详情对象
let skuDetail = ref<SkuData>({
  category3ID: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuDefaultImg: ''
})
// 组件挂载完毕
onMounted(() => {
  getHasSku()
})
// 获取已有SKU
const getHasSku = async (pager = 1) => {
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuInfo(pageNo.value, pageSize.value)

  if (result.code == 200) {
    skuArr.value = result.data.records
    total.value = result.data.total;
  }
}
// pageSize变化回调
const handler = (pageSize: number) => {
  getHasSku()
}

// 商品上架与下架请求
const updateIsSale = async (row: SkuData) => {
  const isCurrentlyOnSale = row.isSale === 1
  const result = isCurrentlyOnSale
    ? await reqCalcelSaleSku(row.id as number)
    : await reqOnSaleSku(row.id as number)

  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: isCurrentlyOnSale ? '下架成功' : '上架成功',
    })

    // 更新 skuArr 中对应的行的 isSale 状态
    row.isSale = isCurrentlyOnSale ? 0 : 1 // 或根据你的逻辑设置
  } else {
    ElMessage({
      type: 'error',
      message: isCurrentlyOnSale ? '下架失败' : '上架失败',
    })
  }
}
// 查看信息按钮回调
const showSku = async (row: SkuData) => {
  // 展示抽屉组件
  drawer.value = true;
  // 获取已有商品详情数据
  let result: skuDetailData = await reqSkuDetail(row.id as number);
  if (result.code == 200) {
    skuDetail.value = result.data;
  } else {
    ElMessage({
      type: 'error',
      message: '获取商品详情失败'
    })
    return;
  }
}
// 删除已有商品
const deleteSku = async (row: SkuData) => {
  let result = await reqRemoveSku(row.id as number);
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 重新获取已有商品数据
    getHasSku(skuArr.value.length > 1? pageNo.value : pageNo.value - 1);
  }else {
    ElMessage({
      type: 'error',
      message: '删除失败'
    })
    return;
  }
}
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}



.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

/* 抽屉样式优化 */
.el-drawer__header {
  font-weight: bold;
  font-size: 18px;
  padding-bottom: 15px;
}

/* 优化每个字段容器 */
.el-row {
  margin-bottom: 15px;
  font-size: 16px;
  background-color: #f9fafc;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 左侧标题加粗 */
.el-col:first-child {
  font-weight: bold;
  color: #333;
  padding-right: 10px;
}

/* 右侧内容颜色 */
.el-col:last-child {
  color: #666;
}

/* 优化标签样式 */
.el-tag {
  background-color: #f2f4f5;
  color: #409eff;
  border-radius: 4px;
  padding: 3px 8px;
  font-size: 14px;
}

/* 商品图片优化 */
.el-carousel {
  border: 1px solid #ebeef5;
  border-radius: 5px;
  overflow: hidden;
}

.el-carousel__item img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

</style>
