// 角色管理模块接口
import request from '@/utils/request'
import { MenuResponseData, RoleData, RoleResponseData } from './type'
// 接口地址
enum API {
  // 获取全部职位接口
  ALLROLE_URL = '/admin/acl/role/',
  // 新增职位接口
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新职位接口
  UPDATEROLE_URL = '/admin/acl/role/update',
  // 获取全部菜单与按钮的数据
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  // 给相应职位分配权限
  ASSINGPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  // 删除角色
  DELETEROLE_URL = '/admin/acl/role/remove/',
}

// 获取全部职位请求
export const reqGetAllRole = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )

// 添加与更新职位请求
export const reqAddOrUpdateRole = (role: RoleData) => {
  if (role.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, role)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, role)
  }
}

// 获取全部菜单与按钮的请求
export const reqGetAllPermission = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)

// 给指定职位分配权限请求
export const reqAssignPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, any>(
    API.ASSINGPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )

// 删除角色请求
export const reqDeleteRole = (roleId: number) =>
  request.delete<any, any>(API.DELETEROLE_URL + roleId)
