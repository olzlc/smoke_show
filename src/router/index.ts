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
        path: "/PoiShow",
        name: "PoiShow",
        component: () =>
            import("../views/PoiShow.vue")
    },
    {
        path: "/Analogdetect",
        name: "Analogdetect",
        component: () =>
            import("../views/Analogdetect.vue")
    },
]


export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// export default router;

