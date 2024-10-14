<template>
  <div class="box">
    <div class="title">
      <p>统计渠道数量</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <!-- ECharts component -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { LegendRich } from "./type";

const charts = ref<any>();


let echartData = [
  {
    value: 24,
    name: "课件",
    itemStyle: {
      normal: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#091f45" },
          { offset: 1, color: "#ef6f6f" },
        ]),
      },
    },
  },
  {
    value: 13,
    name: "教案/讲义 ",
    itemStyle: {
      normal: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#091f45" },
          { offset: 1, color: "#79f1d0" },
        ]),
      },
    },
  },

  {
    value: 16,
    name: "试卷",
    itemStyle: {
      normal: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#091f45" },
          { offset: 1, color: "#ee9655" },
        ]),
      },
    },
  },
  {
    value: 7.5,
    name: "学案/导学案",
    itemStyle: {
      normal: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#459fde" },
          { offset: 1, color: "#091f45" },
        ]),
      },
    },
  },
  {
    value: 15.5,
    name: "素材",
    itemStyle: {
      normal: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#a46cf1" },
          { offset: 1, color: "#091f45" },
        ]),
      },
    },
  },
  {
    value: 3,
    name: "视频",
    itemStyle: {
      normal: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#65d6ea" },
          { offset: 1, color: "#091f45" },
        ]),
      },
    },
  },
  {
    value: 14,
    name: "备课综合",
    itemStyle: {
      normal: {
        //颜色渐变
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: "#65d6ea" },
          { offset: 1, color: "#091f45" },


        ]),
      },
    },
  },
];

let colorArr = ['#0175c4', '#01a0c7', '#b99c0b', '#c16b27', '#FF3939']
// 图例的样式

let legendRich: LegendRich = {
  name: {
    fontSize: 12,
    color: "#fff",
  },
  value: {
    fontSize: 12,
    color: "#fff",
  },
  iscolor: {
    color: '#00f6ff'
  }
  /* percent: {
     fontSize: 12,
     color: "red",
     padding:[0,0,0,20]
  } */
};

for (let index = 0; index < colorArr.length; index++) {
  const color = colorArr[index];

  legendRich['percent' + index] = {
    fontSize: 12,
    color: color,
  }
}

onMounted(() => {
  const myCharts = echarts.init(charts.value);
  myCharts.setOption({
    legend: {
      // orient 设置布局方式，默认水平布局，可选值：'horizontal'（水平） | 'vertical'（垂直）
      orient: "vertical",
      // x 设置水平安放位置，默认全图居中，可选值：'center' | 'left' | 'right' | {number}（x坐标，单位px）
      x: "60%",
      // y 设置垂直安放位置，默认全图顶端，可选值：'top' | 'bottom' | 'center' | {number}（y坐标，单位px）
      y: "center",
      itemWidth: 24, // 设置图例图形的宽
      // itemHeight: 18, // 设置图例图形的高
      textStyle: {
        // color: "#fff", // 图例文字颜色
        rich: legendRich
      },
      // itemGap设置各个item之间的间隔，单位px，默认为10，横向布局时为水平间隔，纵向布局时为纵向间隔
      itemGap: 18,
      formatter: function (name: any) {
        let str = ''
        echartData.map((item) => {
          if (item.name === name) {
            str = `{iscolor|${name}}}`
          }
        })
        return str
      },
    },
    tooltip: {
      show: true,
      formatter: function (value: any) {
        let data = value.data
        return `${data.name} ${data.value}%`
      }
    },
    series: [
      {
        name: "告警类型",
        type: "pie",
        // startAngle: 0,
        labelLine: {
          show: false
        },
        label: {
          show: false
        },

        radius: ["30%", "50%"],
        center: ['30%', '50%'],
        hoverAnimation: false,
        color: [
          "#c487ee",
          "#deb140",
          "#49dff0",
          "#034079",
          "#6f81da",
          "#00ffb4",
        ],
        data: echartData,
      },
    ],
  })
});
</script>


<style lang='scss' scoped>
.box {
  width: 100%;
  height: 100%;
  margin: 20px 0;
  background: url(../../images/dataScreen-main-rc.png) no-repeat;
  background-size: 100% 100%;

  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    width: 100%;
    height: calc(100% - 20px);
  }
}
</style>