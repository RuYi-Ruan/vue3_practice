// 书写属性相关API
import request from '@/utils/request'
import type { CategoryResponseData, Attr } from './type'
import { AttrResponseData } from './type'
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
  // 添加或修改已有属性值的接口
  ADDORUPDATEATTR_URL = '/admin/product/saveAttrInfo',
  // 删除已有属性的接口
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

// 暴露接口的方法
export const reqDegree1 = () =>
  request.get<any, CategoryResponseData>(API.DEGREE1_URL)
export const reqDegree2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.DEGREE2_URL + category1Id)
export const reqDegree3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.DEGREE3_URL + category2Id)
// 获取对应分类下的属性与属性值接口
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

// 新增或修改已有属性接口
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR_URL, data)

// 删除已有属性接口
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
