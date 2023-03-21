<template>
  <el-container>
    <el-aside width="60%" style="overflow-x: hidden; padding-top: 0px">
      <div class="chart-box">
        <div class="chart" id="mapContainer" ref="mapDivElement"></div>
      </div>
    </el-aside>
    <el-main width="40%" style="padding-right: 50px;">
      <div style="height: 60px">
        <el-input
          :prefix-icon="Search"
          v-model="inputAddress"
          placeholder="搜索地址"
          clearable
          @input="searchAddressHandle"
          @clear="clearSelectHandle"
        />
        <el-divider></el-divider>
      </div>
      <el-table
        ref="scollTableTop"
        :data="selectAllData"
        max-height="340px"
        highlight-current-row
        :show-header="false"
        @current-change="selectionChangeHandle"
      >
        <el-table-column width="500">
          <template #default="scope">
            <div>
              <strong style="font-size: large">{{ scope.row.title }}</strong>
              <div
                style="font-size: small; line-height: normal; color: #909399"
              >{{ scope.row.address }}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
  <!-- <el-divider style="margin-bottom: 0"></el-divider> -->
</template>

<script lang="ts" setup>
import {
  initDragMap,
  searchAddress,
  selectionChange,
  checkMapMove,
  flyTo,
  getAddressFirstTime,
} from "@/composables/get-location/mapSelectInit";
import { Repositioning } from "@icon-park/vue-next";
import { Search } from "@element-plus/icons-vue";
import { ref, watch } from "vue";
import { getCurrentLocationAMap } from "@/composables/map-api/AMapApi";
import { openErrorMessage, openWarningMessage, removeElButtonFocus } from "@/composables/utilsFunction";
import { LocationInfo } from "@/composables/baseTypes";

const {
  map,
  mapDivElement,
  marker,
  selectAllData,
  selectFinalData,
  arrCenter,
  isFinishLoad,
} = initDragMap();

// 用户输入的地址
const inputAddress = ref("");

// 搜索框发生变化
const searchAddressHandle = () => {
  searchAddress(selectAllData, inputAddress);
};

// 清空选择
const clearSelectHandle = () => {
  // selectAllData.splice(0, selectAllData.length);
};

// 从表格中选择
const selectionChangeHandle = (selectData: any) => {
  selectionChange(map, selectData, selectFinalData);
};

// 获得用户当前定位
const getCurrentAddressButtonHandler = (event: Event) => {
  removeElButtonFocus(event);
  try {
    selectFinalData.value = null;
    getCurrentLocationAMap((data: LocationInfo) => {
      // 在深圳外
      if (data !== null && data !== undefined) {
        // if (
        //   data.longitude < 113.5 ||
        //   data.longitude > 114.8 ||
        //   data.latitude < 22.3 ||
        //   data.latitude > 22.9
        // ) {
          [data.longitude, data.latitude] = [
            113.9343, 22.5366
          ];
          openWarningMessage("范围超出深圳", 900);
        // }
        flyTo(map, [data.longitude, data.latitude]);
      }
    });
  } catch (e) {
    openErrorMessage("定位失败", 900);
  }
};

// 子组件回传值
const changeaddress = defineEmits(["changeaddress"]);

// 父组件回传
let fatherInfo = defineProps({
    latitude: {
        type: Number, //数据类型
        required: true, //是否必填
        default: 22.533191, //默认值
    },
    longitude: {
        type: Number, //数据类型
        required: true, //是否必填
        default: 113.930478, //默认值
    },
    isemitingprovince: {
        type: Boolean, //数据类型
        required: true, //是否必填
        default: false, //默认值
    }
})

watch(
  () => fatherInfo.isemitingprovince,
  () => {
    // console.log(fatherInfo.latitude,fatherInfo.longitude)
    flyTo(map, [fatherInfo.longitude, fatherInfo.latitude]);
  },
  { deep: true }
);

// 检测地图中心移动，回传值改写query
watch(
  [() => arrCenter.value.longitude, () => arrCenter.value.latitude],
  () => {
    changeaddress("changeaddress", map.value.getCenter());
  },
  { deep: true }
);

const scollTableTop = ref();

// 检测地图是否完成，完成后开始检测移动
watch(
  () => isFinishLoad.value,
  () => {
    if (isFinishLoad.value === true) {
      getAddressFirstTime(map, selectAllData);
      checkMapMove(
        map,
        selectAllData,
        selectFinalData,
        arrCenter.value,
        scollTableTop
      );
    }
  },
  { deep: true }
);
</script>

<style scoped>
@import "../assets/css/mapbox-gl.css";

.mapboxgl-ctrl-scale {
  height: 10px;
  background-color: transparent;
  line-height: 10%;
  text-align: center;
  margin: 0 0 13px 10px;
}

.mapboxgl-ctrl.mapboxgl-ctrl-attrib {
  display: none !important;
}
a.mapboxgl-ctrl-logo {
  display: none !important;
}

.chart {
  height: 400px;
  width: 100%;
}

/* 改变卡片与地图中间间隔 */
.el-main {
  --el-main-padding: 0px;
  margin-left: 20px;
}
</style>

<style>
.chart-box {
  position: relative;
}
.chart-box .el-button {
  position: absolute;
  right: 10px !important;
  bottom: 10% !important;
  width: 40px;
  height: 40px;
  font-size: 20px;
}

.map-bottom {
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
  position: absolute;
  width: 40%;
  left: 55%;
  bottom: 2.5%;
}

/* 
去除mapboxlogo最后一个div
子节点序号是从1开始，2是第二个节点, last是最后一个控件
 */
 .mapboxgl-ctrl-bottom-left>div:last-child {
  display: none !important;
}


/* 禁止拖动变蓝 */
body {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.mapboxgl-ctrl-attrib-button {
  /* 禁止attribution有个按钮显示 */
  display: none !important;
}
</style>
