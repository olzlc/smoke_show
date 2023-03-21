/**
 * 地标 转 国测 常量
 * @deprecated 使用时请多加注意。
 */

const x_PI = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const a = 6378245.0; //卫星椭球坐标投影到平面地图坐标系的投影因子。
const ee = 0.00669342162296594323; //椭球的偏心率。


/**
 * 判断是否在国内，在中国国内的经纬度才需要做偏移
 * @param lng
 * @param lat
 */

export function out_of_china(lng:number, lat:number) {
    // 纬度3.86~53.55,经度73.66~135.05 
    // return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    return (
        lng < 72.004 ||
        lng > 137.8347 ||
        (lat < 0.8293 || lat > 55.8271 || false)
    );
}
 

/**
 * 转化经度
 * @param lng
 * @param lat
 */
function transformlng(lng:number, lat:number) {
    let ret =
        300.0 +
        lng +
        2.0 * lat +
        0.1 * lng * lng +
        0.1 * lng * lat +
        0.1 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) +
            20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lng * PI) +
            40.0 * Math.sin((lng / 3.0) * PI)) *
            2.0) /
        3.0;
    ret +=
        ((150.0 * Math.sin((lng / 12.0) * PI) +
            300.0 * Math.sin((lng / 30.0) * PI)) *
            2.0) /
        3.0;
    return ret;
}
 

/**
 * 转化纬度
 * @param lng
 * @param lat
 */
function transformlat(lng:number, lat:number) {
    let ret =
        -100.0 +
        2.0 * lng +
        3.0 * lat +
        0.2 * lat * lat +
        0.1 * lng * lat +
        0.2 * Math.sqrt(Math.abs(lng));
    ret +=
        ((20.0 * Math.sin(6.0 * lng * PI) +
            20.0 * Math.sin(2.0 * lng * PI)) *
            2.0) /
        3.0;
    ret +=
        ((20.0 * Math.sin(lat * PI) +
            40.0 * Math.sin((lat / 3.0) * PI)) *
            2.0) /
        3.0;
    ret +=
        ((160.0 * Math.sin((lat / 12.0) * PI) +
            320 * Math.sin((lat * PI) / 30.0)) *
            2.0) /
        3.0;
    return ret;
}
 
//wgs84 to gcj02   地球坐标系 转 火星坐标系
/**
 * @param lng
 * @param lat
 */
export function wgs84_to_gcj02(lng:number, lat:number) {
    if (out_of_china(lng, lat)) {
        return [lng, lat];
    } else {
        var dlat = transformlat(lng - 105.0, lat - 35.0);
        var dlng = transformlng(lng - 105.0, lat - 35.0);
        var radlat = (lat / 180.0) * PI;
        var magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        var sqrtmagic = Math.sqrt(magic);
        dlat =
            (dlat * 180.0) /
            (((a * (1 - ee)) / (magic * sqrtmagic)) * PI);
        dlng =
            (dlng * 180.0) / ((a / sqrtmagic) * Math.cos(radlat) * PI);
        var mglat = lat + dlat;
        var mglng = lng + dlng;
 
        return [mglng, mglat];
    }
}
 
 
//gcj02 to wgs84  火星坐标系 转 地球坐标系
/**
 * @param lng
 * @param lat
 */
export function gcj02_to_wgs84(lng:number, lat:number) {
    if (out_of_china(lng, lat)) {
        return [lng, lat]
    }
    else {
        let dlat = transformlat(lng - 105.0, lat - 35.0);
        let dlng = transformlng(lng - 105.0, lat - 35.0);
        const radlat = lat / 180.0 * PI;
        let magic = Math.sin(radlat);
        magic = 1 - ee * magic * magic;
        const sqrtmagic = Math.sqrt(magic);
        dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI);
        dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI);
        const mglat = lat + dlat;
        const mglng = lng + dlng;
        return [lng * 2 - mglng, lat * 2 - mglat]
    }
}
