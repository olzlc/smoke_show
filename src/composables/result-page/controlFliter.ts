import { Ref, ref } from "vue";
import { openErrorMessage } from "@/composables/utilsFunction";
import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
} from "geojson";
import { Map } from "mapbox-gl";
import { addPointInfo } from "@/composables/result-page/controlInfo";
import { setupFilter } from "@/composables/result-page/initFilter";

export function initFliterAttribute() {
  // 筛选属性
  const filterName: Ref<string> = ref("");

  // 筛选符号
  const filterSign: Ref<string> = ref("");

  // 筛选数字
  const filterNum: Ref<number> = ref(0);

  // 输入字符串
  const filterString: Ref<string> = ref("");

  // 火灾类型选项, 火势强度选项, 风向选项选择
  const singleChoice: Ref<string> = ref("");
  return {
    filterName,
    filterSign,
    filterNum,
    filterString,
    singleChoice,
  };
}

// 字符串去空格转小写
function normalize(string: string) {
  return string.trim().toLowerCase();
}

export function addFliter(
  filterName: Ref<string>,
  isWhatType: Ref<number>,
  filterSign: Ref<string>,
  filterNum: Ref<number>,
  filterString: Ref<string>,
  singleChoice: Ref<string>,
  isFlitering: Ref<boolean>,
  mapObj: Ref<FeatureCollection>,
  fliterMapObj: Ref<FeatureCollection>,
  map: Ref<Map>,
  isShowInfo: Ref<boolean>
) {
  // 检查是否出错
  if (filterName.value === "") {
    openErrorMessage("请填写筛选类型");
    return;
  }
  if (isWhatType.value === 0) {
    if (filterSign.value === "") {
      openErrorMessage("请填写符号判断");
      return;
    }
    if (filterNum.value === null || filterNum.value === undefined) {
      openErrorMessage("请填写判断数字");
      return;
    }
  } else if (isWhatType.value === 1) {
    if (filterString.value === "") {
      openErrorMessage("请填写筛选字符串");
      return;
    }
  } else {
    if (singleChoice.value === "") {
      openErrorMessage("请填写筛选选项");
      return;
    }
  }
  isFlitering.value = true;
  enum Operator {
    GreaterThan = ">",
    LessThan = "<",
    Equal = "==",
    GreaterThanOrEqual = ">=",
    LessThanOrEqual = "<=",
  }
  let fliter_feature: Ref<Feature[]> = ref([]);

  if (isWhatType.value === 0) {
    for (const feature of mapObj.value.features) {
      let prop = feature.properties;
      if (prop) {
        if (filterSign.value === Operator.GreaterThan) {
          if (prop[filterName.value] > filterNum.value) {
            fliter_feature.value.push(feature);
          }
        } else if (filterSign.value === Operator.LessThan) {
          if (prop[filterName.value] < filterNum.value) {
            fliter_feature.value.push(feature);
          }
        } else if (filterSign.value === Operator.Equal) {
          if (prop[filterName.value] === filterNum.value) {
            fliter_feature.value.push(feature);
          }
        } else if (filterSign.value === Operator.GreaterThanOrEqual) {
          if (prop[filterName.value] >= filterNum.value) {
            fliter_feature.value.push(feature);
          }
        } else if (filterSign.value === Operator.LessThanOrEqual) {
          if (prop[filterName.value] <= filterNum.value) {
            fliter_feature.value.push(feature);
          }
        } else {
          openErrorMessage("出现筛选错误！");
        }
      }
    }
  } else if (isWhatType.value === 1) {
    for (const feature of mapObj.value.features) {
      let prop = feature.properties;
      if (
        prop &&
        normalize(prop[filterName.value]).includes(
          normalize(filterString.value)
        )
      ) {
        fliter_feature.value.push(feature);
      }
    }
  } else {
    for (const feature of mapObj.value.features) {
      let prop = feature.properties;
      if (prop && prop[filterName.value] === singleChoice.value) {
        fliter_feature.value.push(feature);
      }
    }
  }
  // 输出最后筛选结果
  // for (const feature of fliter_feature.value) {
  //   const info = feature.properties?.info
  //   console.log(info[filterName.value])
  // }
  fliterMapObj.value = {
    type: "FeatureCollection",
    features: fliter_feature.value,
  } as FeatureCollection<Geometry, GeoJsonProperties>;
  addPointInfo(map, isShowInfo, mapObj, isFlitering, fliterMapObj);
  //   console.log(fliter_feature.value);

  // 图层筛选
  if (isWhatType.value === 0) {
    map.value.setFilter("measure-points", [
      filterSign.value,
      ["get", filterName.value],
      filterNum.value,
    ]);
  } else if (isWhatType.value === 1) {
    map.value.setFilter("measure-points", [
      "in",
      filterString.value,
      ["get", filterName.value],
    ]);
  } else {
    map.value.setFilter("measure-points", [
      "==",
      ["get", filterName.value],
      singleChoice.value,
    ]);
  }
}

export function combineString(
  filterName: Ref<string>,
  isWhatType: Ref<number>,
  filterSign: Ref<string>,
  filterNum: Ref<number>,
  filterString: Ref<string>,
  singleChoice: Ref<string>,
  isFlitering: Ref<boolean>,
  combiningFliterStrings: Ref<string>
) {
  if (!isFlitering) return;
  combiningFliterStrings.value = ''
  const {filterAttribute, signOption, fireTypeOption, fireIntensityOption, windDirectionOption} = setupFilter();
  let opt = [];
  if (isWhatType.value === 0 || isWhatType.value === 1)
    opt = filterAttribute[isWhatType.value].options;
  else opt = filterAttribute[2].options;
  for(let item of opt){
    if(item.value === filterName.value){
        combiningFliterStrings.value += item.label;
        break;
    }
  }
  if(isWhatType.value === 0){
    if(filterSign.value === '==')
        combiningFliterStrings.value += ' = ' + filterNum.value;
    else
        combiningFliterStrings.value += ' ' + filterSign.value + ' ' + filterNum.value;
  }
  else if(isWhatType.value === 1){
    combiningFliterStrings.value += ' : ' + filterString.value;
  }
  else{
    let option = [] as Array<{ value: string; label: string; }>;
    if(isWhatType.value === 2)
        option = fireTypeOption
    else if(isWhatType.value === 3)
        option = fireIntensityOption
    else if(isWhatType.value === 4)
        option = windDirectionOption
    for(let item of option){
        if(singleChoice.value === item.value){
            combiningFliterStrings.value += ' : ' + item.label;
            return;
        }
    }
  }
}
