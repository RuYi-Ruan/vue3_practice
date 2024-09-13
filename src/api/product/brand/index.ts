// 书写品牌管理模块的接口
import request from "@/utils/request";
import { TradeMarkResponseData } from "./type";
// 品牌管理模块接口地址
enum API {
    // 获取已有品牌接口
    TRADEMARK_URL = '/admin/product/baseTrademark/'
}
// 获取已有品牌的接口方法
// page：获取第几页--默认第一页
// limit：获取几个已有品牌的数据
export const reqHasTrademark = (page: number, limit: number) => request.get<any, TradeMarkResponseData>(API.TRADEMARK_URL + `${page}/${limit}`);