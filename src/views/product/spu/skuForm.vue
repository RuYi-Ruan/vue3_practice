<template>
  <el-form label-width="100px">
    <el-form-item label="SKU名称">
      <el-input type="text" placeholder="SKU名称"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)">
      <el-input type="text" placeholder="价格(元)"></el-input>
    </el-form-item>
    <el-form-item label="重量(克)">
      <el-input type="text" placeholder="重量(克)"></el-input>
    </el-form-item>
    <el-form-item label="SKU描述">
      <el-input type="textarea" placeholder="SKU描述"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in attrArr" :key="item.id" style="margin: 5px 0;" :label="item.attrName"
          label-width="80px">
          <el-select placeholder="请选择平台属性" size="default" style="width: 240px; margin: 0 10px;">
            <el-option value="" v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id"
              :label="attrValue.valueName">

            </el-option>
          </el-select>
        </el-form-item>


      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form :inline="true">
        <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
          <el-select placeholder="请选择销售属性" size="default" style="width: 240px; margin: 0 10px;">
            <el-option value="" v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key=saleAttrValue.id
              :label="saleAttrValue.saleAttrValueName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片名称">
      <el-table border :data="imgArr">
        <el-table-column type="selection" width="80px" align="center"></el-table-column>
        <el-table-column label="图片">
          <template #="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px;">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template #="">
            <el-button type="warning">设置默认</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button type="info" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attribute';
import { reqSpuHasSale, reqSpuImageList } from '@/api/product/spu';
import { SpuData } from '@/api/product/spu/type';
import { ref } from 'vue';

let $emit = defineEmits(['changeScene']);
// 取消按钮回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' });
}

// 平台属性
let attrArr = ref<any>([]);
// 销售属性
let saleArr = ref<any>([]);
// 照片墙数据
let imgArr = ref<any>([]);

// 当前子组件方法对外暴露，获取sku初始数据
const initSkuData = async (d1ID: string | number, d2ID: string | number, spu: SpuData) => {
  // 获取平台属性数据
  let attrInfo: any = await reqAttr(d1ID, d2ID, spu.category3Id);
  attrArr.value = attrInfo.data;
  // 获取销售属性数据
  let saleAttr = await reqSpuHasSale((spu.id as number));
  saleArr.value = saleAttr.data;
  // 获取照片墙数据
  let imgList = await reqSpuImageList((spu.id as number));
  imgArr.value = imgList.data;

}

defineExpose({ initSkuData });
</script>

<style lang="scss" scoped></style>
