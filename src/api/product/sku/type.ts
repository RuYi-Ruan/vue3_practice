export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// 平台属性
export interface platformAttr {
    attrId: number | string
    valueId: number | string
}

// 销售属性
export interface saleAttr {
    saleAttrId: number | string
    saleAttrValueId: number | string
}

// SKU
export interface SkuData {
    category3ID: string | number
    spuId: string | number
    tmId: string | number
    skuName: string
    price: string | number
    weight: string | number
    skuDesc: string
    skuAttrValueList?: platformAttr[]
    skuSaleAttrValueList?: saleAttr[]
    skuDefaultImg: string,
    isSale?: number,
    id?: number | string
}

// 获取SKU接口返回数据的ts类型
export interface SkuResponseData extends ResponseData {
    data: {
        records: SkuData[],
        total: number,
        size: number,
        current: number,
        orders: [],
        optimizeCountSql: boolean,
        hitCount: boolean,
        countId: null,
        maxLimit: null,
        searchCount: boolean,
        pages: number
    }
}