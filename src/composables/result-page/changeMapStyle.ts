import { Ref } from "vue";
import { Map } from "mapbox-gl";
import { mapNew } from "@/composables/result-page/initMap";
import { MapType, selectInfo } from "@/composables/baseTypes";
import { FeatureCollection } from "geojson";

/**
 * 设置地图样式
 * @param map
 * @param isShowInfo
 * @param keepZoom
 * @param mapDivElement
 * @param style
 * @param trafficLayersId
 */
export function setMapStyleMapbox(map: Ref<Map>, keepZoom: Ref<number>, mapDivElement: Ref<HTMLDivElement>, style: MapType, trafficLayersId: Ref<string[]>, isShowInfo: Ref<boolean>, mapObj: Ref<FeatureCollection>, isSetMapStyleIng:Ref<boolean>, nowPlace: Ref<number[]>) {
    mapDivElement.value.innerHTML = '<div id="distance" class="distance-container" />'; // 如果不设为空，就会有多个地图
    keepZoom.value = map.value.getZoom();
    mapNew(map, mapDivElement, keepZoom, style, trafficLayersId, isShowInfo, mapObj, isSetMapStyleIng, nowPlace);
}