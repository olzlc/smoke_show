import { createApp, nextTick, Ref, ref } from "vue";
import {
  FeatureCollection,
  Feature,
  Geometry,
  Point,
  GeoJsonProperties,
} from "geojson";
import mapboxgl, {
  EventData,
  Map,
  MapboxGeoJSONFeature,
  MapMouseEvent,
  Popup,
} from "mapbox-gl";
import ElementPlus from "element-plus/es";
import { WGS84Lat, WGS84Lng } from "@/composables/baseTypes";
import PointPopup from "@/components/PoiPopup.vue";

let vueApplicationCount = 0;
let isShowInfoOverall = ref(true);
let mapOverall: Ref<mapboxgl.Map>;
const singlePopup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
  maxWidth: "400px",
});

/**
 * 在地图上添加点的图层
 * @param mapObj
 * @param map
 * @param current
 */
export function addPointLayer(map: Ref<Map>, poiData: Ref<FeatureCollection>) {
  // // 解决requestAnimationFrame
  // const radarEffect = () => {
  //   let index: Ref<number> = ref(0);
  //   if (index.value % 4 !== 0) {
  //     index.value += 1;
  //     map.value.addSource("geojson", {
  //       type: "geojson",
  //       data: poiData.value,
  //     });

  //     //点
  //     map.value.addLayer({
  //       id: "measure-points",
  //       type: "circle",
  //       source: "geojson",
  //       paint: {
  //         "circle-color": "#4264fb",
  //         "circle-radius": 4,
  //         "circle-stroke-width": 2,
  //         "circle-stroke-color": "#ffffff",
  //       },
  //     });
  //   } else {
  //     index.value = 1;
  //   }
  //   window.requestAnimationFrame(radarEffect);
  // };
  // window.requestAnimationFrame(radarEffect);
  map.value.addSource("geojson", {
    type: "geojson",
    data: poiData.value,
  });

  //点
  map.value.addLayer({
    id: "measure-points",
    type: "circle",
    source: "geojson",
    paint: {
      "circle-color": "#4264fb",
      "circle-radius": 4,
      "circle-stroke-width": 2,
      "circle-stroke-color": "#ffffff",
    },
  });
}

function createPopup(
  popup: Popup,
  popupIndex: number,
  map: Ref<Map>,
  lngLatData: [WGS84Lng, WGS84Lat],
  picName: Ref<string>
) {
  const popupDivIdString = `popup-content-${vueApplicationCount}`;
  const htmlString = `<div id="${popupDivIdString}"></div>`;
  vueApplicationCount++;

  popup.setLngLat(lngLatData).setHTML(htmlString).addTo(map.value);

  // 挂载Vue实例到上面的div中
  nextTick(() => {
    createApp(PointPopup, {
      picName: picName.value,
    })
      .use(ElementPlus)
      .mount(`#${popupDivIdString}`);
  }).then();
}

/**
 * 使用getElementsByClassName原生API进行清除地图中已有的气泡
 */
export function clearPopup() {
  const popups = document.getElementsByClassName("mapboxgl-popup");
  const parent = document.querySelector("#mapContainer");
  for (let i = 0, max = popups.length; i < max; i++) {
    parent?.removeChild(popups[0]);
  }
}

// 加入对应点函数，给on,off匹配函数
function addCorrespondingPointInfo(
  e: MapMouseEvent & { features?: MapboxGeoJSONFeature[] } & EventData
) {
  // 监视过程中再次判断，否则可能出现全部信息显示时拖动后被改变的bug
  if (!isShowInfoOverall.value) {
    // 将光标样式更改为UI指示器
    mapOverall.value.getCanvas().style.cursor = "pointer";

    // 复制坐标数组
    let lngLatData: [WGS84Lng, WGS84Lat] = [e.lngLat.lng, e.lngLat.lat];

    let name: Ref<string> = ref(
      (((e.features as Array<{}>)[0] as any).properties as any).name
    );
    createPopup(singlePopup, 0, mapOverall, lngLatData, name);
  }
}

// 鼠标移动移除对应点信息
function removeCorrespondingPointInfo() {
  if (!isShowInfoOverall.value) {
    mapOverall.value.getCanvas().style.cursor = "";
    singlePopup.remove();
    clearPopup();
  }
}

// 加入悬停信息展示
export function addPointInfo(
  map: Ref<Map>,
  isShowInfo: Ref<boolean>,
  mapObj: Ref<FeatureCollection>
) {
  // 光标不变
  if (map.value.getCanvas().style.cursor !== "")
    map.value.getCanvas().style.cursor = "";

  clearPopup();

  // 赋值改变全局变量
  isShowInfoOverall.value = isShowInfo.value;
  mapOverall = map;
  // 关闭监听器
  map.value.off("mouseenter", "measure-points", addCorrespondingPointInfo);
  map.value.off("mouseleave", "measure-points", removeCorrespondingPointInfo);

  if (isShowInfo.value) {
    for (let i = 0; i < mapObj.value.features.length; i++) {
      let feature: Ref<Feature<Geometry, GeoJsonProperties>> = ref(
        mapObj.value.features[i] as Feature<Geometry, GeoJsonProperties>
      );
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        maxWidth: "400px",
      });
      let geo: Ref<Point> = ref(feature.value.geometry as Point);
      let prop: Ref<GeoJsonProperties> = ref(
        feature.value.properties as GeoJsonProperties
      );
      let point: Ref<number[]> = ref(geo.value.coordinates as number[]);
      let picName: Ref<string> = ref(prop.value?.name as string);
      let lngLatData: [WGS84Lng, WGS84Lat] = [point.value[0], point.value[1]];
      createPopup(popup, i, map, lngLatData, picName);
    }
  } else {
    // 创建悬停但不加入

    // 需要对应layer的图层
    map.value.on("mouseenter", "measure-points", addCorrespondingPointInfo);

    // 移开鼠标即移除
    map.value.on("mouseleave", "measure-points", removeCorrespondingPointInfo);
  }
}
