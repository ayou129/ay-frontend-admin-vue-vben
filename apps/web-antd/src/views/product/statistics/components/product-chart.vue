<script lang="ts" setup>
import type { EchartsUIType } from '@vben/plugins/echarts';

import { onMounted, ref, watch } from 'vue';

import { EchartsUI, useEcharts } from '@vben/plugins/echarts';

interface Props {
  chartData: string[];
}

const props = withDefaults(defineProps<Props>(), {
  chartData: () => [],
});

const chartRef = ref<EchartsUIType>();
const { renderEcharts } = useEcharts(chartRef);

function renderChart() {
  if (!props.chartData || props.chartData.length === 0) {
    return;
  }

  // 这里假设 chartData 是一个包含数值的数组
  // 实际使用时需要根据后端返回的数据格式进行调整
  const data = props.chartData.map((item, index) => ({
    name: `${index + 1}月`,
    value: typeof item === 'string' ? Number.parseFloat(item) : item,
  }));

  renderEcharts({
    grid: {
      bottom: '10%',
      containLabel: true,
      left: '3%',
      right: '4%',
      top: '4%',
    },
    legend: {
      data: ['商品数据'],
      top: '2%',
    },
    series: [
      {
        data: data.map((item) => item.value),
        name: '商品数据',
        smooth: true,
        type: 'line',
        itemStyle: {
          color: '#1890ff',
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(24, 144, 255, 0.3)',
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.1)',
              },
            ],
          },
        },
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#1890ff',
          width: 1,
        },
      },
      trigger: 'axis',
    },
    xAxis: {
      data: data.map((item) => item.name),
      type: 'category',
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#666',
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e8e8e8',
        },
      },
      axisLabel: {
        color: '#666',
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
        },
      },
    },
  });
}

onMounted(() => {
  renderChart();
});

watch(
  () => props.chartData,
  () => {
    renderChart();
  },
  { deep: true },
);
</script>

<template>
  <div class="h-80 w-full">
    <EchartsUI ref="chartRef" />
  </div>
</template>
