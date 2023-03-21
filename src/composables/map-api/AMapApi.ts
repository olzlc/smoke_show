import AMapLoader from "@amap/amap-jsapi-loader";
import {
  AMapLat,
  AMapLng,
  WGS84Lat,
  WGS84Lng,
  LocationPoint,
  LocationInfo,
} from "@/composables/baseTypes";
import fetchJsonp from "fetch-jsonp";
import { reject } from "lodash";
import { gcj02_to_wgs84 } from "@/composables/map-api/coordinateSystemConversion";
import {
  openErrorMessage,
  openInfoMessage,
  openSuccessMessage,
} from "@/composables/utilsFunction";

/**
 * 加载高德地图，不会加载地图组件，而是返回AMap构造器。
 */
async function initAMapApplication() {
  try {
    // 加载高德地图
    let AMap = await AMapLoader.load({
      key: "bdf2e1ff3edcc39a5f61f61e508322d0", // 申请好的Web端开发者Key，首次调用 load 时必填
      version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    });
    return AMap;
  } catch (e) {
    Promise.reject(e);
  }
}

async function getCurrentLocation() {
  const AMap = await initAMapApplication();
  let geolocation;
  AMap.plugin("AMap.Geolocation", () => {
    geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
      // 定位按钮的停靠位置的偏移量
      offset: [10, 20],
      //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      zoomToAccuracy: true,
      //  定位按钮的排放位置,  RB表示右下
      position: "RB",
    });
  });
  return geolocation;
}

/**
 * 通过高德API异步根据经纬度获取地址
 * @param longitude 经度（GCJ02坐标系）
 * @param latitude 纬度（GCJ02坐标系）
 */
export async function coordinateToAddressAMap(
  longitude: AMapLng,
  latitude: AMapLat
) {
  // 高德地图
  const ak = "6973286fef5affc71521702c07d73aaf";
  const base_url = "https://restapi.amap.com/v3/geocode/regeo?key=";
  const url =
    base_url +
    ak +
    "&location=" +
    String(longitude) +
    "," +
    String(latitude) +
    "&poitype=&radius=10&extensions=all&batch=false&roadlevel=0";
  const result = await fetchJsonp(url).then(function (response: any) {
    return response.json();
  });
  const formatted_address = result.regeocode.formatted_address;
  return formatted_address;
}

/**
 * 获取当前位置精确位置，并将当前位置的GPS经纬度解析成地址显示。
 */
export async function getCurrentLocationAMap(callback: any) {
  try {
    openInfoMessage("正在定位当前位置，请稍候。", "short");
    const geolocation = await getCurrentLocation();
    if(geolocation !== null && geolocation !== undefined){
      (geolocation as any).getCurrentPosition(async (status: any, result: any) => {
        if (status == "complete") {
          let currentInfo = new LocationInfo(0, 0, "");
          [currentInfo.longitude, currentInfo.latitude] = gcj02_to_wgs84(
            result.position.lng,
            result.position.lat
          );
  
          // 地址直接用火星坐标系在高德下直接转换(高德地图用的就是火星坐标系)
          currentInfo.address = await coordinateToAddressAMap(
            result.position.lng,
            result.position.lat
          );
  
          openSuccessMessage("定位成功。", "short");
          callback(currentInfo);
        } else {
          reject("获取位置失败");
          openErrorMessage("定位失败，请重试。");
          callback();
        }
      });
    }
    
  } catch (e) {
    reject("获取位置失败,可能是key值过期");
    openErrorMessage("定位失败，请重试。");
    callback();
  }
}

/**
 * 通过百度API异步根据经纬度获取地址
 * @param longitude 经度
 * @param latitude 纬度
 * @deprecated 未使用到这个转化函数。
 */
export async function coordinateToAddressBaidu(
  longitude: WGS84Lng,
  latitude: WGS84Lat
) {
  const base_url =
    "https://api.map.baidu.com/reverse_geocoding/v3/?ak=ZKo9oqFdSm2wXVg9masa59qTUGlBEQf9&output=json&coordtype=wgs84ll";
  const url =
    base_url + "&location=" + String(latitude) + "," + String(longitude);
  const result = await fetchJsonp(url).then(function (response: any) {
    return response.json();
  });
  const {
    result: { formatted_address },
  } = result;
  return formatted_address;
}

/**
 * 地址转经纬度
 * 返回Promise，WGS84的数组，第一个元素是经度，第二个是纬度
 * @deprecated 未使用到这个转化函数。
 */
export async function addressToCoordinateAMap(
  address: string
): Promise<LocationPoint> {
  const AMap = await initAMapApplication();
  let currentInfo = new LocationPoint(0, 0);
  AMap.plugin("AMap.Geocoder", function () {
    var geocoder = new AMap.Geocoder({
      // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
      city: "全国",
    });
    geocoder.getLocation(address, function (status: any, result: any) {
      if (status === "complete" && result.info === "OK") {
        [currentInfo.longitude, currentInfo.latitude] = gcj02_to_wgs84(
          result.geocodes[0].location.lng,
          result.geocodes[0].location.lat
        );
      } else {
        reject("修改位置失败");
      }
    });
  });
  // 不管成功与否均返回位置
  return currentInfo;
}
