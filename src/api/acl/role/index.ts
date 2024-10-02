// 角色管理模块接口
import request from "@/utils/request";
import { RoleData, RoleResponseData } from "./type";
// 接口地址
enum API {
    // 获取全部职位接口
    ALLROLE_URL = '/admin/acl/role/',
    // 新增职位接口
    ADDROLE_URL = '/admin/acl/role/save',
    // 更新职位接口
    UPDATEROLE_URL = '/admin/acl/role/update'
}

// 获取全部职位请求
export const reqGetAllRole = (page: number, limit: number, roleName: string) => 
    request.get<any, RoleResponseData>(API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`)

// 添加与更新职位请求
export const reqAddOrUpdateRole = (role: RoleData) =>{
    if(role.id){
        return request.put<any, any>(API.UPDATEROLE_URL, role)
    }else {
        return request.post<any, any>(API.ADDROLE_URL, role)
    }
}
