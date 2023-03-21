<template>
  <div class="map-box">
    <!-- 地图 -->
    <div class="chart" id="mapContainer" ref="mapDivElement" />
    <!-- 测距部分代码 -->
    <div id="distance" class="distance-container" />
    <div class="option">
      <div>
        <div style="display: flex">
          <!-- <el-button-group>
            <el-button class="changepadding" type="primary" :icon="Ruler" :plain="!isSetDis"
              @click="mappingChangeHandle">测距</el-button>
            <el-button class="changepadding" type="primary" :plain="!isSatellite" @click="setMapStyleHandler">
              <Satellite />
              <div style="margin-left: 6px;">卫星</div>
            </el-button>
            <el-button class="changepadding" type="primary" :icon="Road" :plain="!isAddTraffic"
              @click="changeTrafficMapVisibilityHandler">路况</el-button>
            <el-button class="changepadding" type="primary" :icon="Message" :plain="!isShowInfo"
              @click="showInfoButtonHandler">展开信息</el-button>
          </el-button-group> -->
          <!-- 加入判断，消除二次点击卫星图再点击路况bug，以及高亮无法聚焦bug -->
          <el-button v-if="isSetMapStyleIng" :loading="true" style="width: 266.4px;">加载中</el-button>
          <el-button-group v-else>
            <el-button v-if="!isSetDis" class="changepadding" :icon="Ruler" :loading="isSetMapStyleIng"
              @click="mappingChangeHandle">测距</el-button>
            <el-button v-else type="primary" class="changepadding" :icon="Ruler" :loading="isSetMapStyleIng"
              @click="mappingChangeHandle">测距</el-button>
            <el-button v-if="!isSatellite" class="changepadding" :loading="isSetMapStyleIng" @click="setMapStyleHandler">
              <Satellite />
              <div style="margin-left: 6px;">卫星</div>
            </el-button>
            <el-button v-else type="primary" class="changepadding" :plain="!isSatellite" :loading="isSetMapStyleIng"
              @click="setMapStyleHandler">
              <Satellite />
              <div style="margin-left: 6px;">卫星</div>
            </el-button>
            <el-button v-if="!isAddTraffic" class="changepadding" :icon="Road" :loading="isSetMapStyleIng"
              @click="changeTrafficMapVisibilityHandler">路况</el-button>
            <el-button v-else class="changepadding" type="primary" :icon="Road" :loading="isSetMapStyleIng"
              @click="changeTrafficMapVisibilityHandler">路况</el-button>
            <el-button v-if="!isShowInfo" class="changepadding" :icon="Message" :loading="isSetMapStyleIng"
              @click="showInfoButtonHandler">展开信息</el-button>
            <el-button v-else class="changepadding" type="primary" :icon="Message" :loading="isSetMapStyleIng"
              @click="showInfoButtonHandler">展开信息</el-button>
          </el-button-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { Ref, ref, watch, toRefs } from "vue";
import { useRoute } from 'vue-router'
import { MapType, DetectResponse, DetectBox } from "@/composables/baseTypes";
import { setMapStyleMapbox } from "@/composables/result-page/changeMapStyle";
import { initResultPage } from "@/composables/result-page/initMap";
import { addPointInfo } from "@/composables/result-page/controlInfo";
import { mappingStatusChange } from "@/composables/result-page/distanceMapping";
import { removeElButtonFocus } from "@/composables/utilsFunction";
import { changeTrafficMapVisibility } from "@/composables/result-page/traffic-layers";
import { Road, Ruler, Message } from "@icon-park/vue-next";
import mapData from "@/composables/result-page/exampleData";
import { FeatureCollection, Feature, Geometry, GeoJsonProperties } from "geojson";


let mapObj: Ref<FeatureCollection> = ref({type: "FeatureCollection", features: []} as FeatureCollection<Geometry, GeoJsonProperties>)
// TODO:样例数据
// 动态路由实现：https://blog.csdn.net/hsuehgw/article/details/129250004
if (history.state.params !== undefined) { // 假如是从搜索页跳转回来
// const props = defineProps(["resultdata"]);
// const props = toRefs(props);
// const route = useRoute()
  const detectResponse: Ref<DetectResponse> = ref({ statusMessage: "", detectBox: [], detectImage: "" })
  const resultdata = history.state.params.resultdata
  console.log(resultdata)

  // 预测框
  let detectBox: Ref<DetectBox[]> = ref([] as DetectBox[])
  if(resultdata.detect_box !== undefined)
    detectBox.value = JSON.parse(resultdata.detect_box) as DetectBox[]
  console.log(detectBox.value)

  // 预测图片
  let detectPic = ''
  if(resultdata.detect_image !== undefined)
    detectPic = resultdata.detect_image

  // 图片以base64传入
  let info = resultdata.image_info
  let all_feature: Ref<Feature[]> = ref([])
  let feature: Ref<Feature> = ref({ type: "Feature", geometry: { "type": "Point", "coordinates": [info.lng, info.lat] }, properties: { "name": detectPic, "address": info.address } } as Feature)
  all_feature.value.push(feature.value)
  mapObj = ref({ type: "FeatureCollection", features: all_feature.value } as FeatureCollection<Geometry, GeoJsonProperties>)
} else { // 否则读取样例数据

  let all_feature: Ref<Feature[]> = ref([])
  for (let queryResult of mapData.value) {
    let feature: Ref<Feature> = ref({ type: "Feature", geometry: { "type": "Point", "coordinates": [queryResult.lng, queryResult.lat] }, properties: { "name": queryResult.name, "address": queryResult.address } } as Feature)
    all_feature.value.push(feature.value)
  }
  mapObj = ref({ type: "FeatureCollection", features: all_feature.value } as FeatureCollection<Geometry, GeoJsonProperties>)
}
// 设置测距
const isSetDis = ref(false);

const {
  keepZoom,
  map,
  mapDivElement,
  trafficLayersId,
  isShowInfo,
  isSetMapStyleIng
} = initResultPage(mapObj);


// 设置地图类型
const isSatellite = ref(false);
const style: Ref<MapType> = ref("street-map");
const setMapStyleHandler = (event: any) => {
  isSetMapStyleIng.value = true;

  isSatellite.value = !isSatellite.value;

  // 改变地图类型前关闭测距功能
  isSetDis.value = false;
  mappingStatusChange(map, isSetDis.value)

  // 改变地图类型前关闭路况叠加功能
  isAddTraffic.value = false;

  if (isSatellite.value)
    style.value = "satellite";
  else
    style.value = "street-map";

  let arr: Ref<number[]> = ref([map.value.getCenter().lng, map.value.getCenter().lat]);
  setMapStyleMapbox(
    map,
    keepZoom,
    mapDivElement as Ref<HTMLDivElement>,
    style.value,
    trafficLayersId,
    isShowInfo,
    mapObj,
    isSetMapStyleIng,
    arr
  );
  removeElButtonFocus(event);
};

const mappingChangeHandle = (event: any) => {
  isSetDis.value = !isSetDis.value;
  mappingStatusChange(map, isSetDis.value)
  removeElButtonFocus(event);
}

// 标记是否有路况叠加
const isAddTraffic = ref(false);

const changeTrafficMapVisibilityHandler = (event: any) => {
  isAddTraffic.value = !isAddTraffic.value
  changeTrafficMapVisibility(map, trafficLayersId)
  removeElButtonFocus(event);
}

const showInfoButtonHandler = (event: any) => {
  isShowInfo.value = !isShowInfo.value
  addPointInfo(map, isShowInfo, mapObj);
  removeElButtonFocus(event);
};

// todo: 画板解决频繁显示的警告
// console.log(map.value.getCanvas);
// .getContext('2d', {willReadFrequently: true});

</script>

<style scoped>
@import "../assets/css/mapbox-gl.css";
/* @import "../assets/css/index.css"; */

.chart {
  height: 100%;
  min-height: 500px;
  width: 100%;
}

.map-box {
  position: relative;
}

.option {
  position: absolute;
  top: 15px;
  right: 30px;
  font-family: "Open Sans", sans-serif;
  max-width: 600px;
}

/* 改变左右宽度 */
.changepadding {
  padding-left: 5px;
  padding-right: 5px;
}
</style>
<style>
/* 禁止滚动条 */
body {
  /* overflow-y: hidden; */
  padding-right: 0px;
}

/* 测距 */
.distance-container {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
}

.distance-container>* {
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  display: block;
  margin: 0;
  padding: 5px 10px;
  border-radius: 3px;
  font-family: sans-serif;
}

/* 
去除mapboxlogo最后一个div
子节点序号是从1开始，2是第二个节点, last是最后一个控件
 */
.mapboxgl-ctrl-bottom-left>div:last-child {
  display: none !important;
}

/* 禁止attribution有个按钮显示 */
/* .mapboxgl-ctrl-attrib-button {
  display: none !important;
} */

/* 指北针控件 ＋ */
.mapboxgl-ctrl-zoom-in {
  background-image: url(data:image/svg+xml;charset=utf8,<svg%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27>%0A%20%20<path%20style%3D%27fill%3A%23ff0000%3B%27%20d%3D%27M%2010%206%20C%209.446%206%209%206.4459904%209%207%20L%209%209%20L%207%209%20C%206.446%209%206%209.446%206%2010%20C%206%2010.554%206.446%2011%207%2011%20L%209%2011%20L%209%2013%20C%209%2013.55401%209.446%2014%2010%2014%20C%2010.554%2014%2011%2013.55401%2011%2013%20L%2011%2011%20L%2013%2011%20C%2013.554%2011%2014%2010.554%2014%2010%20C%2014%209.446%2013.554%209%2013%209%20L%2011%209%20L%2011%207%20C%2011%206.4459904%2010.554%206%2010%206%20z%27%20%2F>%0A<%2Fsvg>%0A) !important;
}

/* - */
.mapboxgl-ctrl-zoom-out {
  background-image: url(data:image/svg+xml;charset=utf8,<svg%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27>%0A%20%20<path%20style%3D%27fill%3A%23ff0000%3B%27%20d%3D%27m%207%2C9%20c%20-0.554%2C0%20-1%2C0.446%20-1%2C1%200%2C0.554%200.446%2C1%201%2C1%20l%206%2C0%20c%200.554%2C0%201%2C-0.446%201%2C-1%200%2C-0.554%20-0.446%2C-1%20-1%2C-1%20z%27%20%2F>%0A<%2Fsvg>%0A) !important;
}
</style>