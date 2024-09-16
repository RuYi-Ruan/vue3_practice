// 商品分类全局组件的小仓库
import { defineStore } from "pinia";
import { reqDegree1, reqDegree2, reqDegree3 } from "@/api/product/attribute";
import { CategoryResponseData } from "@/api/product/attribute/type";
import { CategoryState } from "./types/type";
let useCategoryStore = defineStore('Category', {
    state: (): CategoryState => {
        return {
            // 存储一级分类数据
            d1Arr: [],
            // 存储一级分类的ID
            d1ID: '',
            d2Arr: [],
            d2ID: '',
            d3Arr: [],
            d3ID: ''
        }
    },
    actions: {
        // 获取一级分类数据的方法
        async getD1() {
            // 发请求获取一级分类的数据
            let result: CategoryResponseData = await reqDegree1();
            if (result.code == 200) {
                this.d1Arr = result.data;
            }

        },
        // 获取二级分类数据
        async getD2() {
            // 一级分类下的二级分类数据
            let result: CategoryResponseData = await reqDegree2(this.d1ID);
            if (result.code == 200) {
                this.d2Arr = result.data;
            }
        },
        // 获取三级分类的数据
        async getD3() {
            // 二级分类下的三级分类数据
            let result:CategoryResponseData = await reqDegree3(this.d2ID);
            if (result.code == 200) {
                this.d3Arr = result.data;
            }
        }
    },
    getters: {

    }
})

// 暴露
export default useCategoryStore;