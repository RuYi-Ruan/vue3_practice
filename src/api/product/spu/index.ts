import request from "@/utils/request";
import { HasSpuResponseData } from "./type";
enum API {
    // 获取已有的SPU数据
    GETHASSPU_URL = '/admin/product/'
}

export const reqHasSpu = (page: number, limit: number, category3Id: string | number) => 
    request.get<any, HasSpuResponseData>(API.GETHASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`)