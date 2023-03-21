import { onMounted, Ref, ref, reactive } from "vue";
import { LocationPoint, WGS84Lat, WGS84Lng } from "@/composables/baseTypes";
import mapboxgl, { Map, Marker } from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language"; // 加中文
import { skyLoad, mapThreeDim } from "@/composables/result-page/initMap";
import { getCurrentLocationTencent } from "@/composables/map-api/tencentMapApi";
import {
  gcj02_to_wgs84,
} from "@/composables/map-api/coordinateSystemConversion";
import { out_of_china } from "@/composables/map-api/coordinateSystemConversion";
import {
  getAddressSearchTencent,
  getAddressExploreTencent,
} from "@/composables/map-api/tencentMapApi";
import {
  mapboxMyToken,
  mapboxStreetMap,
  mapboxSatelliteMap,
  mapboxTerrainMap,
} from "@/composables/map-api/tokens";
import { openWarningMessage } from "@/composables/utilsFunction";

export function initDragMap() {
  const mapboxgl = require("mapbox-gl"); // 引入mapbox-gl组件
  const mapDivElement: Ref<HTMLDivElement | null> = ref(null);
  const map: Ref<Map> = ref({}) as Ref<Map>;
  const marker: Ref<Marker> = ref({}) as Ref<Marker>;
  let arrCenter: Ref<LocationPoint> = ref({
    longitude: 113.9343,
    latitude: 22.5366,
  });

  // 表格变化值
  const selectAllData = reactive([]) as any[];
  // 用户选择地址
  const selectFinalData = ref();
  const isFinishLoad = ref(false);

  onMounted(initMap);

  return {
    map,
    mapDivElement,
    marker,
    selectAllData,
    selectFinalData,
    arrCenter,
    isFinishLoad,
  };

  /**
   * 初始化mapbox
   */
  function initMap() {
    mapboxgl.accessToken = mapboxMyToken;
    mapNew(map, mapDivElement, marker, arrCenter.value);
    map.value.on("move", moving); //地图移动则变化移动中
    isFinishLoad.value = true;
  }

  function moving() {
    const lngLat = map.value.getCenter();
    marker.value.setLngLat(lngLat);
  }
}

/**
 * 新建地图
 * @param map
 * @param mapDivElement
 * @param marker
 * @param arr
 */
function mapNew(
  map: Ref<Map>,
  mapDivElement: Ref<HTMLDivElement | null>,
  marker: Ref<Marker>,
  arr: LocationPoint
) {
  if (mapDivElement.value !== null) {
    // 在深圳外
    // if (
    //   arr.longitude < 113.5 ||
    //   arr.longitude > 114.8 ||
    //   arr.latitude < 22.3 ||
    //   arr.latitude > 22.9
    // ) {
    //   [arr.longitude, arr.latitude] = [113.93182710878341, 22.53576791534826];
    //   openWarningMessage(
    //     "定位位置超出深圳区域。为了使系统正常运行，将演示设置深圳大学为定位中心。",
    //     "long"
    //   );
    // }

    let styleUrl: string;
    styleUrl = mapboxStreetMap;

    map.value = new mapboxgl.Map({
      container: mapDivElement.value, // container poiId 绑定的组件的id
      center: [arr.longitude, arr.latitude], // 初始坐标系
      minZoom: 1.7, // 设置最小拉伸比例
      zoom: 16, // starting zoom 地图初始的拉伸比例
      // maxZoom: 17, // 设置最大拉伸比例
      style: styleUrl, //styleUrl,"mapbox://styles/gegeji/cl0ot12lw001w15qlb1ldsce1"
      pitch: 60, //地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
      bearing: 0, //地图的初始方向，值是北的逆时针度数，默认是0，即是正北,-17.6
      antialias: false, //抗锯齿，通过false关闭提升性能
      preserveDrawingBuffer: true,
      // maxBounds: [
      //   [113.5, 22.3], // 西南方坐标
      //   [114.8, 22.9],
      // ], //东北方坐标
      // 深圳范围：东经113°46'～114°37'，北纬22°27'～22°52'
      // 经度转换为：113.76666666666667 - 114.61666666666666
      // 纬度为：22.45 - 22.866666666666667
      attributionControl: false,
    });

    skyLoad(map);

    // 中文
    map.value.addControl(
      new MapboxLanguage({
        defaultLanguage: "zh-Hans",
      })
    );

    // 比例尺
    const scale = new mapboxgl.ScaleControl({
      maxWidth: 100,
      unit: "metric",
    });
    map.value.addControl(scale, "bottom-left");
    scale.setUnit("metric");

    // 三维信息
    mapThreeDim(map, "street-map");
    marker.value = new mapboxgl.Marker()
      .setLngLat([arr.longitude, arr.latitude])
      .addTo(map.value);
  } else {
    throw Error("map new init error");
  }
}

/**
 * 检查地图是否有移动。如果移动了，更新地址与推荐列表数据。
 * @param map
 * @param selectAllData
 * @param selectFinalData
 * @param arrCenter
 * @param scollTableTop
 */
export function checkMapMove(
  map: Ref<Map>,
  selectAllData: any[],
  selectFinalData: any,
  arrCenter: LocationPoint,
  scollTableTop: any
) {
  const isZooming = ref(false);
  map.value.on("zoomstart", () => {
    isZooming.value = true;
  });
  map.value.on("moveend", () => {
    let lnglat = map.value.getCenter();
    [arrCenter.longitude, arrCenter.latitude] = [lnglat.lng, lnglat.lat];
    const radius = ref(1000);
    // 可以选择开启列表搜索范围，但是由于最近腾讯API报错，暂时屏蔽
    // if (isZooming.value === true) {
    //   const nowZoom = map.value.getZoom();
    //   // 限制搜索范围14-16
    //   if (nowZoom < 14) radius.value = 1000;
    //   else if (nowZoom > 16) radius.value = 400;
    //   else radius.value = (nowZoom - 14) * 300 + 400;
    // }

    getAddressExploreTencent(lnglat.lng, lnglat.lat, radius.value).then(
      (addressList: any) => {
        if (
          addressList.data !== null &&
          addressList.data !== undefined &&
          addressList.data !== ""
        ) {
          selectAllData.splice(0, selectAllData.length);
          if (
            selectFinalData.value !== null &&
            selectFinalData.value !== undefined &&
            selectFinalData.value !== ""
          ) {
            selectAllData.push(selectFinalData.value);
          }
          for (let i = 0; i < addressList.data.length; i++) {
            if (
              selectFinalData.value !== null &&
              selectFinalData.value !== undefined &&
              selectFinalData.value !== ""
            ) {
              if (
                selectAllData[0] !== null &&
                selectAllData[0] !== undefined &&
                selectAllData[0] !== ""
              )
                if (addressList.data[i].title !== selectAllData[0].title) {
                  selectAllData.push({
                    title: addressList.data[i].title,
                    address: addressList.data[i].address,
                    info: addressList.data[i],
                  });
                }
            } else {
              selectAllData.push({
                title: addressList.data[i].title,
                address: addressList.data[i].address,
                info: addressList.data[i],
              });
            }
          }
        }
      }
    );
    // 滚动到顶
    if (scollTableTop.value !== null) {
      scollTableTop.value.setScrollTop(0);
    }
  });
}

export function searchAddress(selectAllData: any, inputAddress: Ref<string>) {
  if (inputAddress.value !== "") {
    selectAllData.splice(0, selectAllData.length);
    getAddressSearchTencent(inputAddress.value).then((addressList: any) => {
      for (let i = 0; i < addressList.data.length; i++) {
        selectAllData.push({
          title: addressList.data[i].title,
          address: addressList.data[i].address,
          info: addressList.data[i],
        });
      }
    });
  }
}

/**
 * 从表格中选择了新的地址位置，修改地图视野中心。
 * @param map
 * @param selectData
 * @param selectFinalData
 */
export function selectionChange(
  map: Ref<Map>,
  selectData: any,
  selectFinalData: any
) {
  if (selectData !== null && selectData !== undefined && selectData !== "") {
    selectFinalData.value = selectData;
    let lnglat = gcj02_to_wgs84(
      selectData.info.location.lng,
      selectData.info.location.lat
    );
    // 在深圳外
    // if (
    //   lnglat[0] < 113.5 ||
    //   lnglat[0] > 114.8 ||
    //   lnglat[1] < 22.3 ||
    //   lnglat[1] > 22.9
    // ) {
    //   [lnglat[0], lnglat[1]] = [113.93182710878341, 22.53576791534826];
    //   openWarningMessage("范围超出深圳", 900);
    //   selectFinalData.value = null;
    // }
    flyTo(map, [lnglat[0], lnglat[1]]);
  } else {
    selectFinalData.value = null;
  }
}

export function flyTo(map: Ref<Map>, arr: [WGS84Lng, WGS84Lat]) {
  map.value.flyTo({
    zoom: 16,
    center: arr,
    essential: true, // 这种动画被认为是减少运动的必要条件
  });
}

/**
 * 在初次加载完成之后，获取当前位置地址信息，显示在右侧的列表中。
 * @param map
 * @param selectAllData
 */
export function getAddressFirstTime(map: Ref<Map>, selectAllData: any[]) {
  let lnglat = map.value.getCenter();
  getAddressExploreTencent(lnglat.lng, lnglat.lat, 1000).then(
    (addressList: any) => {
      if (
        addressList.data !== null &&
        addressList.data !== undefined &&
        addressList.data !== ""
      ) {
        selectAllData.splice(0, selectAllData.length);
        for (let i = 0; i < addressList.data.length; i++) {
          selectAllData.push({
            title: addressList.data[i].title,
            address: addressList.data[i].address,
            info: addressList.data[i],
          });
        }
      }
    }
  );
}
