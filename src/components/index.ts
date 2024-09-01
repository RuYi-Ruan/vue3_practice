import { App } from "vue";
import SvgIcon from "./SvgIcon/index.vue";
import pagination from './pagination/index.vue';

// 全局对象
const allGlobalComponent = { SvgIcon, pagination };

// 对外暴露插件对象
export default {
    install(app: App) {
        Object.keys(allGlobalComponent).forEach(key => {
            // 使用类型断言，将 key 断言为 allGlobalComponent 的键
            app.component(key, allGlobalComponent[key as keyof typeof allGlobalComponent]);
        });
    }
}
