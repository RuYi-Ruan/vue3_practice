// SKU模块接口管理
import request from "@/utils/request";
import { SkuResponseData } from "./type";
// 定义SKU接口
enum API {
    // 获取已有的SKU数据
    SKU_URL = '/admin/product/list/',
    // 商品上架接口
    ONSALE_URL = '/admin/product/onSale/',
    // 商品下架接口
    CANCELSALE_URL = '/admin/product/cancelSale/'
}

// 获取SKU方法
export const reqSkuInfo = (page: number, limit: number) => request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`);
// 商品上架请求
export const reqOnSaleSku = (skuId: number) => request.get<any, any>(API.ONSALE_URL + skuId);
// 商品下架请求
export const reqCalcelSaleSku = (skuId: number) => request.get<any, any>(API.ONSALE_URL + skuId);

