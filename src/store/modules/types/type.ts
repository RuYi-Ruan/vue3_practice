import { CategoryObj } from '@/api/product/attribute/type'
import { ResponseData } from '@/api/user/type'
import { RouteRecordRaw } from 'vue-router'

// 定义小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
}

// 定义分类仓库state对象ts类型
export interface CategoryState {
  d1ID: string|number,
  d1Arr: CategoryObj [],
  d2Arr: CategoryObj[],
  d2ID: string | number,
  d3Arr: CategoryObj [],
  d3ID: string | number
}

// 对应分类下属性与属性值的ts类型
// 属性值对象的ts类型
export interface AttrValue {
  id: number,
  valueName: string,
  attrId: number
}

// 存储每一个属性值的数组类型
export type AttrValueList = AttrValue [];
// 属性对象的ts类型
export interface Attr {
  id: number,
  attrName: '',
  categoryId: number,
  categoryLevel: number, 
  attrValueList: AttrValueList
}

// 存储每一个属性对象的数组ts类型
export type AttrList = Attr[];
// 属性接口返回的数据ts类型
export interface AttrResponseData extends ResponseData {
  data: AttrList
}