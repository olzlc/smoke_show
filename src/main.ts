import { createApp } from 'vue'
import App from './App.vue'
import {router} from './router'
import store from './store'
import ElementPlus from 'element-plus'
import MapSelect from '@/components/MapSelect.vue'
import 'element-plus/dist/index.css'

// Satellite图标由IconPark自定义项目导出而成
import {Satellite} from "@/components/satellite-icon";

createApp(App).use(store).use(ElementPlus).use(router).component("MapSelect", MapSelect).component("Satellite", Satellite).mount('#app')
