import { Feature } from "gcoord/dist/types/geojson";
import { FeatureCollection } from "geojson";
import * as turf from "@turf/turf";
import { Ref } from "vue";
import mapboxgl, { Map } from "mapbox-gl";

// 全局地图保存传入参数map,使得在事件on,off中无需传递参数
let mapNow: Ref<mapboxgl.Map>;
// 全局json保存点线
let geojson = {
  type: "FeatureCollection",
  features: [],
} as FeatureCollection;

// 用于画线
let linestring: Feature = {
  type: "Feature",
  geometry: {
    type: "LineString",
    coordinates: [],
  },
  properties: [],
};

// 用于保存抓手找到时点击的点，如果不是全局变量导致切换类型无法测距的bug
let features: mapboxgl.MapboxGeoJSONFeature[] = []

/**
 * 加入点和直线的图层
 * @param map
 * @returns
 */
function addPointLayerDis(map: Ref<Map>) {
  map.value.addSource("geojson-dis", {
    type: "geojson",
    data: geojson,
  });

  //点
  map.value.addLayer({
    id: "measure-points-dis",
    type: "circle",
    source: "geojson-dis",
    paint: {
      "circle-radius": 5,
      "circle-color": "#000",
    },
    filter: ["in", "$type", "Point"],
  });

  // 线
  map.value.addLayer({
    id: "measure-lines-dis",
    type: "line",
    source: "geojson-dis",
    layout: {
      "line-cap": "round",
      "line-join": "round",
    },
    paint: {
      "line-color": "#000",
      "line-width": 2.5,
    },
    filter: ["in", "$type", "LineString"],
  });
}

/**
 * 测距状态修改后改变图层
 * @param map
 * @param geojson
 * @param linestring
 * @param mouseEvent
 * @returns
 */
function clickchange(
  map: Ref<Map>,
  geojson: FeatureCollection,
  linestring: Feature,
  mouseEvent: mapboxgl.MapMouseEvent & mapboxgl.EventData
) {
  const distanceContainer = document.getElementById("distance");

  // 从保存点数组中删除该点。
  if (geojson.features.length > 1) geojson.features.pop();

  // 清除distance容器
  if (distanceContainer !== null) distanceContainer.innerHTML = "";

  // 如果被点击点数量不为0，则找到点id，否则加入点击中位置的点信息
  if (features.length) {
    const id = (features[0].properties as any).id;
    geojson.features = geojson.features.filter(
      (point: any) => point.properties.id !== id
    );
  } else {
    const point = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [mouseEvent.lngLat.lng, mouseEvent.lngLat.lat],
      },
      properties: {
        id: String(new Date().getTime()),
      },
    };
    (geojson.features as any).push(point);
  }

  // 如果此时点数组保存点数量大于1，加入线部分
  if (geojson.features.length > 1) {
    (linestring.geometry as any).coordinates = geojson.features.map(
      (point: any) => point.geometry.coordinates
    );

    (geojson.features as any).push(linestring);

    // 用总距离填充distance容器，加入距离显示部分
    const value = document.createElement("pre");
    const distance = turf.length(linestring as any);
    value.textContent = `总距离: ${distance.toLocaleString()}公里`;
    if (distanceContainer !== null) distanceContainer.appendChild(value);
  }

  // 图层资源换为新的文件
  (map.value.getSource("geojson-dis") as any).setData(geojson);
}

function clickChangeHandle(e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
  clickchange(mapNow, geojson, linestring, e);
}

function mouseMoveHandle(e: mapboxgl.MapMouseEvent & mapboxgl.EventData) {
  if (mapNow.value.getLayer("measure-points-dis")) {
    features = mapNow.value.queryRenderedFeatures(e.point, {
      layers: ["measure-points-dis"],
    });
    // 将光标悬停在地图上的某个点上时，将光标更改为指针，否则光标就是十字线。
    mapNow.value.getCanvas().style.cursor = features.length
      ? "pointer"
      : "crosshair";
  }
}

/**
 * 删除信息
 * @param map
 * @returns
 */
function deleteInfo(map: Ref<Map>) {
  // 将距离容器去除
  const distanceContainer = document.getElementById("distance");
  if (distanceContainer !== null) distanceContainer.innerHTML = "";
  // 清空json
  geojson = {
    type: "FeatureCollection",
    features: [],
  } as any;

  linestring = {
    properties: [],
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: [],
    },
  };
  // 移除图层，需要判断是否存在图层
  if (map.value.getLayer("measure-points-dis")) {
    map.value.removeLayer("measure-points-dis");
    map.value.removeLayer("measure-lines-dis");
    map.value.removeSource("geojson-dis");
  }
  // 鼠标换为抓手
  mapNow.value.getCanvas().style.cursor = "";
}

/**
 * 测距状态修改后改变图层
 * @param map
 * @param isSetDis
 * @returns
 */
export function mappingStatusChange(map: Ref<Map>, isSetDis: boolean) {
  mapNow = map;
  if (isSetDis) {
    //加入图层方便后续找到信息
    addPointLayerDis(mapNow);

    // 将地图抓手变为十字定位标
    map.value.on("mousemove", mouseMoveHandle);
    // 此时为测距状态，监测点击对象
    map.value.on("click", clickChangeHandle);

    // 禁止双击缩放
    map.value.doubleClickZoom.disable();
  } else {
    // 此时为显示状态
    map.value.off("mousemove", mouseMoveHandle);
    map.value.off("click", clickChangeHandle);

    deleteInfo(map);

    // 恢复双击缩放
    map.value.doubleClickZoom.enable();
  }
}
