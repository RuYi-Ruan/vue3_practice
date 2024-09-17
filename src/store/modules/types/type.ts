import { CategoryObj } from '@/api/product/attribute/type'
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
  d1ID: string | number
  d1Arr: CategoryObj[]
  d2Arr: CategoryObj[]
  d2ID: string | number
  d3Arr: CategoryObj[]
  d3ID: string | number
}