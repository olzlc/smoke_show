import { onMounted, Ref, ref } from "vue";
import mapboxgl, { Map } from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language"; // 加中文
import { MapType } from "@/composables/baseTypes";
import {
  mapboxStreetMap,
  mapboxSatelliteMap,
  mapboxTerrainMap,
  mapboxMyToken,
  mapboxTrafficMap,
  streetBaseMapUrl
} from "@/composables/map-api/tokens";
import { trafficLayers } from "@/composables/result-page/traffic-layers";
import { openErrorMessage } from "@/composables/utilsFunction";
import {
  addPointInfo,
  addPointLayer,
} from "@/composables/result-page/controlInfo";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

/**
 * 通用的初始化地图
 * @returns
 */
export function initResultPage(mapObj: Ref<FeatureCollection>) {
  const mapboxgl = require("mapbox-gl"); // 引入mapbox-gl组件
  const keepZoom = ref(16.5);
  const isShowInfo: Ref<boolean> = ref(true);
  const mapDivElement: Ref<HTMLDivElement | null> = ref(null);
  const map: Ref<Map> = ref({}) as Ref<Map>;
  const trafficLayersId: Ref<string[]> = ref([]);
  const isSetMapStyleIng: Ref<boolean> = ref(true);
  const isFlitering: Ref<boolean> = ref(false)
  const fliterMapObj: Ref<FeatureCollection> = ref({ type: "FeatureCollection", features: [] } as FeatureCollection<Geometry, GeoJsonProperties>)


  onMounted(_initResultPage);

  function _initResultPage() {
    trafficLayersId.value = [];
    keepZoom.value = 16.5;
    isShowInfo.value = true;
    initMap();
  }

  return {
    keepZoom,
    map,
    mapDivElement,
    trafficLayersId,
    isShowInfo,
    isSetMapStyleIng,
    isFlitering,
    fliterMapObj
  };

  /**
   * 初始化mapbox
   */
  function initMap() {
    mapboxgl.accessToken = mapboxMyToken;
    // "pk.eyJ1IjoiZ2VnZWppIiwiYSI6ImNrdjJpeGdsYzJ2OWIzMnA2OTUzNXJkdGMifQ.IpfJUvi40Saj1xYqQcTJvQ";
    mapNew(
      map,
      mapDivElement,
      keepZoom,
      "street-map",
      trafficLayersId,
      isShowInfo,
      mapObj,
      isSetMapStyleIng,
      isFlitering,
      fliterMapObj
    );
  }
}

/**
 * 新建地图
 *
 */
export function mapNew(
  map: Ref<Map>,
  mapDivElement: Ref<HTMLDivElement | null>,
  keepZoom: Ref<number>,
  style: MapType,
  trafficLayersId: Ref<string[]>,
  isShowInfo: Ref<boolean>,
  mapObj: Ref<FeatureCollection>,
  isSetMapStyleIng: Ref<boolean>,
  isFlitering: Ref<boolean>,
  fliterMapObj: Ref<FeatureCollection>,
  nowPlace: Ref<number[]> = ref([-1, -1])
) {
  if (mapDivElement.value === null) {
    throw Error("map new init error");
  }

  trafficLayersId.value = []; // 清空原有的traffic info layers

  // 传递切换样式后的坐标，定位到切换前位置, lng, lat
  let arr: [number, number] = [113.930478, 22.533191];
  if (
    nowPlace.value[0] !== -1 &&
    nowPlace.value[1] !== -1 &&
    nowPlace.value[0] !== undefined &&
    nowPlace.value[0] !== undefined
  ) {
    arr[0] = nowPlace.value[0];
    arr[1] = nowPlace.value[1];
  }else if(mapObj.value.features[0] !== null && mapObj.value.features[0]!== undefined){
    arr[0] = (mapObj.value.features[0] as any).geometry.coordinates[0]
    arr[1] = (mapObj.value.features[0] as any).geometry.coordinates[1]
  }

  let styleUrl: Ref<string> = ref("");
  // 街道图
  if (style === "street-map") styleUrl.value = mapboxStreetMap;
  // 卫星图
  else styleUrl.value = mapboxSatelliteMap;

  // 全屏地图设置
  mapDivElement.value.style.height =
    String(document.documentElement.clientHeight - 75) + "px";

  map.value = new mapboxgl.Map({
    container: mapDivElement.value, // container  绑定的组件的id
    center: arr, // 初始坐标系
    minZoom: 1.7, // 设置最小拉伸比例
    zoom: keepZoom.value, // starting zoom 地图初始的拉伸比例
    style: styleUrl.value, // 类型
    pitch: 60, //地图的角度，不写默认是0，取值是0-60度，一般在3D中使用
    bearing: 0, //地图的初始方向，值是北的逆时针度数，默认是0，即是正北,
    antialias: false, //抗锯齿，通过false关闭提升性能
    preserveDrawingBuffer: true, // 设置为true时，能够通过获得地图的canvas控件，将地图导出成图片，为了优化性能，默认值设置为false
    // maxBounds: [
    //   [113.5, 22.3], // 西南方坐标
    //   [114.8, 22.9],
    // ],
    //东北方坐标
    // 深圳范围：东经113°46'～114°37'，北纬22°27'～22°52'
    // 转换为：113.76666666666667 - 114.61666666666666
    // 状况为：22.45 - 22.866666666666667

    attributionControl: false, // 后面加入自定义的attribution
  });

  skyLoad(map);

  // 为了删除额外的信息，不必要的信息
  // 加入样式去除，如果此处去除，比例尺将无法加入
  // let dom = document.querySelector(".mapboxgl-control-container");
  // if (dom !== null && mapDivElement.value !== null)
  //     mapDivElement.value.removeChild(dom);

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

  // 导航控件，不显示指南针(图标无法引用)，只显示缩放
  map.value.addControl(new mapboxgl.NavigationControl({
    "showCompass": false
    }), 'bottom-right');

  // 三维信息
  mapThreeDim(map, style);

  // 默认加载交通信息，然后隐藏不显示
  loadTrafficInfo(map, trafficLayersId);

  // 加载点信息
  mapNewLoadMapbox(map, isShowInfo, mapObj, isFlitering, fliterMapObj);

  // 地图准备好后再修改不为修改中
  map.value.on("load", () => {
    isSetMapStyleIng.value = false;
  });

  // map.value.on("click", () => {
  //   console.log(map.value.getZoom());
  // });
}

/**
 * 添加一个天空层，该层将在地图高度倾斜时显示
 * @param map
 */
export function skyLoad(map: Ref<Map>) {
  map.value.on("load", () => {
    if (map.value.getLayer("sky") === undefined)
      // 当天空层不存在的时候才添加
      map.value.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
  });
}

/**
 * 给地图加入三维数据
 * @param map
 * @param style
 */
export function mapThreeDim(map: Ref<Map>, style: MapType) {
  if (map.value.getSource("mapbox-dem")) map.value.removeSource("mapbox-dem");
  if (map.value.getLayer("3d")) map.value.removeLayer("3d");
  if (style === "street-map") {
    // 在任何符号层下插入该层
    map.value.on("load", () => {
      const layers = map.value.getStyle().layers;
      if (layers !== undefined) {
        const labelLayerId = layers.find((layer) => {
          if ("layout" in layer && layer.layout !== undefined) {
            return layer.type === "symbol" && layer.layout["text-field"];
          } else {
            return false;
          }
        })?.id;

        // MapBox街道矢量TILESET中的“建筑”层包含来自OpenStreetMap的构建高度数据
        map.value.addLayer(
          {
            id: "3d",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 15,
            paint: {
              "fill-extrusion-color": "#aaa",

              // 当用户放大时，使用“插值”表达式为建筑物添加平滑过渡效果
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "height"],
              ],
              "fill-extrusion-base": [
                "interpolate",
                ["linear"],
                ["zoom"],
                15,
                0,
                15.05,
                ["get", "min_height"],
              ],
              "fill-extrusion-opacity": 0.6,
            },
          },
          labelLayerId
        );
      }
    });
  } else if (style === "satellite") {
    map.value.on("load", () => {
      map.value.addSource("mapbox-dem", {
        type: "raster-dem",
        url: mapboxTerrainMap,
        tileSize: 512,
        maxzoom: 14,
      });
      // 将DEM源添加为具有夸张高度的地形图层
      map.value.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
    });
  }
}

/**
 * 加载路况图图层
 * @param map
 * @param trafficLayersId
 */
function loadTrafficInfo(map: Ref<Map>, trafficLayersId: Ref<string[]>) {
  map.value.on("load", () => {
    map.value.addSource("trafficSource", {
      type: "vector",
      url: mapboxTrafficMap,
    });

    const firstPOILabel = map.value.getStyle().layers?.filter((obj) => {
      // @ts-ignore
      return obj["source-layer"] == "poi_label";
    });
    if (firstPOILabel === undefined) {
      openErrorMessage("交通数据添加错误。");
    }

    for (let i = 0; i < trafficLayers.length; i++) {
      if (trafficLayers[i].id !== undefined) {
        trafficLayersId.value.push(trafficLayers[i].id);
        // @ts-ignore
        map.value.addLayer(trafficLayers[i], firstPOILabel[0].id);
        map.value.setLayoutProperty(trafficLayers[i].id, "visibility", "none");
      }
    }
  });
}

/**
 * 新建时加载结果Mapbox部分数据
 * @param map
 * @param isShowInfo
 * @param mapObj
 */
function mapNewLoadMapbox(map: Ref<Map>, isShowInfo: Ref<boolean>, mapObj: Ref<FeatureCollection>, isFlitering: Ref<boolean>, fliterMapObj: Ref<FeatureCollection>,) {
  if (map.value === null) return;
  map.value.on("load", () => {
    if (map.value.getLayer("measure-points")) {
      map.value.removeLayer("measure-points");
      map.value.removeLayer("measure-lines");
      map.value.removeSource("geojson");
    }
    addPointLayer(map, mapObj);
    addPointInfo(map, isShowInfo, mapObj, isFlitering, fliterMapObj);
  });
}
