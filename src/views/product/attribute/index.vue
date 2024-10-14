<template>
  <div>
    <!-- 三级分类全局组件 -->
    <Category :scene="scene" />

    <el-card style="margin: 10px 0">
      <div v-show="scene == 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="getDisabled()"
          @click="addAttr()"
        >
          添加属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="80px"
          ></el-table-column>
          <el-table-column
            label="属性名称"
            width="120px"
            align="center"
            prop="attrName"
          ></el-table-column>
          <el-table-column label="属性值名称" align="center">
            <template #="{ row }">
              <el-tag
                v-for="(item) in row.attrValueList"
                :key="item.id"
                style="margin: 5px"
              >
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <!-- 修改已有属性操作 -->
          <el-table-column label="操作" width="120px" align="center">
            <template #="{ row }">
              <el-button
                size="small"
                type="warning"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`确认删除${row.attrName}吗？`"
                width="250px"
                icon="QuestionFilled"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button
                    size="small"
                    type="danger"
                    icon="Delete"
                  ></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-show="scene == 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrParams.attrName"
            ></el-input>
          </el-form-item>
        </el-form>

        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="attrParams.attrName ? false : true"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button
          size="default"
          type="info"
          icon="CircleClose"
          @click="cancel"
        >
          取消
        </el-button>

        <el-table
          border
          style="margin: 10px 0"
          :data="attrParams.attrValueList"
        >
          <!-- 序号 -->
          <el-table-column
            width="80px"
            align="center"
            type="index"
            label="序号"
          ></el-table-column>
          <!-- 属性值 -->
          <el-table-column align="center" label="属性值" width="480px">
            <!-- row即为当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
                v-if="row.flag"
                @blur="toLook(row, $index)"
                :ref="(vc: any) => (inputArr[$index] = vc)"
              ></el-input>
              <div v-else @click="toEdit(row, $index)" role="button">
                {{ row.valueName }}
              </div>
            </template>
          </el-table-column>
          <!-- 操作 -->
          <el-table-column label="操作" width="120px" align="cenyer">
            <template #="{ $index }">
              <el-button
                type="danger"
                size="default"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              >
                Delete
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          size="default"
          icon="CircleCheck"
          @click="save"
          :disabled="
            attrParams.attrValueList.length === 0 ||
            attrParams.attrValueList.some((item) => item.valueName === '')
          "
        >
          保存
        </el-button>
        <el-button
          size="default"
          type="info"
          icon="CircleClose"
          @click="cancel"
        >
          取消
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import Category from '@/components/Category/index.vue'
import useCategoryStore from '@/store/modules/category'
// 引入组合式API函数watch
import { watch, ref, reactive, nextTick, onBeforeUnmount } from 'vue'
// 引入获取已有属性与属性值
import {
  reqAttr,
  reqAddOrUpdateAttr,
  reqRemoveAttr,
} from '@/api/product/attribute'
import { AttrResponseData, Attr, AttrValue } from '@/api/product/attribute/type'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()
// 存储已有的属性与属性值
let attrArr = ref<Attr[]>([])
// 定义卡片组件内容的切换
let scene = ref<number>(0)
// 收集新增属性的数据
let attrParams = reactive<Attr>({
  attrName: '', // 新增属性名字
  attrValueList: [], // 新增属性值数组
  categoryId: '', // 三级分类的ID
  categoryLevel: 3, // 代表三级分类
})
// 准备一个数组：存储对应的组件实例
let inputArr = ref<any>([])

const getDisabled = () => {
  return categoryStore.d3ID ? false : true
}

// 监听仓库三级分类ID的变化
watch(
  () => categoryStore.d3ID,
  async () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类存在再发请求
    if (!categoryStore.d3ID) return
    // 获取所有分类的id
    getAttr()
  },
)

// 获取已有属性与属性值的方法
const getAttr = async () => {
  const { d1ID, d2ID, d3ID } = categoryStore
  let result: AttrResponseData = await reqAttr(d1ID, d2ID, d3ID)
  if (result.code == 200) {
    attrArr.value = result.data
  }
}

// 取消按钮回调
const cancel = () => {
  scene.value = 0
}

// 添加属性按钮的回调函数
const addAttr = () => {
  // 清空之前收集的数据,再收集数据
  // 合并对象，将attrParams更新为初始状态
  Object.assign(attrParams, {
    id: '',
    attrName: '', // 新增属性名字
    attrValueList: [], // 新增属性值数组
    categoryId: categoryStore.d3ID, // 三级分类的ID
    categoryLevel: 3, // 代表三级分类
  })
  scene.value = 1
}
// 修改已有属性按钮回调
const updateAttr = (row: AttrValue) => {
  // 将已有属性对象赋值给attrParams
  // JSON.parse(JSON.stringify(row))实现深拷贝
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
  scene.value = 1
}

// 添加属性值按钮回调
const addAttrValue = () => {
  // 点击添加属性值按钮的时候，向attrValueList添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true, // 控制属性值编辑与查看模式切换
  })

  // 获取最后el-input组件实现聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 保存按钮回调
const save = async () => {
  // 校验属性值列表，确保没有空值
  const hasEmptyValue = attrParams.attrValueList.some(
    (item) => item.valueName === '',
  )

  if (hasEmptyValue) {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return // 阻止保存
  }

  // 发请求
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if (result.code == 200) {
    // 切换场景
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    // 操作成功后，重新获取全部已有属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

// 属性值表单脱焦的回调函数
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断1：如果输入为空则不切换为div展示
  if (row.valueName == '') {
    // 删除对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  // 非法情况判断2: 属性值重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })

  if (repeat) {
    // 将重复的属性值从数组中删除
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
  }
  // 相应属性对象的flag变为false
  row.flag = false
}

// 属性值div元素点击事件
const toEdit = (row: AttrValue, $index: number) => {
  // 切换为编辑模式
  row.flag = true
  // nextTick: 响应式数据发生变化，获取更新的DOM(组件实例)
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

// 删除已有属性按钮回调
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  console.log(result)

  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 重新获取已有属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

// 路由组件销毁时把分类相关数据清除
onBeforeUnmount(() => {
  // 清空仓库数据
  categoryStore.$reset()
})
</script>

<style lang="scss" scoped>
div[role='button'] {
  background-color: #f5f7fa;
  /* 浅灰色背景 */
  border-radius: 8px;
  /* 圆角 */
  padding: 10px;
  /* 内边距 */
  margin: 5px 0;
  /* 外边距 */
  cursor: pointer;
  /* 鼠标悬停时显示手型 */
  transition: background-color 0.3s ease;
  /* 背景色过渡效果 */
  border: 1px solid transparent;
  /* 初始透明边框 */
}

/* 悬停效果 */
div[role='button']:hover {
  background-color: #e0e6ed;
  /* 悬停时背景色变为更深的灰色 */
  border-color: #c0c4cc;
  /* 悬停时显示边框 */
}
</style>
