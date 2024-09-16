<template>
  <div>
    
    <!-- 三级分类全局组件 -->
    <Category :scene="scene"/>

    <el-card style="margin: 10px 0;">
      <div v-show="scene == 0">
        <el-button 
        type="primary" 
        size="default" 
        icon="Plus" 
        :disabled= getDisabled()
        @click="addAttr()"
        >添加属性</el-button>
        <el-table border style="margin: 10px 0;" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" width="120px"  align="center" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称"  align="center">
            <template #="{row, $index}">
              <el-tag 
                v-for="(item, index) in row.attrValueList" 
                :key="item.id" 
                style="margin:5px;"
              >
              {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px"  align="center">
            
            <template #="{ row, $index }">
              <el-button
                size="small"
                type="warning"
                icon="Edit"
                @click="updateAttr"
              >
              </el-button>
              <el-popconfirm
                :title="`确认删除${row.tmName}?`"
                width="250px"
                icon="QuestionFilled"
              >
                <template #reference>
                  <el-button size="small" type="danger" icon="Delete">
                  </el-button>
                </template>
              </el-popconfirm>
            </template>

          </el-table-column>
        </el-table> 
      </div>

      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请输入属性名称"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" size="default" icon="Plus">添加属性值</el-button>
        <el-button size="default" type="info"  icon="CircleClose">取消</el-button>

        <el-table border style="margin: 10px 0;">
          <el-table-column width="80px" align="center" type="index" label="序号"></el-table-column>
          <el-table-column align="center" label="属性值"></el-table-column>
          <el-table-column label="操作" width="120px" align="cenyer"></el-table-column>
        </el-table>

        <el-button type="primary" size="default" icon="CircleCheck">保存</el-button>
        <el-button size="default" type="info" icon="CircleClose">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import Category from '@/components/Category/index.vue'
import useCategoryStore from '@/store/modules/category';
// 引入组合式API函数watch
import { watch, ref } from 'vue';
// 引入获取已有属性与属性值
import { reqAtrr } from '@/api/product/attribute';
import { AttrResponseData, Attr } from '@/store/modules/types/type';

let categoryStore = useCategoryStore();
// 存储已有的属性与属性值
let attrArr = ref<Attr[]>([]);
// 定义卡片组件内容的切换
let scene = ref<number>(0);

const getDisabled = () => {
  return categoryStore.d3ID ? false : true;
}

// 监听仓库三级分类ID的变化
watch(() => categoryStore.d3ID, async () => {
  // 清空上一次查询的属性与属性值
  attrArr.value = [];
  // 保证三级分类存在再发请求
  if (!categoryStore.d3ID) return;
  // 获取所有分类的id
  getAttr();
})

// 获取已有属性与属性值的方法
const getAttr = async () => {
  const {d1ID, d2ID, d3ID} = categoryStore;
  let result:AttrResponseData = await reqAtrr(d1ID, d2ID, d3ID);  
  if (result.code == 200) {
    attrArr.value = result.data;
  }
}

// 添加属性按钮的回调函数
const addAttr = () => {
  scene.value = 1;
}
// 修改已有属性按钮回调
const updateAttr = () => {
  scene.value = 1;
}
</script>

<style lang="scss" scoped>

</style>
