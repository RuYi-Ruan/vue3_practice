//对外暴露配置路由(常量路由):全部用户都可以访问到的路由
export const constantRoute = [
    {
        //登录
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login',
        meta: {
            title: '登录', //菜单标题
            hidden: true, //代表路由标题在菜单中是否隐藏  true:隐藏 false:不隐藏
            icon: 'Promotion', //菜单文字左侧的图标,支持element-plus全部图标
        },
    },
    {
        path: '/',
        component: () => import('@/views/home/index.vue'),
        meta: {
            title: '首页',
            hidden: false,
            icon: 'HomeFilled',
        },
    },
    {
        //404
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hidden: true,
            icon: 'DocumentDelete',
        },
    },
    {
        //任意路由
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
            title: '任意路由',
            hidden: true,
            icon: 'DataLine',
        },
    }
]

