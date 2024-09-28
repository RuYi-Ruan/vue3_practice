export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 每一个账号信息的ts类型
export interface UserData {
    id?: number | string,
    createTime?: string,
    updateTime?: string,
    username: string,
    password: string,
    name: string,
    phone?: string,
    roleName?:string
}
// 包含全部用户信息的数组
export type Records = UserData []

// 接口返回的账号对象的ts类型
export interface User extends ResponseData{
    data: {
        records: Records
        total: number,
        size: number,
        current: number,
        pages: number
    }
}