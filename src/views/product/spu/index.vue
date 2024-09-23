<template>
  <div>
    <!-- 三级分类组件 -->
    <Category :scene="scene" />

    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.d3ID ? false : true"
          @click="addSPU"
        >
          添加属性
        </el-button>
        <!-- 展示已有的SPU数据 -->
        <el-table border style="margin: 10px 0" :data="records">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>

          <el-table-column
            label="SPU名称"
            align="center"
            prop="spuName"
          ></el-table-column>
          <el-table-column
            label="SPU描述"
            align="center"
            prop="description"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column label="操作" align="center">
            <!-- row即为已有SPU对象 -->
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Plus"
                title="添加SKU"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="small"
                icon="Edit"
                title="修改SPU"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                size="small"
                icon="InfoFilled"
                title="查看SKU"
              ></el-button>
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                title="删除SKU"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器组件 -->
        <el-pagination
          :page-sizes="[3, 5, 7, 9]"
          layout="prev, pager, next, jumper, ->, total, sizes"
          :total="400"
          background
          v-model:page-size="limit"
          v-model:current-page="pageNo"
          @size-change="changeSize"
          :page-count="9"
          @current-change="getHasSpu(pageNo)"
        ></el-pagination>
      </div>

      <!-- 添加|修改SPU子组件 -->
      <SpuForm ref="spu" v-show="scene == 1" @changeScene="changeScene" />
      <!-- 添加SKU子组件 -->
      <SkuForm ref="sku" v-show="scene == 2" @changeScene="changeScene"/>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// 引入分类的仓库，监听三级分类ID的变化
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu } from '@/api/product/spu'
import { HasSpuResponseData, Records, SpuData } from '@/api/product/spu/type'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'

// 控制场景展示
let scene = ref<number>(0)
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let limit = ref<number>(3)
let categoryStore = useCategoryStore()
// 存储已有SPU数据
let records = ref<Records>([])
// 存储已有SPU总个数
let total = ref<number>(0)
// 获取子组件实例对象
let spu = ref<any>()
let sku = ref<any>()

// 监听三级分类ID的变化
watch(
  () => categoryStore.d3ID,
  () => {
    // 务必保证三级分类存在再去发请求
    if (!categoryStore.d3ID) return
    getHasSpu()
  },
)

// 获取三级分类下已有的全部SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNo.value,
    limit.value,
    categoryStore.d3ID,
  )
  if (result.code == 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}

// 监听每页数量变化
const changeSize = () => {
  getHasSpu()
}
// 添加SPU按钮回调
const addSPU = () => {
  // 切换为场景1
  scene.value = 1
  spu.value.initAddSpu(categoryStore.d3ID)
}
// 子组件SpuForm绑定自定义事件
const changeScene = (obj: any) => {
  scene.value = obj.flag
  if (obj.params == 'update') {
    // 更新信息留在当前页
    getHasSpu(pageNo.value)
  } else {
    // 添加品牌返回第一页
    getHasSpu()
  }
}

// 修改Spu按钮回调
const updateSpu = (row: SpuData) => {
  scene.value = 1
  // 调用子组件实例方法获取完整SPU数据
  spu.value.initHasSpuData(row)
}

// 添加sku按钮回调
const addSku = (row: SpuData) => {
  scene.value = 2;  
  // 调用子组件方法初始化sku数据
  sku.value.initSkuData(categoryStore.d1ID, categoryStore.d2ID, row);
}
</script>

<style lang="scss" scoped></style>
