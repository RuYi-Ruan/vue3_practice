import request from "@/utils/request";
import { User, UserData } from "./type";
// 用户管理模块接口
enum API {
    // 获取全部已有账户信息
    ALLUSER_URL = '/admin/acl/user/',
    // 添加一个新的账号
    ADDUSER_URL = '/admin/acl/user/save',
    // 更新已有账号
    UPDATEUSER_URL = '/admin/acl/user/update'
}

// 获取全部已有账户信息请求方法
export const reqAllUser = (page: number, limit: number) => 
    request.get<any, User>(API.ALLUSER_URL + `${page}/${limit}`)
// 新增账号请求|更新账号信息请求
export const reqAddOrUpdateUser = (data: UserData) => {
    // 携带参数id则为更新请求
    if(data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data);
    }else {
        return request.post<any, any>(API.ADDUSER_URL, data);
    }
}
