import { optionInfo } from "@/composables/baseTypes";
import { Ref, ref, reactive, onMounted } from "vue";
import { PicForm } from "@/composables/baseTypes";

export default function setupForm() {
    //配置信息
    const option: Ref<optionInfo> = ref({
      img: "", // 裁剪图片的地址
      info: true, // 裁剪框的大小信息
      outputSize: 0.8, // 裁剪生成图片的质量
      outputType: "jpeg", // 裁剪生成图片的格式
      canScale: true, // 图片是否允许滚轮缩放
      autoCrop: true, // 是否默认生成截图框
      autoCropWidth: 224, // 默认生成截图框宽度,未使用,默认可以按照其余属性适应
      autoCropHeight: 224, // 默认生成截图框高度,未使用,默认可以按照其余属性适应
      fixedBox: true, // 固定截图框大小,不允许改变
      fixed: true, // 是否开启截图框宽高固定比例
      fixedNumber: [1, 1], // 截图框的宽高比例
      full: false, // 是否输出原图比例的截图
      canMove: true, // 上传图片是否可以移动
      canMoveBox: true, // 截图框能否拖动
      original: true, // 上传图片按照原始比例渲染
      centerBox: true, // 截图框是否被限制在图片里面
      high: false, // 是否按照设备的dpr,输出等比例图片
      infoTrue: false, // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      maxImgSize: 3000, //限制图片最大宽度和高度
      enlarge: 0.8, //图片根据截图框输出比例倍数,不要太大不然会卡死
      mode: "100%", //图片默认渲染方式,在裁剪时展现的图片,contain为容器内大小,100%为原大小，
    });
    const picForm = reactive(new PicForm(22.535, 113.931, 'WGS84', [new Date(), new Date()], 'other', 'medium', 0, ['广东省', '深圳市', '南山区'], 4, 'north', 0, 23, 40, 1, 0));
  
    return {
      option,
      picForm
    }
  }
  
// 快捷选择日期
export const shortcuts = [
  {
    text: "一周间",
    value: () => {
      let today = new Date();
      let day = today.getDay() || 7; // Date.getDay()若为0 则返回7，否则返回星期几
      return [
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + 1 - day
        ),
        new Date(),
      ];
    },
  },
  {
    text: "一月间",
    value: () => {
      const end = new Date();
      const start = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      return [start, end];
    },
  },
  {
    text: "一年间",
    value: () => {
      const end = new Date();
      const start = new Date(new Date().getFullYear(), 0);
      return [start, end];
    },
  },
  {
    text: "昨天开始",
    value: () => {
      return [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24),
        new Date(),
      ];
    },
  },
  {
    text: "一周前开始",
    value: () => {
      return [
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7),
        new Date(),
      ];
    },
  },
  {
    text: "一月前开始",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return [start, end];
    },
  },
  {
    text: "三月前开始",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return [start, end];
    },
  },
];

// 城市json
export const cities = require("@/assets/province/province_area.json");