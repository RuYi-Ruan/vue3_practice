<template>
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="logo"></p>
      <p class="total">可预约总量<span>999999</span>人</p>
    </div>

    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
    </div>

    <!-- 将来echarts展示图标的盒子 -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
// 引入echarts模块
import * as echarts from 'echarts';
// 引入水球图组件
import 'echarts-liquidfill';

// 获取节点
let charts = ref();
// 挂载后获取echarts的实例
onMounted(() => {
  let myCharts = echarts.init(charts.value);
  // 设置实例的配置项
  myCharts.setOption({
    series: [{
      type: 'liquidFill',
      data: [0.5, 0.4, 0.3], // 水球图的不同层次
      color: ['red', '#0f0', 'rgb(0, 0, 255)'],
      itemStyle: {
        opacity: 0.6
      },
      emphasis: {
        itemStyle: {
          opacity: 0.9
        }
      },
      radius: '100%', // 设置为百分比，适应容器
      shape: 'circle', // 圆形水球
      label: {
        formatter: '预约量',
        fontSize: 28,
        color: 'white'
      },
      outline: {
        show: true,
        borderDistance: 5, // 边框和水球的距离
        itemStyle: {
          borderColor: "#29fcff",
          borderWidth: 2 // 边框宽度
        }
      },
      backgroundStyle: {
        color: 'rgba(255, 255, 255, 0)', // 背景透明
        shadowBlur: 10,
        shadowColor: '#29fcff'
      }
    }]
  });
});
let people = ref('216908人')
</script>

<style lang='scss' scoped>
.box {

  margin-left: 20px;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;

  .top {
    margin-top: 10px;
    margin-left: 20px;

    .title {
      color: white;
      font-size: 20px;
    }

    .logo {
      width: 68px;
      height: 7px;
      background: url(../../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 5px;
    }

    .total {
      float: right;
      color: white;
      font-size: 16px;
      margin-right: 5px;

      span {
        color: yellowgreen;
      }
    }
  }

  .number {
    margin-top: 40px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    display: flex;

    span {
      flex: 1;
      height: 48px;
      line-height: 40px;
      text-align: center;
      background: url(../../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #29fcff;
      margin: 0 1px;
      font-size: 30px;
    }
  }

  .charts {
    width: 100%;
    height: 270px;
    /* 确保图表容器有高度 */
  }
}
</style>
