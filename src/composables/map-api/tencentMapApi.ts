import axios from "axios";
import { LocationPoint } from "@/composables/baseTypes";
import { reactive, ref, Ref } from "vue";
import { openErrorMessage } from "@/composables/utilsFunction";

const key = "J6CBZ-TZLRK-FDXJI-AEFT3-3XS4Q-D5BXS"; // 腾讯API秘钥


/**
 * 异步获得位置
 *
 *  通过终端设备IP地址获取其当前所在地理位置，精确到市级，常用于初始化用户城市等非精确定位场景。
 */
export async function getCurrentLocationTencent() {
  let url = "getAddressTencent/ws/location/v1/ip";
  try {
    let response = await axios.get(url);
    return reactive(
      new LocationPoint(
        (response.data as any).result.location.lat,
        (response.data as any).result.location.lng
      )
    );
  } catch (e) {
    // 深大经纬度，转换前
    openErrorMessage("粗略定位时发生错误。", 900);
    return reactive(new LocationPoint(22.5366, 113.9343));
  }
}

/**
 * 搜索附近相关位置，获得搜索结果列表
 * @param queryString 查询关键字
 */
export async function getAddressSearchTencent(queryString: any) {
  const base_url =
    "getAddressTencent/ws/place/v1/suggestion/?region=&keyword=";
  const url = base_url + queryString + "&key=" + key;
  try {
    let resultlist = await axios.get(url)
    return resultlist.data;
  } catch (e) {
    // 深大经纬度，转换前
    openErrorMessage("搜索附近相关位置失败", 900);
    return "";
  }
}

/**
 * 腾讯地图周边推荐
 * @param lng
 * @param lat
 * @param radius 单位:m
 */
export async function getAddressExploreTencent(
  lng: number,
  lat: number,
  radius: number
) {
  try {
    let base_url =
      "getAddressTencent/ws/place/v1/explore?boundary=nearby";
    // 1 [默认] 自动扩大范围（依次按照按1公里、2公里、5公里，最大到全城市范围搜索）
    let boundary =
      "(" + String(lat) + "," + String(lng) + "," + String(radius) + ")";
    let url = base_url + boundary + "&page_size=20&page_index=1&key=" + key;
    let addresslist = await axios.get(url);

    // 搜索失败，使用另一个尝试获取
    if ((addresslist as any).status !== 200) {
      base_url = "getAddressTencent/ws/place/v1/here?boundary=nearby";
      url = base_url + boundary + "&page_size=20&page_index=1&key=" + key;
      addresslist = await axios.get(url);
    }
    return addresslist.data;
  } catch (e) {
    openErrorMessage("搜索附近相关位置失败", 900);
    return "";
  }
}

/**
 * 腾讯地图省市区经纬度定位
 * @param lng
 * @param lat
 * @param radius 单位:m
 */
export async function getLatLngTencent(
  province: string,
  city: string,
  area: string
) {
    let url ="getAddressTencent/ws/district/v1/getchildren?key=" + key;
    let addresslist = await axios.get(url);
    let citylist = addresslist.data.result;
    let id = 0;
    let latlng: Ref<LocationPoint> = ref({latitude: 22.533191, longitude: 113.930478} as LocationPoint) 
  try {
    // 匹配省
    for(let i=0; citylist.length >= 1 && i < citylist[0].length; i++){
      if(province === citylist[0][i].fullname){
        id = citylist[0][i].id;
        break;
      }
    }
    // 匹配市
    if(id !== 0){
      url ="getAddressTencent/ws/district/v1/getchildren?id=" + id + "&key=" + key;
      addresslist = await axios.get(url);
      citylist = addresslist.data.result;
      for(let i=0; citylist.length >= 1 && i < citylist[0].length; i++){
        if(city === citylist[0][i].fullname){
          id = citylist[0][i].id;
          break;
        }
      }
    }
    // 匹配区
    if(id !== 0){
      url ="getAddressTencent/ws/district/v1/getchildren?" + "id=" + id + "&key=" + key;
      addresslist = await axios.get(url);
      citylist = addresslist.data.result;
      for(let i=0; citylist.length >= 1 && i < citylist[0].length; i++){
        if(area === citylist[0][i].fullname){
          id = citylist[0][i].id;
          latlng.value.longitude = citylist[0][i].location.lng;
          latlng.value.latitude = citylist[0][i].location.lat;
          return latlng;
        }
      }
    }
    if(id===0){
      openErrorMessage("搜索粗略位置失败", 900);
      return latlng;
    }

    // return addresslist.data;
  } catch (e) {
    openErrorMessage("搜索粗略位置失败", 900);
    return latlng;
  }
}