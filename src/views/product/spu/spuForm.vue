<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input
        placeholder="请输入SPU名称"
        v-model="SpuParams.spuName"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select
        placeholder="请选择SPU品牌"
        style="width: 240px"
        v-model="SpuParams.tmId"
      >
        <el-option
          v-for="(item) in allTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id as number"
        ></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>

    <el-form-item label="SPU照片">
      <!-- v-model:filelist 展示默认图片 -->
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handleUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%"
        />
      </el-dialog>
    </el-form-item>

    <el-form-item label="SPU销售属性">
      <!-- 下拉菜单，选择销售属性 -->
      <el-select
        :placeholder="
          unSelectSaleAttr.length
            ? `剩余${unSelectSaleAttr.length}项未选`
            : '暂无数据可选'
        "
        style="width: 240px; margin-right: 10px"
        v-model="saleAttrIdAndValueName"
      >
        <el-option
          v-for="(item) in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}: ${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="Plus"
        :disabled="unSelectSaleAttr.length === 0 || !saleAttrIdAndValueName"
        @click="addSaleAttr"
      >
        添加销售属性
      </el-button>

      <!-- 展示销售属性值 -->
      <el-table border style="margin: 10px 0" :data="sale">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>

        <el-table-column
          label="销售属性名称"
          align="center"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值" align="center">
          <template #="{ row }">
            <div>
              <el-tag
                v-for="(item, index) in row.spuSaleAttrValueList"
                :key="item.id"
                closable
                style="margin: 0 10px"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ item.saleAttrValueName }}
              </el-tag>
              <!-- 通过一个标记控制输入框与按钮的显示 -->
              <el-input
                v-model="row.saleAttrValue"
                v-if="row.flag == true"
                placeholder="请输入属性值"
                size="small"
                style="width: 100px"
                @blur="toLook(row)"
              ></el-input>
              <el-button
                v-else
                type="success"
                size="small"
                icon="Plus"
                @click="toEdit(row)"
              ></el-button>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="120px">
          <template #="{ $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              title="删除SKU"
              @click="sale.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button
        type="primary"
        icon="SuccessFilled"
        @click="save"
        :disabled="!isSaveEnabled"
      >
        保存
      </el-button>
      <el-button type="info" icon="CircleCloseFilled" @click="cancel">
        取消
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { TradeMark } from '@/api/product/brand/type'
import {
  reqAllSale,
  reqAddOrUpdateSpu,
  reqAllTrademark,
  reqSpuHasSale,
  reqSpuImageList,
} from '@/api/product/spu'
import {
  AllTradeMark,
  HasSaleAttr,
  HasSaleAttrResponseData,
  SaleAttr,
  SaleAttrResponseData,
  SaleAttrValue,
  SpuData,
  SpuHasImg,
} from '@/api/product/spu/type'
import { ElMessage, UploadUserFile } from 'element-plus'
import { computed, ref } from 'vue'

let $emit = defineEmits(['changeScene'])

// 存储全部品牌数据
let allTradeMark = ref<TradeMark[]>([])
const imgList = ref<UploadUserFile[]>([])
// 已有spu销售属性
let sale = ref<SaleAttr[]>([])
// 全部spu销售属性
let allSale = ref<HasSaleAttr[]>([])
// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
  category3Id: '', // 收集三级分类的ID
  spuName: '', // SPU的名字
  description: '', // SPU的描述
  tmId: '', // 品牌的ID
  spuImageList: [],
  spuSaleAttrList: [],
})

// 控制对话框的显示与隐藏效果
let dialogVisible = ref<boolean>(false)

// 对话框预览图片地址
let dialogImageUrl = ref<string>('')

// 将来手机还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')

// 计算出当前spu未有的销售属性
let unSelectSaleAttr = computed(() => {
  // filter JS原生的函数，将当前spu未有的属性过滤出来
  let unSelectArr = allSale.value.filter((item) => {
    return sale.value.every((element) => {
      return item.name != element.saleAttrName
    })
  })
  return unSelectArr
})

// 点击取消按钮通知父组件切换场景为1
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

const initHasSpuData = async (spu: SpuData) => {
  // 存储已有SPU对象，将来在模版中展示
  SpuParams.value = spu

  // 获取全部品牌数据
  let result: AllTradeMark = await reqAllTrademark()

  // 获取某一个品牌下全部售卖商品的图片
  let images: SpuHasImg = await reqSpuImageList(spu.id as number)

  // 获取已有spu销售属性数据
  let saleAttr: SaleAttrResponseData = await reqSpuHasSale(spu.id as number)

  // 获取全部销售数据
  let saleInfo: HasSaleAttrResponseData = await reqAllSale()

  // 存储全部品牌数据
  allTradeMark.value = result.data

  // 转换SpuImage为UploadUserFile，并确保name和url属性都是字符串
  imgList.value = images.data.map((item) => {
    return {
      name: item.imgName ?? 'default-name', // Fallback to a default name if undefined
      url: item.imgUrl ?? '', // Fallback to an empty string if undefined
    } as UploadUserFile
  })

  // 存储已有SPU的销售属性
  sale.value = saleAttr.data

  // 存储全部的销售属性值
  allSale.value = saleInfo.data
}

// 照片墙点击预览按钮的回调
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl.value = file.url
  dialogVisible.value = true
}

// 照片墙移除照片的钩子
const handleRemove = () => {
  ElMessage({
    type: 'success',
    message: '删除成功',
  })
}

// 照片上传前的钩子
const handleUpload = (rawFile: any) => {
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

// 添加销售属性按钮回调
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  // 准备一个新的销售属性对象：将来带给服务器即可
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }

  // 追加到已选销售属性数组中
  sale.value.push(newSaleAttr)

  // 从 allSale 中移除已选择的销售属性
  // 添加新销售属性时，将其从 allSale 中过滤掉，然后 Vue 的 computed 会自动更新 unSelectSaleAttr。
  allSale.value = allSale.value.filter(
    (item) => item.id.toString() !== baseSaleAttrId,
  )

  // 清空收集的数据
  saleAttrIdAndValueName.value = ''
}

// 属性值添加按钮点击事件
const toEdit = (row: SaleAttr) => {
  // 为销售属性对象动态添加一个flag属性
  row.flag = true
  row.saleAttrValue = ''
}

// 属性值添加模块输入表单元素脱焦回调
const toLook = (row: SaleAttr) => {
  const { baseSaleAttrId, saleAttrValue } = row

  // 添加新的属性值之前需要检查是否合法
  // 不能为空
  if (saleAttrValue?.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }

  // 不能重复
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值重复',
    })

    return
  }

  // 整理成服务器需要的属性值形式
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }

  // 追加新的属性值对象
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  // 脱焦后切换为button展示
  row.flag = false
}

// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 1:照片墙的数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      // 这里还需要考虑新增图片的url
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })

  // 整理销售属性的数据
  SpuParams.value.spuSaleAttrList = sale.value

  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '更新成功' : '添加成功',
    })
    // 通知父组件切换场景,如果是添加属性则返回第一页，更新则停留当前页
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '更新失败' : '添加失败',
    })
  }
}

// 添加新的spu初始化请求的方法
const initAddSpu = async (d3Id: number | string) => {
  // 清空之前收集的数据
  Object.assign(SpuParams.value, {
    id: '',
    category3Id: '', // 收集三级分类的ID
    spuName: '', // SPU的名字
    description: '', // SPU的描述
    tmId: '', // 品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
  })
  // 情况照片墙与属性值
  imgList.value = []
  sale.value = []
  // 情况之前选择的属性值
  saleAttrIdAndValueName.value = ''
  // 存储三级分类的id
  SpuParams.value.category3Id = d3Id
  // 获取全部品牌的数据
  let result: AllTradeMark = await reqAllTrademark()
  let result1: HasSaleAttrResponseData = await reqAllSale()
  // 存储数据
  allTradeMark.value = result.data
  allSale.value = result1.data
}

const isSaveEnabled = computed(() => {
  // 检查每个销售属性是否至少有一个值
  return (
    sale.value.length > 0 &&
    sale.value.every((attr) => attr.spuSaleAttrValueList.length > 0)
  )
})
// 对外暴露
defineExpose({ initHasSpuData, initAddSpu })
</script>

<style lang="scss" scoped>
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
