/** router配置
 * 这个文件设置的是导航跳转的方式
 * */

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Upload',
        component: () => import('../views/UploadPicture.vue')
    },
    {
        path: "/Mapbox",
        name: "Mapbox",
        component: () =>
            import("../views/MapResult.vue")
    },
    {
        path: "/MapSelect",
        name: "MapSelect",
        component: () =>
            import("../components/MapSelect.vue")
    },
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// export default router;

