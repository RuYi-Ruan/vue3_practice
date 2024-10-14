<template>
  <div class="box1">
    <div class="title">
      <p>男女比例</p>
      <img src="../../images/dataScreen-title.png" alt="">
    </div>
    <div class="sex">
      <div class="man">
        <p>男士</p>
        <img src="../../images/man.png" alt="">
      </div>
      <div class="women">
        <p>女士</p>
        <img src="../../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p class="male">男士60%</p>
      <p class="female">女士40%</p>
    </div>
    <div class="charts" ref='charts'></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';

//获取图形图标的DOM节点
let charts = ref();
onMounted(() => {
  //初始化echarts实例
  let mycharts = echarts.init(charts.value);
  //设置配置项
  mycharts.setOption({
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: [
      {
        type: 'bar',
        data: [60],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: '#3498db', // 蓝色
          borderRadius: 15
        }
      },
      {
        type: 'bar',
        data: [100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: '#e74c3c', // 粉色
          borderRadius: 15
        }
      }
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 80
    }
  });
})
</script>

<style scoped lang="scss">
.box1 {
  width: 96.5%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 100% 100%;
  margin: 20px 0;
  margin-left: 20px;
  .title {
    margin-left: 20px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .sex {
    display: flex;
    justify-content: center;
    margin-left: 50px;
    overflow: hidden;
    height: 150px;
    .man,
    .women {
      margin: 20px;
      width: 111px;
      height: 115px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;

      p {
        color: white;
        font-size: 18px;
        position: absolute;
        top: -2px;
        /* 调整文字的位置 */
      }
    }

    .man {
      background: url(../../images/man-bg.png) no-repeat;

      img {
        width: 50px;
        /* 修改图片尺寸 */
      }
    }

    .women {
      background: url(../../images/woman-bg.png) no-repeat;
      img {
        width: 50px;
        /* 修改图片尺寸 */
      }
    }
  }

  .rate {
    display: flex;
    justify-content: space-between;
    color: white;
    margin: 10px 0;

    .male {
      margin-left: 150px;
      color: #3498db;
      /* 男士文字蓝色 */
      font-size: 18px;
    }

    .female {
      margin-right: 80px;
      color: #e74c3c;
      /* 女士文字粉色 */
      font-size: 18px;
    }
  }

  .charts {
    margin-left: 110px;
    height: 100px;
    width: 300px;
    /* 修改柱状图宽度 */
  }
}
</style>
