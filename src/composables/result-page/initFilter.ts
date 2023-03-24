export default function setupFilter() {
  // 属性选项
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
      ],
    },
    {
      label: "字符串类型",
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
        {
          value: "lat",
          label: "经度",
        },
        {
          value: "lng",
          label: "纬度",
        },
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
  ];

  // 符号选项
  const signOption = [
    {
      value: ">",
      label: "大于",
    },
    {
      value: "=",
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
  return {filterAttribute, signOption};
}
