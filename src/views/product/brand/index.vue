<template>
  <el-card class="box-card">
    <!-- 卡片顶部添加品牌按钮 -->
    <el-button type="primary" size="default" icon="Plus" @click="addTrademark">
      添加品牌
    </el-button>
    <!-- 表格组件:用于展示已有得平台数据 -->
    <el-table
      style="margin: 10px 0px"
      border
      stripe
      fixed="left"
      :data="trademarkArr"
    >
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
        <template #="{ row, $index }">
          <pre style="color: cyan; font-size: 24px; font-weight: 600">{{
            row.tmName
          }}</pre>
        </template>
      </el-table-column>

      <el-table-column label="品牌LOGO" align="center">
        <template #="{ row, $index }">
          <img
            :src="getFullLogoUrl(row.logoUrl)"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>

      <el-table-column label="品牌操作" align="center">
        <template #="{ row, $index }">
          <el-button
            size="small"
            type="primary"
            icon="Edit"
            @click="($event) => updateTrademark(row)"
          >
            Edit
          </el-button>
          <el-popconfirm
            :title="`确认删除${row.tmName}?`"
            width="250px"
            icon="QuestionFilled"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button size="small" type="danger" icon="Delete">
                Delete
              </el-button>
            </template>
          </el-popconfirm>
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

  <!-- 对话框组件，添加品牌时展示 -->
  <el-dialog v-model="dialogFormVisible" :title="dialogTitle">
    <el-form
      style="width: 80%"
      :model="trademarkParams"
      :rules="rules"
      ref="formRef"
    >
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input
          placeholder="请您输入品牌名称"
          v-model="trademarkParams.tmName"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="品牌LOGO"
        label-width="100px"
        v-model="trademarkParams.logoUrl"
        prop="logoUrl"
      >
        <!-- 
          action: 图片上传路径，要在前面加上/api，这样代理服务器才能收到请求
        -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img
            v-if="trademarkParams.logoUrl"
            :src="trademarkParams.logoUrl"
            class="avatar"
          />
          <el-icon v-else class="avatar-uploader-icon">
            <UploadFilled />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button type="danger" @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
// 引入组合式API函数ref
import { ref, onMounted, reactive, nextTick } from 'vue'
import {
  reqHasTrademark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark,
} from '@/api/product/brand'
import {
  Records,
  TradeMark,
  TradeMarkResponseData,
} from '@/api/product/brand/type'
import { ElMessage, UploadProps } from 'element-plus'
// 当前页码
let pageNo = ref<number>(1)
// 每一页展示多少条数据
let limit = ref<number>(3)
// 存储已有品牌数据总数
let total = ref<number>(0)
// 存储已有品牌的数据
let trademarkArr = ref<Records>([])
// 对话框显示属性
let dialogFormVisible = ref<boolean>(false)
// 定义新增品牌数据
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: '',
})
// 对话框标题
let dialogTitle = ref<string>('')
// 获取el-form组件实例
let formRef = ref()

// 获取已有品牌的接口封装为一个函数：在任何情况下获取数据，调用函数即可
const getHasTrademark = async (pager = 1) => {
  pageNo.value = pager
  let result: TradeMarkResponseData = await reqHasTrademark(
    pageNo.value,
    limit.value,
  )
  if (result.code == 200) {
    // 已有品牌的总数
    total.value = result.data.total
    // 每一页的数据
    trademarkArr.value = result.data.records
  }
}
// 组件挂载完毕---发送一次请求，获取一页，一页有三个品牌
onMounted(() => {
  getHasTrademark()
})

// 补全URL
const getFullLogoUrl = (url: string) => {
  const prefix = 'http://'
  // 检查 URL 是否已经包含前缀
  if (!url.startsWith('http')) {
    return prefix + url
  }
  return url
}

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
  getHasTrademark()
}

// 添加品牌函数，点击展示对话框
const addTrademark = () => {
  // 设置对话框标题为添加标题
  dialogTitle.value = '添加品牌'
  // 每次添加品牌，先把之前收集的数据清空
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  trademarkParams.id = 0
  // 对话框显示
  dialogFormVisible.value = true
  // 清除校验信息
  formRef.value.resetFields('tmName')
  formRef.value.resetFields('logoUrl')
  // 其他方法
  // formRef.value?.clearValidate('tmName');
  // formRef.value?.clearValidate('logoUrl');
  // 通过nextTick完成
  // nextTick(() => {
  //   formRef.value.clearValidate('tmName');
  //   formRef.value.clearValidate('logoUrl');
  // })
}

// 更新品牌信息
const updateTrademark = (row: TradeMark) => {
  // 清除之前的校验信息
  formRef.value.resetFields('tmName')
  formRef.value.resetFields('logoUrl')

  dialogTitle.value = '更新品牌信息'
  // 展示已有品牌的数据
  trademarkParams.tmName = row.tmName
  trademarkParams.logoUrl = getFullLogoUrl(row.logoUrl)
  // 对话框显示
  dialogFormVisible.value = true
  // ES6语法合并对象
  Object.assign(trademarkParams, row)
}

// 确认取消按钮
const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}

const confirm = async () => {
  // 发请求前对整个表单进行校验
  // 表单校验通过再执行后面的语法
  await formRef.value.validate()
  // 对话框隐藏
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  console.log(result)
  if (result.code == 200) {
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: '操作成功',
    })
    // 再次发请求获取已有的全部品牌数据,添加数据返回第一页，修改数据停留在当前页
    getHasTrademark(dialogTitle.value == '更新品牌信息' ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: '品牌添加失败',
    })
  }

  dialogFormVisible.value = false
}

// 上传前的检查，上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在图片上传成功之前触发的，上传文件之前可以约束文件类型与大小
  // 要求： 上传文件png|jpg|gif| 4M
  if (
    rawFile.type == 'image/png' ||
    rawFile.type == 'image/jpeg' ||
    rawFile.type == 'image/gif'
  ) {
    // 文件大小 < 4M
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '文件大小要小于4M',
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传文件格式务必是PNG|JPG|GIF',
    })

    return false
  }
}

// 图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  // response: 即为当前这次上传图片post请求服务器返回的数据
  trademarkParams.logoUrl = response.data
  // 如果图片上传成功，则清除图片的校验信息
  formRef.value.clearValidate('logoUrl')
}

// 品牌校验自定义规则
const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称必须大于两位'))
  }
}

// 品牌logo自定义校验规则
const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  // 如果图片上传
  if (value) {
    callBack()
  } else {
    callBack(new Error('品牌LOGO不能为空'))
  }
}

// 表单校验对象
const rules = {
  tmName: [
    {
      // 这个字段务必校验
      required: true,
      // 失去焦点触发
      trigger: 'blur',
      validator: validatorTmName,
    },
  ],
  logoUrl: [
    {
      required: true,
      trigger: 'change',
      validator: validatorLogoUrl,
    },
  ],
}

// 气泡确认框确认按钮的回调
const removeTradeMark = async (id: number) => {
  let result = await reqDeleteTrademark(id)
  if (result.code == 200) {
    // 删除成功
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    // 删除成功后再次获取已有品牌数据
    getHasTrademark(
      trademarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1,
    )
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
