// 书写属性相关API
import request from "@/utils/request";
import type { CategoryResponseData } from './type'
import { AttrResponseData } from "@/store/modules/types/type";
// 属性管理模块接口地址
enum API {
    // 一级分类接口
    DEGREE1_URL = '/admin/product/getCategory1',
    // 二级分类接口
    DEGREE2_URL = '/admin/product/getCategory2/',
    // 三级分类接口
    DEGREE3_URL = '/admin/product/getCategory3/',
    // 获取分类下已有的属性与属性值
    ATTR_URL = '/admin/product/attrInfoList/',

}

// 暴露接口的方法
export const reqDegree1 = () => request.get<any, CategoryResponseData>(API.DEGREE1_URL);
export const reqDegree2 = (category1Id: number | string) => request.get<any, CategoryResponseData>(API.DEGREE2_URL + category1Id);
export const reqDegree3 = (category2Id: number | string) => request.get<any, CategoryResponseData>(API.DEGREE3_URL + category2Id);
// 获取对应分类下的属性与属性值接口
export const reqAtrr = (
    category1Id: number | string,
    category2Id: number | string,
    category3Id: number | string
) => request.get<any, AttrResponseData>(API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`);

