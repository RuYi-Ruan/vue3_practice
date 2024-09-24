import request from '@/utils/request'
import {
  AllTradeMark,
  HasSaleAttrResponseData,
  HasSpuResponseData,
  SaleAttrResponseData,
  SkuData,
  SkuInfoData,
  SpuData,
  SpuHasImg,
} from './type'

enum API {
  // 获取已有的SPU数据接口
  GETHASSPU_URL = '/admin/product/',
  // 获取SPU品牌数据接口
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  // 获取某个SPU下全部图片数据接口
  Image_URL = '/admin/product/spuImageList/',
  // 获取SPU销售属性数据接口
  SPUSALEATTR_URL = '/admin/product/spuSaleAttrList/',
  // 获取整个项目的销售属性接口
  ALLSALE_URL = '/admin/product/baseSaleAttrList',
  // 新增spu
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  // 更新已有的spu
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  // 添加SKU接口
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  // 查看已有SPU下的全部商品
  SKUINFO_URL = '/admin/product/findBySpuId/'
}

// 获取三级分类下全部的SPU数据
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: string | number,
) =>
  request.get<any, HasSpuResponseData>(
    API.GETHASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )

// 获取SPU品牌数据
export const reqAllTrademark = () =>
  request.get<any, AllTradeMark>(API.ALLTRADEMARK_URL)
// 获取某个SPU下全部图片数据
export const reqSpuImageList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.Image_URL + spuId)
// 获取某一个SPU的销售属性
export const reqSpuHasSale = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUSALEATTR_URL + spuId)
// 获取全部销售属性
export const reqAllSale = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALE_URL)
// 添加一个新的SPU或修改一个已有的SPU
export const reqAddOrUpdateSpu = (data: SpuData) => {
  // 如果spu对象含有id，则要更新spu
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
};

//添加SKU的请求方法
export const reqAddSku = (data: SkuData) =>
  request.post<any, any>(API.ADDSKU_URL, data);

// 获取已有SPU下全部商品的方法
export const reqSkuList = (spuId: number | string) => request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId);