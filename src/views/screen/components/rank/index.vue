<template>
    <div class="box">
        <div class="title">
            <p>热门景区排行</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <!-- ECharts component -->
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, ref } from "vue";

// 创建一个引用来绑定 ECharts 容器
const charts = ref<any>();

// 在组件挂载时初始化 ECharts 图表
onMounted(() => {
    // 使用绑定的 DOM 节点初始化图表
    const myCharts = echarts.init(charts.value);

    // 设置图表配置选项
    myCharts.setOption({
        // 提示框配置
        tooltip: {
            trigger: "axis", // 触发方式为坐标轴触发
            axisPointer: {
                type: "shadow", // 轴指示器类型为阴影
            },
        },
        // 网格配置，设置图表内边距
        grid: {
            left: "5",
            right: "5%",
            top: "10%",
            bottom: "10",
            containLabel: true, // 防止标签溢出
        },
        // X轴配置（隐藏）
        xAxis: {
            type: "value", // 数值型
            show: false,   // 不显示 X 轴
        },
        // Y轴配置
        yAxis: {
            type: "category", // 类目型
            data: ["峨眉山", "稻城亚丁", "九寨沟", "万里长城", "北京故宫"], // Y轴数据
            axisLine: {
                show: false, // 隐藏 Y 轴线
            },
            axisTick: {
                show: false, // 隐藏刻度
            },
            axisLabel: {
                textStyle: {
                    color: "pink", // 标签颜色为白色
                },
            },
        },
        // 数据系列配置
        series: [
            {
                name: "预约数量", // 数据系列名称
                type: "bar",      // 图表类型为柱状图
                data: [30000, 50000, 50000, 20000, 70000], // 数据
                barWidth: "40%",  // 柱状图宽度
                // 显示数据标签
                label: {
                    show: true,
                    position: "right", // 标签显示在柱子右侧
                    // 格式化标签，显示以 'w' 为单位的预约数量
                    formatter: (params: any) => {
                        const values = [3, 5, 5, 2, 7];
                        return `${values[params.dataIndex]}w`;
                    },
                    color: "#fff", // 标签颜色为白色
                },
                // 柱状图样式
                itemStyle: {
                    // 设置不同柱子的颜色
                    color: (params: any) => {
                        const colors = ["#4c9bfd", "#ffcc00", "#ff5733", "#28a745", "#337ab7"];
                        return colors[params.dataIndex];
                    },
                    borderRadius: 10, // 圆角柱状图
                },
            },
        ],
    });
});
</script>

<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    margin: 20px 0;
    background: url(../../images/dataScreen-main-rt.png) no-repeat;
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
