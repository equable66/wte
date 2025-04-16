<template>
  <div ref="mapContainer" class="map-container"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import * as echarts from 'echarts';
import { nextTick } from 'vue';

const props = defineProps({
  selectedProvince: {
    type: String,
    default: ''
  },
  provinces: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['province-selected', 'province-hover', 'province-leave', 'ethnic-selected', 'ethnic-hover', 'ethnic-leave']);

const mapContainer = ref(null);
let mapChart = null;
let resizeObserver = null;

const provincesData = [
  { name: '黑龙江', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '吉林', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '辽宁', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '河北', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '山西', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '山东', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '江苏', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '浙江', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '安徽', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '福建', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '江西', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '河南', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '湖北', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '湖南', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '广东', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '广西', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '海南', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '四川', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '贵州', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '云南', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '西藏', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '陕西', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '甘肃', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '青海', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '宁夏', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '新疆', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '北京', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '天津', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '上海', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '重庆', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '内蒙古', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '香港', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '澳门', value: 0, itemStyle: { areaColor: '#e8e8e8' } },
  { name: '台湾', value: 0, itemStyle: { areaColor: '#e8e8e8' } }
];

// 少数民族聚居地标记点数据
const ethnicMarkersData = [
  { name: '维吾尔族', value: [87, 42], coord: [87, 42], symbolSize: 8 },
  { name: '哈萨克族', value: [82, 46], coord: [82, 46], symbolSize: 8 },
  { name: '柯尔克孜族', value: [79, 39], coord: [79, 39], symbolSize: 8 },
  { name: '蒙古族', value: [110, 42], coord: [110, 42], symbolSize: 8 },
  { name: '藏族', value: [89, 30], coord: [89, 30], symbolSize: 8 },
  { name: '壮族', value: [109, 24], coord: [109, 24], symbolSize: 8 },
  { name: '苗族', value: [107, 27], coord: [107, 27], symbolSize: 8 },
  { name: '彝族', value: [102, 25], coord: [102, 25], symbolSize: 8 },
  { name: '土家族', value: [110, 30], coord: [110, 30], symbolSize: 8 },
  { name: '回族', value: [106, 36], coord: [106, 36], symbolSize: 8 },
  { name: '傣族', value: [100, 22], coord: [100, 22], symbolSize: 8 },
  { name: '白族', value: [100, 26], coord: [100, 26], symbolSize: 8 },
  { name: '侗族', value: [109, 27], coord: [109, 27], symbolSize: 8 },
  { name: '瑶族', value: [111, 25], coord: [111, 25], symbolSize: 8 },
  { name: '朝鲜族', value: [128, 43], coord: [128, 43], symbolSize: 8 },
  { name: '满族', value: [124, 41], coord: [124, 41], symbolSize: 8 },
  { name: '畲族', value: [119, 27], coord: [119, 27], symbolSize: 8 },
  { name: '黎族', value: [110, 19], coord: [110, 19], symbolSize: 8 },
  { name: '羌族', value: [103, 32], coord: [103, 32], symbolSize: 8 },
  { name: '撒拉族', value: [102, 36], coord: [102, 36], symbolSize: 8 },
  { name: '东乡族', value: [103, 35], coord: [103, 35], symbolSize: 8 },
  { name: '保安族', value: [102, 37], coord: [102, 37], symbolSize: 8 },
  { name: '裕固族', value: [97, 38], coord: [97, 38], symbolSize: 8 },
  { name: '纳西族', value: [100, 27], coord: [100, 27], symbolSize: 8 },
  { name: '哈尼族', value: [102, 23], coord: [102, 23], symbolSize: 8 },
  { name: '傈僳族', value: [99, 25], coord: [99, 25], symbolSize: 8 },
  { name: '拉祜族', value: [100, 23], coord: [100, 23], symbolSize: 8 },
  { name: '佤族', value: [99, 24], coord: [99, 24], symbolSize: 8 },
  { name: '土族', value: [102, 37], coord: [102, 37], symbolSize: 8 },
  { name: '高山族', value: [121, 24], coord: [121, 24], symbolSize: 8 },
  { name: '锡伯族', value: [123, 42], coord: [123, 42], symbolSize: 8 },
  { name: '达斡尔族', value: [124, 49], coord: [124, 49], symbolSize: 8 },
  { name: '鄂温克族', value: [120, 50], coord: [120, 50], symbolSize: 8 },
  { name: '鄂伦春族', value: [126, 51], coord: [126, 51], symbolSize: 8 },
  { name: '赫哲族', value: [133, 48], coord: [133, 48], symbolSize: 8 },
  { name: '门巴族', value: [92, 29], coord: [92, 29], symbolSize: 8 },
  { name: '珞巴族', value: [94, 29], coord: [94, 29], symbolSize: 8 }
];

// 初始化地图
const initChart = async () => {
  if (!mapChart && mapContainer.value) {
    // 加载中国地图数据
    // 注意：在实际使用中，您需要确保已经注册了中国地图数据
    await nextTick();
    mapChart = echarts.init(mapContainer.value);
    
    // 注册中国地图
    const chinaMapData = await fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then(response => response.json());
    echarts.registerMap('China', chinaMapData);
    
    updateChart();
    
    // 监听地图点击事件
    mapChart.on('click', params => {
      if (params.componentType === 'series') {
        if (params.seriesType === 'map') {
          emit('province-selected', params.name);
        } else if (params.seriesType === 'effectScatter') {
          // 点击民族标记点
          emit('ethnic-selected', params.data.name);
        }
      }
    });
    
    // 监听地图hover事件
    mapChart.on('mouseover', params => {
      if (params.componentType === 'series') {
        if (params.seriesType === 'map') {
          emit('province-hover', params.name);
        } else if (params.seriesType === 'effectScatter') {
          emit('ethnic-hover', params.data.name);
        }
      }
    });
    
    mapChart.on('mouseout', params => {
      if (params.componentType === 'series') {
        if (params.seriesType === 'map') {
          emit('province-leave', params.name);
        } else if (params.seriesType === 'effectScatter') {
          emit('ethnic-leave', params.data.name);
        }
      }
    });
    
    // 添加窗口大小变化的监听
    resizeObserver = new ResizeObserver(() => {
      mapChart && mapChart.resize();
    });
    resizeObserver.observe(mapContainer.value);
  }
};

// 更新地图数据
const updateChart = () => {
  if (!mapChart) return;
  
  // 更新省份数据（如果有选中的省份）
  const updatedProvincesData = [...provincesData];
  
  if (props.selectedProvince) {
    // 查找选中的省份并更新颜色
    const selectedIdx = updatedProvincesData.findIndex(p => 
      p.name === props.selectedProvince || 
      props.selectedProvince.includes(p.name));
    
    if (selectedIdx !== -1) {
      updatedProvincesData[selectedIdx] = {
        ...updatedProvincesData[selectedIdx],
        itemStyle: {
          areaColor: '#b8daff',
          borderColor: '#007bff'
        }
      };
    }
  }
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: params => {
        if (params.seriesType === 'map') {
          return params.name;
        } else if (params.seriesType === 'effectScatter') {
          return params.data.name;
        }
        return '';
      }
    },
    geo: {
      map: 'China',
      roam: false,
      selectedMode: false,
      zoom: 1.2,
      itemStyle: {
        areaColor: '#e8e8e8',
        borderColor: '#fff',
        borderWidth: 1.5
      },
      emphasis: {
        itemStyle: {
          areaColor: '#d9edf7'
        },
        label: {
          show: true,
          color: '#333'
        }
      }
    },
    series: [
      {
        name: '中国地图',
        type: 'map',
        map: 'China',
        roam: false,
        selectedMode: false,
        zoom: 1.2,
        data: updatedProvincesData,
        itemStyle: {
          areaColor: '#e8e8e8',
          borderColor: '#fff',
          borderWidth: 1.5
        },
        emphasis: {
          itemStyle: {
            areaColor: '#d9edf7'
          },
          label: {
            show: true,
            color: '#333'
          }
        },
        select: {
          itemStyle: {
            areaColor: '#b8daff',
            borderColor: '#007bff',
            borderWidth: 2
          }
        },
        label: {
          show: true,
          fontSize: 10,
          color: '#333'
        }
      },
      {
        name: '少数民族',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        data: ethnicMarkersData,
        symbolSize: 8,
        itemStyle: {
          color: '#e74c3c',
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.3)'
        },
        showEffectOn: 'emphasis',
        rippleEffect: {
          brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
          show: false,
          position: 'right',
          formatter: '{b}'
        },
        emphasis: {
          scale: true,
          label: {
            show: true,
            fontSize: 10,
            color: '#333',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            padding: [2, 4],
            borderRadius: 2
          }
        },
        zlevel: 1
      }
    ]
  };
  
  mapChart.setOption(option);
};

// 观察选中省份的变化
watch(() => props.selectedProvince, () => {
  updateChart();
});

// 在组件挂载后初始化地图
onMounted(() => {
  initChart();
});

// 组件销毁前清理资源
onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (mapChart) {
    mapChart.dispose();
    mapChart = null;
  }
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 600px;
  background-color: #f9f9f9;
}
</style> 