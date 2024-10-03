import request from '@/utils/request'
import { AssignRoleData, Role, User, UserData } from './type'
// 用户管理模块接口
enum API {
  // 获取全部已有账户信息
  ALLUSER_URL = '/admin/acl/user/',
  // 添加一个新的账号
  ADDUSER_URL = '/admin/acl/user/save',
  // 更新已有账号
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取选中账号拥有的全部职位的接口
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  // 给已有用户分配职位接口
  ASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除单个账号接口
  DELETESINGLEUSER_URL = '/admin/acl/user/remove/',
  // 批量删除多个用户
  DELETEMOREUSER_URL = '/admin/acl/user/batchRemove',
}

// 获取全部已有账户信息请求方法
export const reqAllUser = (page: number, limit: number, username: string) =>
  request.get<any, User>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
  )
// 新增账号请求|更新账号信息请求
export const reqAddOrUpdateUser = (data: UserData) => {
  // 携带参数id则为更新请求
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
// 获取选中账户全部角色请求
export const reqGetAllRoles = (adminId: number) =>
  request.get<any, Role>(API.ALLROLE_URL + adminId)

// 分配职位请求
export const reqAssignRole = (data: AssignRoleData) =>
  request.post<any, any>(API.ASSIGNROLE_URL, data)

// 删除单个用户
export const reqDeleteSingleUser = (id: number) =>
  request.delete<any, any>(API.DELETESINGLEUSER_URL + id)

// 批量删除多个用户
export const reqDeleteMoreUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEMOREUSER_URL, { data: idList })
