<template>
  <div class="box">
    <div class="title">
      <p>未来30天游客量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>

    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'; // 引入 ECharts 库用于数据可视化
import { onMounted, ref } from 'vue'; // 从 Vue 中导入 `onMounted` 和 `ref`，用于生命周期和 DOM 引用操作

// 引用 DOM 元素
const charts = ref<any>(null); // 使用 `ref` 创建一个引用，用来存储 `charts` DOM 元素（绘制 ECharts 图表的容器）

// 在组件挂载完成后执行的逻辑
onMounted(() => {
  // 初始化 ECharts 实例，绑定到 `charts.value` 引用的 DOM 元素上
  const myChart = echarts.init(charts.value);

  // 设置更加波动的数据，表示未来30天的游客量
  const data = [15000, 7000, 8000, 19000, 4000, 21000, 10000, 18000, 5000, 17000, 3000, 15000, 21000, 13000, 6000]; // 模拟波动的游客量数据

  // 设置 ECharts 配置项，定义图表的外观和行为
  myChart.setOption({
    // X轴配置项，设置为类目类型，并定义数据（日期）
    xAxis: {
      type: 'category', // X 轴类型为类目型
      boundaryGap: false, // 不留空隙，曲线从坐标轴的起点开始
      data: ['05/05', '05/07', '05/09', '05/11', '05/13', '05/15', '05/17', '05/19', '05/21', '05/23', '05/25', '05/27', '05/29', '05/31', '06/02'] // X 轴的类目数据，表示日期
    },
    // Y轴配置项，设置为数值类型，定义最小和最大值范围
    yAxis: {
      type: 'value', // Y 轴类型为数值型
      min: 0, // Y 轴最小值为 0
      max: 25000, // Y 轴最大值为 25000，以容纳波动较大的游客量
      axisLabel: {
        formatter: '{value}' // Y 轴标签的显示格式
      }
    },
    // 调整图表网格的位置，使图表内容与容器的边界距离合适
    grid: {
      left: 50, // 图表左边距
      top: 20,  // 图表上边距
      right: 10, // 图表右边距
      bottom: 40 // 图表底部边距
    },
    // 设置图表的数据系列
    series: [
      {
        type: 'line', // 图表类型为折线图
        data, // 数据点，即游客量
        // 区域填充样式（实现曲线下方的渐变效果）
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(255, 191, 0, 0.8)' }, // 顶部颜色为半透明的橙色
            { offset: 1, color: 'rgba(255, 255, 255, 0)' }  // 底部渐变到透明
          ])
        },
        // 线条样式
        lineStyle: {
          color: '#ffbf00', // 折线的颜色为橙色
          width: 2 // 线条宽度
        },
        symbol: 'circle', // 数据点的形状为圆形
        symbolSize: 8, // 数据点的大小
        itemStyle: {
          color: '#ffbf00', // 数据点颜色为橙色
          borderColor: '#fff', // 数据点边框为白色
          borderWidth: 2 // 数据点边框宽度
        },
        smooth: true // 折线是否平滑过渡
      }
    ],
    // 提示框配置，鼠标悬停时显示详细数据
    tooltip: {
      trigger: 'axis', // 触发类型为轴触发，显示该轴上所有数据
      formatter: (params: any) => {
        const data = params[0].data; // 取得当前点的数据
        return `日期: ${params[0].axisValue} <br/> 游客量: ${data}`; // 返回格式化的提示框内容
      },
      axisPointer: {
        type: 'line', // 轴指示器类型为线型 
        lineStyle: {
          color: '#ffbf00' // 轴指示器的线条颜色为橙色
        }
      }
    }
  });
});
</script>

<style lang="scss" scoped>
.box {
  width: 96.5%;
  height: 200px;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 0 40px;

  .title {
    margin-left: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    height: calc(100% - 40px);
  }
}
</style>
