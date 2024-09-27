// SKU模块接口管理
import request from '@/utils/request'
import { skuDetailData, SkuResponseData } from './type'
// 定义SKU接口
enum API {
  // 获取已有的SKU数据
  SKU_URL = '/admin/product/list/',
  // 商品上架接口
  ONSALE_URL = '/admin/product/onSale/',
  // 商品下架接口
  CANCELSALE_URL = '/admin/product/cancelSale/',
  // 获取商品详情的接口
  SKUDETAIL_URL = '/admin/product/getSkuInfo/',
  // 删除商品接口
  DELETESKU_URL = '/admin/product/deleteSku/'
}

// 获取SKU方法
export const reqSkuInfo = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
// 商品上架请求
export const reqOnSaleSku = (skuId: number) =>
  request.get<any, any>(API.ONSALE_URL + skuId)
// 商品下架请求
export const reqCalcelSaleSku = (skuId: number) =>
  request.get<any, any>(API.ONSALE_URL + skuId)
// 获取商品详情的接口
export const reqSkuDetail = (skuId: number) => 
  request.get<any, skuDetailData>(API.SKUDETAIL_URL + skuId)
// 删除已有商品
export const reqRemoveSku = (spuId: number) => 
  request.delete<any, any>(API.DELETESKU_URL + spuId)