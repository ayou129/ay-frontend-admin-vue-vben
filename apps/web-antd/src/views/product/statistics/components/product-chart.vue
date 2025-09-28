<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

const props = defineProps<{
  chartData?: string[];
}>();

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

// 模拟真实的商品数据趋势图表数据
const generateMockData = () => {
  const dates = [];
  const pageViews = []; // 商品浏览量 (紫色线)
  const visitors = []; // 商品访客量 (橙色线)
  const paymentAmount = []; // 支付金额 (蓝色柱)
  const refundAmount = []; // 退款金额 (绿色柱)

  // 生成30天的数据
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    dates.push(
      `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    );

    // 模拟数据，参考图片中的数据范围
    pageViews.push(Math.floor(Math.random() * 300) + 150); // 150-450范围
    visitors.push(Math.floor(Math.random() * 80) + 20); // 20-100范围
    paymentAmount.push(Math.floor(Math.random() * 180_000) + 20_000); // 2万-20万范围
    refundAmount.push(Math.floor(Math.random() * 80_000) + 10_000); // 1万-9万范围
  }

  return { dates, pageViews, visitors, paymentAmount, refundAmount };
};

const updateChart = () => {
  const { dates, pageViews, visitors, paymentAmount, refundAmount } =
    generateMockData();

  renderEcharts({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999',
        },
      },
    },
    legend: {
      data: ['商品浏览量', '商品访客量', '支付金额', '退款金额'],
      top: 10,
      right: 20,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        data: dates,
        axisPointer: {
          type: 'shadow',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#666',
          fontSize: 12,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: '金额',
        position: 'left',
        axisLabel: {
          formatter: '{value}',
          color: '#666',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0',
          },
        },
      },
      {
        type: 'value',
        name: '数量',
        position: 'right',
        axisLabel: {
          formatter: '{value}',
          color: '#666',
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: '支付金额',
        type: 'bar',
        yAxisIndex: 0,
        data: paymentAmount,
        itemStyle: {
          color: '#5470c6',
        },
        barWidth: '20%',
      },
      {
        name: '退款金额',
        type: 'bar',
        yAxisIndex: 0,
        data: refundAmount,
        itemStyle: {
          color: '#91cc75',
        },
        barWidth: '20%',
      },
      {
        name: '商品浏览量',
        type: 'line',
        yAxisIndex: 1,
        data: pageViews,
        smooth: true,
        lineStyle: {
          color: '#ee6666',
          width: 2,
        },
        itemStyle: {
          color: '#ee6666',
        },
        symbol: 'circle',
        symbolSize: 4,
      },
      {
        name: '商品访客量',
        type: 'line',
        yAxisIndex: 1,
        data: visitors,
        smooth: true,
        lineStyle: {
          color: '#fac858',
          width: 2,
        },
        itemStyle: {
          color: '#fac858',
        },
        symbol: 'circle',
        symbolSize: 4,
      },
    ],
  });
};

onMounted(() => {
  updateChart();
});

watch(
  () => props.chartData,
  () => {
    updateChart();
  },
);
</script>

<template>
  <div class="h-96">
    <EchartsUI ref="chartRef" />
  </div>
</template>
