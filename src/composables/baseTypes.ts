/** 基本类型约定
 *
 * 这个文件规定了整个项目中所使用到的主要的类型标记（interface）与类型
 * */

/** ------- 坐标系定义 -------
 * 地球上同一个地理位置的经纬度，在不同的坐标系中，会有少于偏移，国内目前常见的坐标系主要分为三种：
 * 1. 地球坐标系——WGS84：常见于 GPS 设备，Google 地图等国际标准的坐标体系。
 * 2. 火星坐标系——GCJ-02：中国国内使用的被强制加密后的坐标体系，高德坐标就属于该种坐标体系。
 * 3. 百度坐标系——BD-09：百度地图所使用的坐标体系，是在火星坐标系的基础上又进行了一次加密处理。
 * 因此在使用不同坐标系前，我们需要使用 AMap.convertFrom() 方法将这些非高德坐标系进行转换。
 *
 *  https://lbs.amap.com/api/jsapi-v2/documentation#convertfrom
 *
 *  以下类型推断用于标记经纬度信息，用于提醒函数的坐标系选择，是number的别名。
 */
// 百度坐标系
export type BaiduLng = number;
export type BaiduLat = number;

// 大地坐标系
export type WGS84Lng = number;
export type WGS84Lat = number;
export type WGS84 = WGS84Lng | WGS84Lat;

// 高德地图坐标系 (GCJ02)
export type AMapLng = number;
export type AMapLat = number;
export type GCJ02 = AMapLng | AMapLat;

/**
 * 定义了一个带有经纬度信息的GPS位置。
 */
export class LocationPoint {
  constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  latitude: number; // 纬度
  longitude: number; // 经度
}

/**
 * 包含地址的点信息
 */
export class LocationInfo extends LocationPoint {
  address: string;
  constructor(latitude: number, longitude: number, address: string) {
    super(latitude, longitude);
    this.address = address;
  }
}

/**
 * 地图的类型。
 */
export type MapType =
  | "street-map"
  | "satellite"
  | "traffic-info"
  | "street-map-info"
  | "satellite-info";

/**
 * 经纬度名字信息
 */
export class selectInfo {
  lat: number;
  lng: number;
  address: string;
  name: string;

  constructor(lat: number, lng: number, address: string, name: string) {
    this.lat = lat;
    this.lng = lng;
    this.address = address;
    this.name = name;
  }
}

/**
 * 信息表单。
 */
export class PicForm {
  lat: number; // 纬度
  lng: number; // 经度
  coorSysType: "WGS84" | "GCJ02" | "Baidu"; // 坐标系类型
  period: [Date, Date]; // 发生时期
  fireType: "forest" | "building" | "indoor" | "other"; // 火灾类型
  fireIntensity: "small" | "medium" | "large"; // 火势强度
  victim: number; // 受害人数
  province: string[]; // 省市区位置
  beaufort: number; //风力级别
  windDirection: string; //风向
  rainfall: number; // 降雨量
  temperature: number; // 温度
  humidity: number; // 湿度
  fireBrigade: number; // 消防队伍数量
  money: number; // 财产损失
  address: string // 精确位置

  constructor(
    lat: number,
    lng: number,
    coorSysType: "WGS84" | "GCJ02" | "Baidu",
    period: [Date, Date],
    fireType: "forest" | "building" | "indoor" | "other",
    fireIntensity: "small" | "medium" | "large",
    victim: number,
    province: string[],
    beaufort: number,
    windDirection: string,
    rainfall: number,
    temperature: number,
    humidity: number,
    fireBrigade: number,
    money: number,
    address: string
  ) {
    this.lat = lat;
    this.lng = lng;
    this.coorSysType = coorSysType;
    this.period = period;
    this.fireType = fireType;
    this.fireIntensity = fireIntensity;
    this.victim = victim;
    this.province = province;
    this.beaufort = beaufort;
    this.windDirection = windDirection;
    this.rainfall = rainfall;
    this.temperature = temperature;
    this.humidity = humidity;
    this.fireBrigade = fireBrigade;
    this.money = money;
    this.address = address;
  }
}

/**
 * 裁剪信息
 */
export class optionInfo {
  img: string; // 裁剪图片的地址
  info: boolean; // 裁剪框的大小信息
  outputSize: number; // 裁剪生成图片的质量(可选0.1 - 1)
  outputType: string; // 裁剪生成图片的格式(jpeg || png || webp)
  canScale: boolean; // 图片是否允许滚轮缩放
  autoCrop: boolean; // 是否默认生成截图框
  autoCropWidth: number; // 默认生成截图框宽度
  autoCropHeight: number; // 默认生成截图框高度
  fixedBox: boolean; // 固定截图框大小 不允许改变
  fixed: boolean; // 是否开启截图框宽高固定比例
  fixedNumber: number[]; // 截图框的宽高比例
  full: boolean; // 是否输出原图比例的截图，不失真
  canMove: boolean; //上传图片是否可以移动
  canMoveBox: boolean; // 截图框能否拖动
  original: boolean; // 上传图片按照原始比例渲染
  centerBox: boolean; // 截图框是否被限制在图片里面
  high: boolean; //是否按照设备的dpr 输出等比例图片
  infoTrue: boolean; // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
  maxImgSize: number; //限制图片最大宽度和高度
  enlarge: number; //图片根据截图框输出比例倍数
  mode: string; //图片默认渲染方式

  constructor(
    img: string,
    info: boolean,
    outputSize: number,
    outputType: string,
    canScale: boolean,
    autoCrop: boolean,
    autoCropWidth: number,
    autoCropHeight: number,
    fixedBox: boolean,
    fixed: boolean,
    fixedNumber: number[],
    full: boolean,
    canMove: boolean,
    canMoveBox: boolean,
    original: boolean,
    centerBox: boolean,
    high: boolean,
    infoTrue: boolean,
    maxImgSize: number,
    enlarge: number,
    mode: string
  ) {
    this.img = img;
    this.info = info;
    this.outputSize = outputSize;
    this.outputType = outputType;
    this.canScale = canScale;
    this.autoCrop = autoCrop;
    this.autoCropWidth = autoCropWidth;
    this.autoCropHeight = autoCropHeight;
    this.fixedBox = fixedBox;
    this.fixed = fixed;
    this.fixedNumber = fixedNumber;
    this.full = full;
    this.canMove = canMove;
    this.canMoveBox = canMoveBox;
    this.original = original;
    this.centerBox = centerBox;
    this.high = high;
    this.infoTrue = infoTrue;
    this.maxImgSize = maxImgSize;
    this.enlarge = enlarge;
    this.mode = mode;
  }
}

export class DetectBox {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  confidence: string;


  constructor(type: string, x1: number, y1: number, x2: number, y2: number, confidence: string) {
      this.type = type;
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.confidence = confidence;
  }
}

export class DetectResponse{
  statusMessage: string;
  detectBox: DetectBox[];
  detectImage: string;

  constructor(statusMessage: string, detectBox: DetectBox[], detectImage: string) {
      this.statusMessage = statusMessage;
      this.detectBox = detectBox;
      this.detectImage = detectImage;
  }
}