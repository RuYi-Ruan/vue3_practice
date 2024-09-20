<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请输入SPU名称" v-model="SpuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select placeholder="请选择SPU品牌" style="width: 240px" v-model="SpuParams.tmId">
                <el-option v-for="(item, index) in allTradeMark" :key="item.id" :label="item.tmName"
                    :value="(item.id) as number">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请输入SPU描述" v-model="SpuParams.description"></el-input>
        </el-form-item>

        <el-form-item label="SPU照片">
            <el-upload v-model:file-list="fileList"
                action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>

            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
            </el-dialog>
        </el-form-item>

        <el-form-item label="SPU销售属性">
            <el-select placeholder="请选择SPU销售属性" style="width: 240px; margin-right:10px;">
            </el-select>
            <el-button type="primary" icon="Plus">添加销售属性</el-button>

            <el-table border style="margin: 10px 0">
                <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>

                <el-table-column label="销售属性名称" align="center" width="120px"></el-table-column>
                <el-table-column label="销售属性值" align="center"></el-table-column>

                <el-table-column label="操作" align="center" width="120px">
                    <!-- row即为已有SPU对象 -->
                    <template>
                        <el-button type="danger" size="small" icon="Delete" title="删除SKU"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" icon="SuccessFilled">保存</el-button>
            <el-button type="info" icon="CircleCloseFilled" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang='ts'>
import { TradeMark } from '@/api/product/brand/type';
import { reaAllSale, reqAllTrademark, reqSpuHasSale, reqSpuImageList } from '@/api/product/spu';
import { AllTradeMark, HasSaleAttr, HasSaleAttrResponseData, SaleAttr, SaleAttrResponseData, SpuData, SpuHasImg, SpuImage } from '@/api/product/spu/type';
import { ref } from 'vue';

let $emit = defineEmits(['changeScene']);
// 存储全部品牌数据
let allTradeMark = ref<TradeMark[]>([]);
let imgList = ref<SpuImage[]>([]);
let sale = ref<SaleAttr[]>([]);
let allSale = ref<HasSaleAttr[]>([]);
// 存储已有的SPU对象
let SpuParams = ref<SpuData>({
    category3Id: "", // 收集三级分类的ID
    spuName: "", // SPU的名字
    description: "", // SPU的描述
    tmId: '', // 品牌的ID
    spuImageList: [],
    spuSaleAttrList: [],
});


// 点击取消按钮通知父组件切换场景为1
const cancel = () => {
    $emit('changeScene', 0);
};

const initHasSpuData = async (spu: SpuData) => {
    // 存储已有SPU对象，将来在模版中展示
    SpuParams.value = spu;
    // spu 即为父组件传递过来的已有的spu数据（不完整）
    // 获取全部品牌数据
    let result: AllTradeMark = await reqAllTrademark();
    // 获取某一个品牌下全部售卖商品的图片
    let images: SpuHasImg = await reqSpuImageList((spu.id) as number);
    // 获取已有spu销售属性数据
    let saleAttr: SaleAttrResponseData = await reqSpuHasSale((spu.id) as number);
    // 获取全部销售数据
    let saleInfo: HasSaleAttrResponseData = await reaAllSale();
    // 存储全部品牌数据
    allTradeMark.value = result.data;
    // SPU对应商品图片
    imgList.value = images.data;
    // 存储已有SPU的销售属性
    sale.value = saleAttr.data;
    // 存储全部的销售属性值
    allSale.value = saleInfo.data;
}

// 对外暴露
defineExpose({ initHasSpuData });
</script>


<style lang='scss' scoped>
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