import request from '@/utils/request'
import { MenuParams, PermissionResponseData } from './type'

enum API {
  // 获取全部菜单与按钮的数据接口
  ALLMENUDATA_URL = '/admin/acl/permission',
  // 给某一级菜单新增一个子菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  // 更新已有的菜单
  UPDATEMENU_URL = '/admin/acl/permission/update',
  // 删除已有菜单接口
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}

// 获取全部菜单与按钮的数据请求
export const reqGetAllMenuData = () =>
  request.get<any, PermissionResponseData>(API.ALLMENUDATA_URL)

// 添加|更新菜单请求
export const reqAddOrUpdateMenu = (data: MenuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEMENU_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}

// 删除已有菜单请求
export const reqDeleteMenu = (id: number) =>
  request.delete<any, any>(API.DELETEMENU_URL + id)
