<template>
  <div>
    <!-- 三级分类组件 -->
    <Category :scene="scene" />

    <el-card style="margin: 10px 0;">
      <div>
        <el-button type="primary" size="default" icon="Plus" :disabled="categoryStore.d3ID ? false : true">
          添加属性
        </el-button>
        <!-- 展示已有的SPU数据 -->
        <el-table border style="margin: 10px 0;" :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px">
          </el-table-column>

          <el-table-column label="SPU名称" align="center" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" align="center" prop="description"></el-table-column>
          <el-table-column label="操作" align="center">
            <!-- row即为已有SPU对象 -->
            <template #="{ row, $index }">
              <el-button type="primary" size="small" icon="Plus" title="添加SKU"></el-button>
              <el-button type="warning" size="small" icon="Edit" title="修改SKU"></el-button>
              <el-button type="info" size="small" icon="View" title="查看SKU"></el-button>
              <el-button type="danger" size="small" icon="Delete" title="删除SKU"></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页器组件 -->
        <el-pagination :page-sizes="[3, 5, 7, 9]" layout="prev, pager, next, jumper, ->, total, sizes" :total="400"
          background v-model:page-size="limit" v-model:current-page="pageNo" @size-change="changeSize" :page-count="9"
          @current-change="getHasSpu(pageNo)">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
// 引入分类的仓库，监听三级分类ID的变化
import useCategoryStore from '@/store/modules/category';
import { reqHasSpu } from '@/api/product/spu';
import { HasSpuResponseData, Records } from '@/api/product/spu/type';
// 控制场景展示
let scene = ref<number>(0);
// 分页器默认页码
let pageNo = ref<number>(1);
// 每一页展示几条数据
let limit = ref<number>(3);
let categoryStore = useCategoryStore();
// 存储已有SPU数据
let records = ref<Records>([]);
// 存储已有SPU总个数
let total = ref<number>(0);

// 监听三级分类ID的变化
watch(() => categoryStore.d3ID, () => {
  // 务必保证三级分类存在再去发请求
  if (!categoryStore.d3ID) return;
  getHasSpu();
});

// 获取三级分类下已有的全部SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager;
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, limit.value, categoryStore.d3ID);
  if (result.code == 200) {
    records.value = result.data.records;
    total.value = result.data.total;
  }

}

// 监听每页数量变化
const changeSize = () => {
  getHasSpu();
}

</script>

<style lang="scss" scoped></style>
