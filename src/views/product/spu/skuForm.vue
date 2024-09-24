<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input type="text" placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="number" placeholder="价格(元)" v-model="skuParams.price"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input type="number" placeholder="重量(克)" v-model="skuParams.weight"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="SKU描述" v-model="skuParams.skuDesc"></el-input>
    </el-form-item>
    <!-- 平台属性 -->
    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" style="margin: 5px 0" :label="item.attrName"
          label-width="80px">
          <el-select placeholder="请选择平台属性" size="default" style="width: 240px; margin: 0 10px"
            v-model="item.attrIdAndValueId">
            <el-option :value="`${item.id}:${attrValue.id}`" v-for="(attrValue, index) in item.attrValueList"
              :key="attrValue.id" :label="attrValue.valueName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 销售属性 -->
    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select 
            placeholder="请选择销售属性" 
            size="default" 
            style="width: 240px; margin: 0 10px"
            v-model="item.saleIdAndValueId"
          >
            <el-option :value="`${item.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
              :label="saleAttrValue.saleAttrValueName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>
    <!-- 照片墙 -->
    <el-form-item label="图片名称">
      <el-table border :data="imgArr" ref="table">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="{row, $index}">
            <el-button type="warning" @click="handler(row)">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="save">保存</el-button>
      <el-button type="info" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attribute'
import { reqAddSku, reqSpuHasSale, reqSpuImageList } from '@/api/product/spu'
import { SkuData, SpuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue'

let $emit = defineEmits(['changeScene'])
// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}

// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片墙数据
let imgArr = ref<any>([])
// 收集SKU参数
let skuParams = reactive<SkuData>({
  category3ID: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
  skuDefaultImg: ''
})

// 获取table组件实例对象
let table = ref<any>();

// 当前子组件方法对外暴露，获取sku初始数据
const initSkuData = async (
  d1ID: string | number,
  d2ID: string | number,
  spu: SpuData,
) => {
  // 收集数据
  skuParams.category3ID = spu.category3Id;
  skuParams.spuId = spu.id as number;
  skuParams.tmId = spu.tmId;

  // 获取平台属性数据
  let attrInfo: any = await reqAttr(d1ID, d2ID, spu.category3Id)
  attrArr.value = attrInfo.data
  // 获取销售属性数据
  let saleAttr = await reqSpuHasSale(spu.id as number)
  saleArr.value = saleAttr.data
  // 获取照片墙数据
  let imgList = await reqSpuImageList(spu.id as number)
  imgArr.value = imgList.data
};

// 设置默认图片按钮回调
const handler = (row: any) => {
  // 点击时全部图片的复选框不勾选
  table.value.clearSelection();
  // 复选框选中
  table.value.toggleRowSelection(row, true);
  // 收集默认图片地址
  skuParams.skuDefaultImg = row.imgUrl;
  
}; 

// 保存按钮回调
const save = async () => {
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
    if (next.attrIdAndValueId) {
      let [attrId, valueId] = next.attrIdAndValueId.split(':');
      prev.push({
        attrId,
        valueId
      })      
    }
    return prev;
  }, []); 

  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
    if (next.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':');
      prev.push({
        saleAttrId,
        saleAttrValueId
      })  
    }
    return prev;
  }, []);
    
  // 添加SKU请求
  let result: any = await reqAddSku(skuParams);
  console.log(result);
  
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功'
    });
    // 通知父组件切换场景
    $emit('changeScene', {flag: 0, params: ''});
  }else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败'
    })
  }
  
}

// 暴露方法
defineExpose({ initSkuData })
</script>

<style lang="scss" scoped></style>
