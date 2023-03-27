const filterAttribute = [
  {
    label: "数值类型",
    options: [
      {
        value: "victim",
        label: "受害人数",
      },
      {
        value: "fireBrigade",
        label: "消防队伍数量",
      },
      {
        value: "money",
        label: "财产损失",
      },
      {
        value: "beaufort",
        label: "风速强度",
      },
      {
        value: "rainfall",
        label: "降雨量",
      },
      {
        value: "temperature",
        label: "温度",
      },
      {
        value: "humidity",
        label: "相对湿度",
      },
      {
        value: "lat",
        label: "经度",
      },
      {
        value: "lng",
        label: "纬度",
      },
    ],
  },
  {
    label: "字符串类型",
    options: [
      {
        value: "province",
        label: "省",
      },
      {
        value: "city",
        label: "市",
      },
      {
        value: "area",
        label: "区",
      },
    ],
  },
  {
    label: "单选类型",
    options: [
      {
        value: "fireType",
        label: "火灾类型",
      },
      {
        value: "fireIntensity",
        label: "火势强度",
      },
      {
        value: "windDirection",
        label: "风向",
      },
    ],
  },
];

// 符号选项
const signOption = [
  {
    value: ">",
    label: "大于",
  },
  {
    value: "==",
    label: "等于",
  },
  {
    value: "<",
    label: "小于",
  },
  {
    value: "<=",
    label: "小于等于",
  },
  {
    value: ">=",
    label: "大于等于",
  },
];

// 火灾类型选项
const fireTypeOption = [
  {
    value: "forest",
    label: "森林火灾",
  },
  {
    value: "building",
    label: "建筑物火灾",
  },
  {
    value: "indoor",
    label: "室内火灾",
  },
  {
    value: "other",
    label: "其他火灾",
  }
];

// 火势强度选项
const fireIntensityOption = [
  {
    value: "small",
    label: "小",
  },
  {
    value: "medium",
    label: "中",
  },
  {
    value: "large",
    label: "大",
  }
];
// 风向选项
const windDirectionOption = [
  {
    value: "north",
    label: "北风",
  },
  {
    value: "south",
    label: "南风",
  },
  {
    value: "west",
    label: "西风",
  },
  {
    value: "east",
    label: "东风",
  },
  {
    value: "northeast",
    label: "东北风",
  },
  {
    value: "southeast",
    label: "东南风",
  },
  {
    value: "southwest",
    label: "西南风",
  },
  {
    value: "northwest",
    label: "西北风",
  }
];

export function setupFilter() {
  // 属性选项
  return {filterAttribute, signOption, fireTypeOption, fireIntensityOption, windDirectionOption};
}