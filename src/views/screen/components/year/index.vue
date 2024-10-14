<template>
  <div class="box">
    <div class="title">
      <p>年度游客量对比</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <!-- ECharts component -->
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang='ts'>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

const charts = ref<any>();

onMounted(() => {
  const myCharts = echarts.init(charts.value);
  myCharts.setOption({
    title: {
      text: '年度游客量对比',
      left: 'center',
      top: '5%',
      textStyle: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowBlur: 10
      }
    },
    backgroundColor: 'transparent',  // 保持背景透明，显示背景图
    xAxis: {
      type: 'category',
      boundaryGap: false,  // 去掉刻度的空隙
      axisLine: {
        lineStyle: {
          color: '#4b7bec'  // x轴线颜色
        }
      },
      axisTick: {
        show: false  // 隐藏轴刻度
      },
      axisLabel: {
        color: '#ffffff',  // 标签字体颜色
        fontSize: 12
      },
      splitLine: {
        show: false  // 隐藏背景网格线
      }
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#4b7bec'  // y轴线颜色
        }
      },
      axisTick: {
        show: false  // 隐藏轴刻度
      },
      axisLabel: {
        color: '#ffffff',  // 标签字体颜色
        fontSize: 12
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.2)',  // 边线为半透明白色
          type: 'dashed'  // 虚线样式
        }
      }
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '20%',
      containLabel: true
    },
    series: [
      {
        type: 'scatter',
        data: [33, 21, 45, 12, 61, 14, 19, 68, 1, 6],
        
        itemStyle: {
          color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [
            {
              offset: 0,
              color: '#4b7bec'  // 渐变的内圈颜色
            },
            {
              offset: 1,
              color: '#a29bfe'  // 渐变的外圈颜色
            }
          ]),
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
          opacity: 0.8  // 设置散点透明度，增强背景效果
        },
        emphasis: {
          itemStyle: {
            color: '#f7b731',  // 鼠标悬停时散点颜色
            shadowBlur: 20,
            shadowColor: 'rgba(255, 183, 3, 0.8)'
          }
        }
      }
    ],
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `值: ${params.value}`,  // 自定义提示框内容
      backgroundColor: 'rgba(0, 0, 0, 0.7)',  // 提示框背景颜色
      borderColor: '#4b7bec',
      textStyle: {
        color: '#ffffff'
      }
    }
  });
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