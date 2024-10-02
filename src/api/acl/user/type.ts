export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 每一个账号信息的ts类型
export interface UserData {
  id?: number | string
  createTime?: string
  updateTime?: string
  username: string
  password: string
  name: string
  phone?: string
  roleName?: string
}
// 包含全部用户信息的数组
export type Records = UserData[]

// 接口返回的账号对象的ts类型
export interface User extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

// 某个职位的ts类型
export interface RoleData{
  id?: number | string,
  createTime?: string,
  updateTime?: string,
  roleName: string,
  remark: null
}

// 获取全部职位接口返回数据的ts类型
export interface Role extends ResponseData {
  data: {
    assignRoles: RoleData [],
    allRolesList: RoleData []
  }
}

// 给用户分配职位接口携带参数的ts类型
export interface AssignRoleData {
  roleIdList: number[],
  userId: number
}
