// 服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// SPU数据的ts类型：需要更改
export interface SpuData {
  id?: number | string
  spuName: string
  description: string
  category3Id: string | number
  tmId: number | string
  spuSaleAttrList: SaleAttr[]
  spuImageList: SpuImage[]
}

// 数组：元素都是已有的spu数据类型
export type Records = SpuData[]
// 定义获取已有的SPU接口返回的数据ts类型
export interface HasSpuResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    searchCount: boolean
    pages: number
  }
}

// 品牌数据的ts类型
export interface Trademark {
  id: number
  tmName: string
  logoUrl: string
}
// 品牌接口返回的数据ts类型
export interface AllTradeMark extends ResponseData {
  data: Trademark[]
}
// 商品图片ts类型
export interface SpuImage {
  id?: number
  imgName?: string
  imgUrl?: string
  spuId?: number
  createTime?: string
  updateTime?: string
  name?: string
  url?: string
}
// 已有SPU照片墙数据类型
export interface SpuHasImg extends ResponseData {
  data: SpuImage[]
}
// 已有的销售属性值对象ts类型
export interface SaleAttrValue {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrValueName: string
  saleAttrName?: string
  isChecked?: null
}

// 存储已有的销售属性值数组类型
export type SpuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象ts类型
export interface SaleAttr {
  id?: number
  createTime?: null
  updateTime?: null
  spuId?: number
  baseSaleAttrId: number | string
  saleAttrName?: string
  spuSaleAttrValueList: SpuSaleAttrValueList
  flag?: boolean
  saleAttrValue?: string
}

// SPU已有的销售属性接口返回数据ts类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// 已有的全部SPU销售数据ts类型
export interface HasSaleAttr {
  id: number
  name: string
}

// SPU销售属性对象的ts类型
export interface HasSaleAttrResponseData extends ResponseData {
  data: HasSaleAttr[]
}
