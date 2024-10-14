<template>
  <div ref="map">地图组件 </div>
</template>

<script setup lang='ts'>
import {onMounted, ref} from 'vue'
import * as echarts from 'echarts'
// 引入中国地图JSON文件
import ChinaMapJSON from './china.json'
// 地图组件实例
let map = ref<any>();
// 注册中国地图
echarts.registerMap('china', ChinaMapJSON as any)
onMounted(() => {
  let mychart = echarts.init(map.value);
  // 设置配置项
  mychart.setOption({
    // 地图组件
    geo: {
      map: 'china',
      roam: false, // 缩放
      zoom: 1.3,  // 当前视角缩放比例
      // 地图位置调试
      top: 160,
      left: 140,

      // 地图上的标签
      label: {
        show: true,
        color: 'white'
      },
      // 地图区域的样式
      itemStyle: {
        areaColor: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 1,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#1d2c62' // 深蓝色开始
            },
            {
              offset: 1,
              color: '#4c6ef5' // 渐变到较亮的蓝色
            }
          ],
          global: false // 缩放渐变
        },
        borderColor: '#00baff', // 边界线颜色，亮蓝色
        borderWidth: 1.5 // 边界宽度
      },
      // 地图高亮效果
      emphasis: {
        label: {
          fontSize: 20,
          color: 'red'
        }
      }
    },
    series: [
      {
        type: 'lines', // 航线系列
        data: [
          // 河南->重庆
          {
            coords: [
              [113.665412, 34.757975],
              [106.504962, 29.533155] 
            ],
          },
          // 河南到江苏
          {
            coords: [
              [113.665412, 34.757975],
              [120.767413,32.041544]
            ],
          },
          // 重庆到江苏
          {
            coords: [
              [106.504962, 29.533155],
              [120.767413, 32.041544]
            ]
          },
        ],
        // 线条样式
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0, color: '#fee6d1' // 从淡黄色
              },
              {
                offset: 1, color: '#f9d423' // 渐变到亮黄色
              }
            ],
            global: false
          },
          width: 2,
          opacity: 0.8,
          curveness: 0.1 // 轻微弯曲，让线条更柔和
        },
        // 线条特效
        effect: {
          show: true,
          symbol: 'arrow',
          period: 4, // 光点流动的速度，越小越快
          trailLength: 0.1, // 光点尾迹长度
          color: '#f9d423', // 光点的颜色，亮黄色
          symbolSize: 8 // 光点的大小
        }
      }
    ]
  })
})

</script>


<style lang='scss' scoped>

</style>