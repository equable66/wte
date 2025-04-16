<template>
  <div class="ethnic-map-container">
    <div class="page-header">
      <h1>中国少数民族分布地图</h1>
      <p class="subtitle">56个民族，多彩文化遗产</p>
    </div>
    
    <div class="map-wrapper">
      <div class="china-map">
        <EchartsMap 
          :selected-province="selectedProvince"
          :provinces="provinces"
          @province-selected="handleProvinceSelected"
          @province-hover="handleProvinceHover"
          @province-leave="handleProvinceLeave"
          @ethnic-selected="handleEthnicSelected"
          @ethnic-hover="handleEthnicHover"
          @ethnic-leave="handleEthnicLeave"
        />
        
        <!-- 地图图例 -->
        <div class="map-legend">
          <div class="legend-item">
            <div class="legend-marker"></div>
            <span>少数民族聚居地</span>
          </div>
          <div class="legend-item">
            <div class="legend-province"></div>
            <span>省级行政区</span>
          </div>
        </div>
      </div>
      
      <div class="map-info">
        <div class="info-panel" v-if="selectedEthnic">
          <h3>{{ selectedEthnic.name }}</h3>
          <p>{{ selectedEthnic.population }}</p>
          <p>{{ selectedEthnic.distribution }}</p>
          <p>{{ selectedEthnic.features }}</p>
          
          <div class="ethnic-links">
            <router-link :to="selectedEthnic.clothesLink" class="ethnic-link">
              传统服饰
            </router-link>
            <router-link :to="selectedEthnic.customsLink" class="ethnic-link">
              风俗习惯
            </router-link>
            <router-link :to="selectedEthnic.festivalsLink" class="ethnic-link">
              传统节日
            </router-link>
          </div>
        </div>
        
        <div class="info-default" v-else>
          <h3>中国少数民族</h3>
          <p>中国有56个民族，其中汉族和55个少数民族。少数民族主要分布在中国西南、西北、东北等地区。</p>
          <p>点击地图上的各个红色标记点，可直接查看该少数民族的详细信息。也可点击省份了解该地区民族分布。</p>
          
          <div class="ethnic-stats">
            <div class="stat-item">
              <div class="stat-number">55</div>
              <div class="stat-label">少数民族</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">8.5%</div>
              <div class="stat-label">人口占比</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">60%</div>
              <div class="stat-label">国土面积</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="ethnic-categories">
      <div class="category-header">
        <h2 class="category-title">民族文化资源</h2>
      <p class="category-subtitle">点击卡片可查看各省少数民族分布情况</p>
      </div>
      <div class="category-list">
        <div class="province-card" v-for="(province, index) in provinces" :key="index" @click="toggleProvinceCard(province, index)">
          <div class="card-inner" :class="{ 'is-flipped': province.isFlipped }">
            <div class="card-front">
              <div class="category-icon">{{ province.icon }}</div>
              <div class="category-name">{{ province.name }}</div>
            </div>
            <div class="card-back">
              <div class="ethnic-list">
                <span v-for="(ethnic, eIndex) in province.ethnics" :key="eIndex" class="ethnic-tag">
                  {{ ethnic }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import EchartsMap from '../components/EchartsMap.vue';

// 选中的民族数据
const selectedEthnic = ref(null);
// 选中的省份
const selectedProvince = ref(null);

// 省份及其少数民族数据
const provinces = reactive([
  {
    name: '云南省',
    icon: '🏞️',
    isFlipped: false,
    ethnics: ['彝族', '白族', '哈尼族', '傣族', '壮族', '苗族', '傈僳族', '拉祜族', '佤族', '纳西族', '瑶族', '藏族', '景颇族', '布朗族', '布依族', '阿昌族', '普米族', '怒族', '德昂族', '独龙族', '基诺族', '回族', '水族', '满族', '侗族']
  },
  {
    name: '新疆维吾尔自治区',
    icon: '🏜️',
    isFlipped: false,
    ethnics: ['维吾尔族', '哈萨克族', '回族', '柯尔克孜族', '蒙古族', '塔吉克族', '锡伯族', '满族', '乌孜别克族', '俄罗斯族', '达斡尔族', '塔塔尔族']
  },
  {
    name: '广西壮族自治区',
    icon: '🌄',
    isFlipped: false,
    ethnics: ['壮族', '瑶族', '苗族', '侗族', '仫佬族', '毛南族', '回族', '京族', '彝族', '水族', '仡佬族']
  },
  {
    name: '贵州省',
    icon: '⛰️',
    isFlipped: false,
    ethnics: ['苗族', '布依族', '侗族', '土家族', '彝族', '仡佬族', '水族', '回族', '瑶族', '白族']
  },
  {
    name: '四川省',
    icon: '🐼',
    isFlipped: false,
    ethnics: ['彝族', '藏族', '羌族', '苗族', '回族', '土家族']
  },
  {
    name: '内蒙古自治区',
    icon: '🏇',
    isFlipped: false,
    ethnics: ['蒙古族', '回族', '满族', '达斡尔族', '鄂温克族', '鄂伦春族']
  },
  {
    name: '西藏自治区',
    icon: '🏔️',
    isFlipped: false,
    ethnics: ['藏族', '门巴族', '珞巴族', '回族', '纳西族']
  },
  {
    name: '湖南省',
    icon: '🌾',
    isFlipped: false,
    ethnics: ['土家族', '苗族', '侗族', '瑶族', '回族', '白族']
  },
  {
    name: '吉林省',
    icon: '🌲',
    isFlipped: false,
    ethnics: ['朝鲜族', '满族', '蒙古族', '回族']
  },
  {
    name: '黑龙江省',
    icon: '❄️',
    isFlipped: false,
    ethnics: ['满族', '朝鲜族', '蒙古族', '回族', '达斡尔族', '鄂伦春族', '赫哲族', '锡伯族', '鄂温克族']
  },
  {
    name: '青海省',
    icon: '💧',
    isFlipped: false,
    ethnics: ['藏族', '回族', '土族', '撒拉族', '蒙古族']
  },
  {
    name: '甘肃省',
    icon: '🌵',
    isFlipped: false,
    ethnics: ['回族', '藏族', '东乡族', '保安族', '裕固族', '蒙古族', '撒拉族']
  },
  {
    name: '上海市',
    icon: '🏙️',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族', '土家族', '苗族']
  },
  {
    name: '江苏省',
    icon: '🏮',
    isFlipped: false,
    ethnics: ['回族', '苗族', '彝族', '壮族', '满族']
  },
  {
    name: '浙江省',
    icon: '🌊',
    isFlipped: false,
    ethnics: ['畲族', '回族', '苗族', '土家族']
  },
  {
    name: '安徽省',
    icon: '🏯',
    isFlipped: false,
    ethnics: ['回族', '满族', '苗族']
  },
  {
    name: '福建省',
    icon: '🏝️',
    isFlipped: false,
    ethnics: ['畲族', '回族', '高山族']
  },
  {
    name: '江西省',
    icon: '🗻',
    isFlipped: false,
    ethnics: ['畲族', '回族', '苗族', '瑶族']
  },
  {
    name: '山东省',
    icon: '🌅',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族']
  },
  {
    name: '北京市',
    icon: '🏛️',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族', '朝鲜族']
  },
  {
    name: '天津市',
    icon: '🌉',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族']
  },
  {
    name: '河北省',
    icon: '🏞️',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族']
  },
  {
    name: '山西省',
    icon: '⛰️',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族']
  },
  {
    name: '河南省',
    icon: '🌾',
    isFlipped: false,
    ethnics: ['回族', '蒙古族', '满族']
  },
  {
    name: '湖北省',
    icon: '🏞️',
    isFlipped: false,
    ethnics: ['土家族', '苗族', '侗族', '回族']
  },
  {
    name: '广东省',
    icon: '🌴',
    isFlipped: false,
    ethnics: ['壮族', '瑶族', '畲族', '回族']
  },
  {
    name: '海南省',
    icon: '🌺',
    isFlipped: false,
    ethnics: ['黎族', '苗族', '回族']
  },
  {
    name: '重庆市',
    icon: '🌁',
    isFlipped: false,
    ethnics: ['土家族', '苗族']
  },
  {
    name: '辽宁省',
    icon: '🏭',
    isFlipped: false,
    ethnics: ['满族', '蒙古族', '回族', '朝鲜族', '锡伯族']
  },
  {
    name: '陕西省',
    icon: '🏯',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族']
  },
  {
    name: '宁夏回族自治区',
    icon: '🕌',
    isFlipped: false,
    ethnics: ['回族', '满族', '蒙古族']
  }
]);

// 民族数据库
const ethnicData = {
  '维吾尔族': {
    name: '维吾尔族',
    population: '约1100万人',
    distribution: '主要分布在新疆维吾尔自治区',
    features: '维吾尔族有着悠久的历史和灿烂的文化，音乐、舞蹈、建筑和手工艺在中国少数民族中独具特色。',
    clothesLink: '/clothes?ethnic=weiwuer',
    customsLink: '/customs?ethnic=weiwuer',
    festivalsLink: '/festivals?ethnic=weiwuer'
  },
  '藏族': {
    name: '藏族',
    population: '约600万人',
    distribution: '主要分布在西藏自治区、青海、甘肃、四川和云南等地',
    features: '藏族是中国分布地域最广的少数民族之一，有着悠久的历史和独特的文化传统。',
    clothesLink: '/clothes?ethnic=zang',
    customsLink: '/customs?ethnic=zang',
    festivalsLink: '/festivals?ethnic=zang'
  },
  '壮族': {
    name: '壮族',
    population: '约1600万人',
    distribution: '主要分布在广西壮族自治区及云南、广东、贵州等省的部分地区',
    features: '壮族是中国人口最多的少数民族，有着丰富的民间文学、音乐和舞蹈艺术。',
    clothesLink: '/clothes?ethnic=zhuang',
    customsLink: '/customs?ethnic=zhuang',
    festivalsLink: '/festivals?ethnic=zhuang'
  },
  '满族': {
    name: '满族',
    population: '约1000万人',
    distribution: '主要分布在辽宁(岫岩、新宾、清原满族自治县)、吉林、黑龙江三省及河北(青龙满族自治县)、内蒙古等地',
    features: '满族是我国东北地区的主要少数民族，建立了中国历史上最后一个封建王朝—清朝。',
    clothesLink: '/clothes?ethnic=man',
    customsLink: '/customs?ethnic=man',
    festivalsLink: '/festivals?ethnic=man'
  },
  '蒙古族': {
    name: '蒙古族',
    population: '约600万人',
    distribution: '主要分布在内蒙古自治区及辽宁(阜新蒙古族自治县、喀左蒙古族自治县)、吉林、黑龙江、河北等省',
    features: '蒙古族是一个历史悠久的游牧民族，在13世纪建立了疆域广阔的蒙古帝国。',
    clothesLink: '/clothes?ethnic=menggu',
    customsLink: '/customs?ethnic=menggu',
    festivalsLink: '/festivals?ethnic=menggu'
  },
  '苗族': {
    name: '苗族',
    population: '约940万人',
    distribution: '主要分布在贵州(黔东南苗族侗族自治州)、湖南(湘西土家族苗族自治州)、云南、广西、重庆、湖北等地',
    features: '苗族是中国历史悠久的少数民族，以其精美的银饰、刺绣和节日盛会而闻名。',
    clothesLink: '/clothes?ethnic=miao',
    customsLink: '/customs?ethnic=miao',
    festivalsLink: '/festivals?ethnic=miao'
  },
  '彝族': {
    name: '彝族',
    population: '约880万人',
    distribution: '主要分布在云南(楚雄彝族自治州)、四川(凉山彝族自治州)、贵州、广西等省区',
    features: '彝族是中国西南地区的一个重要民族，拥有独特的彝文和丰富的民族文化。',
    clothesLink: '/clothes?ethnic=yi',
    customsLink: '/customs?ethnic=yi',
    festivalsLink: '/festivals?ethnic=yi'
  },
  '傣族': {
    name: '傣族',
    population: '约120万人',
    distribution: '主要分布在云南省西双版纳傣族自治州、德宏和临沧等地区',
    features: '傣族有着浓厚的佛教文化，善于歌舞，每年的泼水节是最著名的民族节日。',
    clothesLink: '/clothes?ethnic=dai',
    customsLink: '/customs?ethnic=dai',
    festivalsLink: '/festivals?ethnic=dai'
  },
  '瑶族': {
    name: '瑶族',
    population: '约270万人',
    distribution: '主要分布在广西、湖南、云南、广东(连南瑶族自治县、连山壮族瑶族自治县)、贵州等省区',
    features: '瑶族有着丰富的服饰文化和独特的民族节日，"盘王节"是最重要的传统节日。',
    clothesLink: '/clothes?ethnic=yao',
    customsLink: '/customs?ethnic=yao',
    festivalsLink: '/festivals?ethnic=yao'
  },
  '羌族': {
    name: '羌族',
    population: '约31万人',
    distribution: '主要分布在四川省阿坝藏族羌族自治州和绵阳市北川羌族自治县等地',
    features: '羌族是中国最古老的民族之一，有着独特的建筑风格、服饰和宗教信仰。',
    clothesLink: '/clothes?ethnic=qiang',
    customsLink: '/customs?ethnic=qiang',
    festivalsLink: '/festivals?ethnic=qiang'
  },
  '畲族': {
    name: '畲族',
    population: '约70万人',
    distribution: '主要分布在福建、浙江(景宁畲族自治县)、江西、广东等省',
    features: '畲族是分布在东南沿海地区的少数民族，拥有丰富的民族文化和传统习俗。',
    clothesLink: '/clothes?ethnic=she',
    customsLink: '/customs?ethnic=she',
    festivalsLink: '/festivals?ethnic=she'
  },
  '回族': {
    name: '回族',
    population: '约1000万人',
    distribution: '主要分布在宁夏回族自治区及全国各地，河北(大厂回族自治县、孟村回族自治县)、青海(化隆回族自治县)等地有自治县',
    features: '回族是中国分布最广的少数民族之一，信奉伊斯兰教，有着丰富的饮食文化和宗教习俗。',
    clothesLink: '/clothes?ethnic=hui',
    customsLink: '/customs?ethnic=hui',
    festivalsLink: '/festivals?ethnic=hui'
  },
  '土家族': {
    name: '土家族',
    population: '约830万人',
    distribution: '主要分布在湖北、湖南、重庆(石柱、彭水、酉阳、秀山土家族苗族自治县)等地',
    features: '土家族是中国人口较多的少数民族之一，拥有独特的语言、服饰和建筑风格。',
    clothesLink: '/clothes?ethnic=tujia',
    customsLink: '/customs?ethnic=tujia',
    festivalsLink: '/festivals?ethnic=tujia'
  },
  '侗族': {
    name: '侗族',
    population: '约300万人',
    distribution: '主要分布在贵州、湖南(通道侗族自治县)、广西等地',
    features: '侗族以侗族大歌、鼓楼建筑和风雨桥等文化遗产而闻名。',
    clothesLink: '/clothes?ethnic=dong',
    customsLink: '/customs?ethnic=dong',
    festivalsLink: '/festivals?ethnic=dong'
  },
  '朝鲜族': {
    name: '朝鲜族',
    population: '约180万人',
    distribution: '主要分布在吉林(延边朝鲜族自治州)、黑龙江、辽宁等东北三省',
    features: '朝鲜族以其丰富的民族文化、传统节日和民族教育而著称。',
    clothesLink: '/clothes?ethnic=chaoxian',
    customsLink: '/customs?ethnic=chaoxian',
    festivalsLink: '/festivals?ethnic=chaoxian'
  },
  '黎族': {
    name: '黎族',
    population: '约130万人',
    distribution: '主要分布在海南省(多个黎族自治县)',
    features: '黎族是海南岛的原住民族，以纺染织绣、独特的船形屋和黎锦等传统技艺闻名。',
    clothesLink: '/clothes?ethnic=li',
    customsLink: '/customs?ethnic=li',
    festivalsLink: '/festivals?ethnic=li'
  },
  // 添加其他民族数据
  '哈萨克族': {
    name: '哈萨克族',
    population: '约150万人',
    distribution: '主要分布在新疆北部的伊犁、塔城、阿勒泰等地区',
    features: '哈萨克族是游牧民族，有着丰富的草原文化，擅长骑马、射箭和弹唱冬不拉。',
    clothesLink: '/clothes?ethnic=hasake',
    customsLink: '/customs?ethnic=hasake',
    festivalsLink: '/festivals?ethnic=hasake'
  },
  '柯尔克孜族': {
    name: '柯尔克孜族',
    population: '约18万人',
    distribution: '主要分布在新疆西南部的克孜勒苏柯尔克孜自治州',
    features: '柯尔克孜族有着悠久的历史和丰富的文化传统，民间文学《玛纳斯》被誉为"东方史诗"。',
    clothesLink: '/clothes?ethnic=keerkezi',
    customsLink: '/customs?ethnic=keerkezi',
    festivalsLink: '/festivals?ethnic=keerkezi'
  },
  '白族': {
    name: '白族',
    population: '约200万人',
    distribution: '主要分布在云南大理白族自治州、丽江、楚雄等地',
    features: '白族是中国西南地区的重要民族，以彩绘建筑、三道茶、白族歌舞等文化特色闻名。',
    clothesLink: '/clothes?ethnic=bai',
    customsLink: '/customs?ethnic=bai',
    festivalsLink: '/festivals?ethnic=bai'
  },
  '哈尼族': {
    name: '哈尼族',
    population: '约170万人',
    distribution: '主要分布在云南省红河哈尼族彝族自治州',
    features: '哈尼族以其梯田农耕文明闻名于世，红河哈尼梯田被列入世界文化遗产名录。',
    clothesLink: '/clothes?ethnic=hani',
    customsLink: '/customs?ethnic=hani',
    festivalsLink: '/festivals?ethnic=hani'
  },
  '傈僳族': {
    name: '傈僳族',
    population: '约70万人',
    distribution: '主要分布在云南省怒江傈僳族自治州、迪庆、丽江等地',
    features: '傈僳族有着独特的服饰和民族乐器，刀杆节是其重要的传统节日。',
    clothesLink: '/clothes?ethnic=lisu',
    customsLink: '/customs?ethnic=lisu',
    festivalsLink: '/festivals?ethnic=lisu'
  },
  '拉祜族': {
    name: '拉祜族',
    population: '约48万人',
    distribution: '主要分布在云南省西双版纳、临沧和普洱等地',
    features: '拉祜族有着丰富的音乐传统，被称为"歌的海洋"，葫芦笙是其代表性乐器。',
    clothesLink: '/clothes?ethnic=lahu',
    customsLink: '/customs?ethnic=lahu',
    festivalsLink: '/festivals?ethnic=lahu'
  },
  '佤族': {
    name: '佤族',
    population: '约43万人',
    distribution: '主要分布在云南省西部的沧源佤族自治县等地',
    features: '佤族有着独特的木鼓文化和传统服饰，木鼓节是其重要的传统节日。',
    clothesLink: '/clothes?ethnic=wa',
    customsLink: '/customs?ethnic=wa',
    festivalsLink: '/festivals?ethnic=wa'
  },
  '纳西族': {
    name: '纳西族',
    population: '约33万人',
    distribution: '主要分布在云南省丽江地区',
    features: '纳西族有着独特的东巴文化和东巴教，东巴文字是世界上仅存的象形文字之一。',
    clothesLink: '/clothes?ethnic=naxi',
    customsLink: '/customs?ethnic=naxi',
    festivalsLink: '/festivals?ethnic=naxi'
  },
  '土族': {
    name: '土族',
    population: '约29万人',
    distribution: '主要分布在青海省互助土族自治县等地',
    features: '土族有着丰富的民间艺术传统，"安昭"是其特有的宗教信仰形式。',
    clothesLink: '/clothes?ethnic=tu',
    customsLink: '/customs?ethnic=tu',
    festivalsLink: '/festivals?ethnic=tu'
  },
  '高山族': {
    name: '高山族',
    population: '约55万人',
    distribution: '主要分布在台湾省山地和东部地区',
    features: '高山族由多个民族构成，各族群都有着丰富的文化传统和音乐舞蹈艺术。',
    clothesLink: '/clothes?ethnic=gaoshan',
    customsLink: '/customs?ethnic=gaoshan',
    festivalsLink: '/festivals?ethnic=gaoshan'
  },
  '锡伯族': {
    name: '锡伯族',
    population: '约19万人',
    distribution: '主要分布在新疆伊犁察布查尔锡伯自治县和辽宁省沈阳市等地',
    features: '锡伯族有着悠久的历史和丰富的文化传统，善于射箭、骑马，有"弓箭民族"之称。',
    clothesLink: '/clothes?ethnic=xibo',
    customsLink: '/customs?ethnic=xibo',
    festivalsLink: '/festivals?ethnic=xibo'
  },
  '达斡尔族': {
    name: '达斡尔族',
    population: '约13万人',
    distribution: '主要分布在内蒙古自治区莫力达瓦达斡尔族自治旗、黑龙江省齐齐哈尔市等地',
    features: '达斡尔族有着丰富的民间文学和艺术，库木沁节是其重要的传统节日。',
    clothesLink: '/clothes?ethnic=dawoer',
    customsLink: '/customs?ethnic=dawoer',
    festivalsLink: '/festivals?ethnic=dawoer'
  },
  '鄂温克族': {
    name: '鄂温克族',
    population: '约3万人',
    distribution: '主要分布在内蒙古自治区鄂温克族自治旗、黑龙江省等地',
    features: '鄂温克族是我国人口较少的民族之一，传统以游猎为生，有"使鹿部落"之称。',
    clothesLink: '/clothes?ethnic=ewenke',
    customsLink: '/customs?ethnic=ewenke',
    festivalsLink: '/festivals?ethnic=ewenke'
  },
  '鄂伦春族': {
    name: '鄂伦春族',
    population: '约8千人',
    distribution: '主要分布在内蒙古自治区鄂伦春自治旗、黑龙江省等地',
    features: '鄂伦春族是我国人口最少的民族之一，传统以狩猎为生，被称为"森林之子"。',
    clothesLink: '/clothes?ethnic=elunchun',
    customsLink: '/customs?ethnic=elunchun',
    festivalsLink: '/festivals?ethnic=elunchun'
  },
  '赫哲族': {
    name: '赫哲族',
    population: '约5千人',
    distribution: '主要分布在黑龙江省同江、饶河等地',
    features: '赫哲族是我国人口最少的民族之一，传统以渔猎为生，被称为"鱼皮部落"。',
    clothesLink: '/clothes?ethnic=hezhe',
    customsLink: '/customs?ethnic=hezhe',
    festivalsLink: '/festivals?ethnic=hezhe'
  },
  '门巴族': {
    name: '门巴族',
    population: '约1万人',
    distribution: '主要分布在西藏自治区墨脱县、察隅县等地',
    features: '门巴族是居住在喜马拉雅山脉南麓的民族，有着独特的民族服饰和木雕艺术。',
    clothesLink: '/clothes?ethnic=menba',
    customsLink: '/customs?ethnic=menba',
    festivalsLink: '/festivals?ethnic=menba'
  },
  '珞巴族': {
    name: '珞巴族',
    population: '约3千人',
    distribution: '主要分布在西藏自治区察隅县、墨脱县等地',
    features: '珞巴族是我国人口最少的民族之一，有着独特的竹编、藤编工艺和民族服饰。',
    clothesLink: '/clothes?ethnic=luoba',
    customsLink: '/customs?ethnic=luoba',
    festivalsLink: '/festivals?ethnic=luoba'
  },
  '撒拉族': {
    name: '撒拉族',
    population: '约13万人',
    distribution: '主要分布在青海省循化撒拉族自治县',
    features: '撒拉族是我国西北地区的穆斯林民族，有着丰富的民间文学和手工艺传统。',
    clothesLink: '/clothes?ethnic=sala',
    customsLink: '/customs?ethnic=sala',
    festivalsLink: '/festivals?ethnic=sala'
  },
  '东乡族': {
    name: '东乡族',
    population: '约62万人',
    distribution: '主要分布在甘肃省临夏东乡族自治县等地',
    features: '东乡族是信仰伊斯兰教的民族，以刺绣、剪纸等民间艺术和饮食文化闻名。',
    clothesLink: '/clothes?ethnic=dongxiang',
    customsLink: '/customs?ethnic=dongxiang',
    festivalsLink: '/festivals?ethnic=dongxiang'
  },
  '保安族': {
    name: '保安族',
    population: '约2万人',
    distribution: '主要分布在甘肃省积石山保安族东乡族撒拉族自治县',
    features: '保安族是我国西北地区的穆斯林民族，有着独特的民族服饰和民间艺术。',
    clothesLink: '/clothes?ethnic=baoan',
    customsLink: '/customs?ethnic=baoan',
    festivalsLink: '/festivals?ethnic=baoan'
  },
  '裕固族': {
    name: '裕固族',
    population: '约1.4万人',
    distribution: '主要分布在甘肃省肃南裕固族自治县',
    features: '裕固族是我国西北地区的游牧民族，有着丰富的草原文化和民间艺术。',
    clothesLink: '/clothes?ethnic=yugu',
    customsLink: '/customs?ethnic=yugu',
    festivalsLink: '/festivals?ethnic=yugu'
  }
};

// 处理省份点击选择
const handleProvinceSelected = (provinceName) => {
      // 如果已经选中，则取消选中
      if(selectedProvince.value === provinceName) {
        selectedProvince.value = null;
    selectedEthnic.value = null;
        return;
      }
      
      // 设置选中的省份
      selectedProvince.value = provinceName;
      
      // 找到对应省份的民族数据
      const provinceData = provinces.find(p => p.name === provinceName || p.name.includes(provinceName));
      
  if(provinceData && provinceData.ethnics.length > 0) {
    // 选择该省份的第一个民族显示详情
    selectedEthnic.value = ethnicData[provinceData.ethnics[0]];
          } else {
    selectedEthnic.value = null;
          }
        
  if(provinceData) {
        // 自动翻转该省份的卡片
        provinces.forEach(p => {
          if(p.name === provinceName || p.name.includes(provinceName)) {
            p.isFlipped = true;
          } else {
            p.isFlipped = false;
          }
        });
      }
};
    
// 处理省份悬停
const handleProvinceHover = (provinceName) => {
      // 显示省份名称提示
  showTooltip && showTooltip(provinceName);
};

// 处理省份离开
const handleProvinceLeave = () => {
  hideTooltip && hideTooltip();
};

let showTooltip = null;
let hideTooltip = null;

// 初始化地图交互
onMounted(() => {
  // 创建提示框
  const tooltip = document.createElement('div');
  tooltip.className = 'map-tooltip';
  tooltip.style.display = 'none';
  document.querySelector('.china-map').appendChild(tooltip);
  
  // 显示提示框
  showTooltip = (text) => {
    const tooltip = document.querySelector('.map-tooltip');
    tooltip.textContent = text;
    tooltip.style.display = 'block';
    
    // 根据鼠标位置定位
    document.addEventListener('mousemove', updateTooltipPosition);
  };
  
  // 隐藏提示框
  hideTooltip = () => {
    const tooltip = document.querySelector('.map-tooltip');
    tooltip.style.display = 'none';
    document.removeEventListener('mousemove', updateTooltipPosition);
  };
  
  // 更新提示框位置
  const updateTooltipPosition = (e) => {
    const tooltip = document.querySelector('.map-tooltip');
    const mapContainer = document.querySelector('.china-map').getBoundingClientRect();
    
    tooltip.style.left = (e.clientX - mapContainer.left) + 'px';
    tooltip.style.top = (e.clientY - mapContainer.top - 30) + 'px';
  };
});

// 根据省份重置少数民族标记样式
const resetMarkersForProvinceView = () => {
  selectedProvince.value = null;
  selectedEthnic.value = null;
};

// 点击卡片时的额外处理
const toggleProvinceCard = (province, index) => {
  province.isFlipped = !province.isFlipped;
  
  // 如果是翻转到正面，则重置标记
  if(!province.isFlipped) {
    resetMarkersForProvinceView();
    return;
  }
  
  // 设置选中的省份
  const provinceName = province.name;
  handleProvinceSelected(provinceName);
  
  // 关闭其他省份的卡片
  provinces.forEach((p, i) => {
    if(i !== index) {
      p.isFlipped = false;
    }
  });
};

// 添加处理民族点击选择的函数
const handleEthnicSelected = (ethnicName) => {
  // 检查民族数据是否存在
  if (!ethnicData[ethnicName]) {
    console.warn(`没有找到 ${ethnicName} 的详细信息`);
    // 创建一个基本信息对象，避免界面出错
    selectedEthnic.value = {
      name: ethnicName,
      population: '暂无数据',
      distribution: '暂无具体分布数据',
      features: '该民族的详细信息正在整理中...',
      clothesLink: '/clothes',
      customsLink: '/customs',
      festivalsLink: '/festivals'
    };
  } else {
    selectedEthnic.value = ethnicData[ethnicName];
  }
  
  // 查找该民族所在的省份
  let foundProvince = null;
  provinces.forEach(province => {
    if (province.ethnics.includes(ethnicName)) {
      foundProvince = province;
    }
  });
  
  // 重置省份选择
  selectedProvince.value = null;
  
  // 关闭所有翻转的卡片
  provinces.forEach(p => {
    p.isFlipped = false;
  });
  
  // 如果找到省份，打开该省份的卡片
  if (foundProvince) {
    foundProvince.isFlipped = true;
  }
};

// 处理民族悬停
const handleEthnicHover = (ethnicName) => {
  showTooltip && showTooltip(ethnicName);
};

// 处理民族离开
const handleEthnicLeave = () => {
  hideTooltip && hideTooltip();
};
</script>

<style scoped>
.ethnic-map-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #fff;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #eaeaea;
  padding-bottom: 20px;
}

.page-header h1 {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 2.2rem;
  color: #005bac;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
}

.map-wrapper {
  display: flex;
  margin-bottom: 40px;
  background-color: #f9f9f9;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.china-map {
  flex: 3;
  padding: 20px;
  background-color: #f9f9f9;
  position: relative;
}

.map-svg {
  width: 100%;
  height: auto;
}

.province {
  fill: #e8e8e8;
  stroke: #fff;
  stroke-width: 1.5;
  transition: all 0.3s ease;
  cursor: pointer;
}

.province-hover {
  fill: #d9edf7;
}

.province-selected {
  fill: #b8daff;
  stroke: #007bff;
  stroke-width: 2;
}

.province-label {
  font-size: 10px;
  fill: #333;
  font-weight: bold;
  pointer-events: none;
}

.marker {
  fill: #e74c3c;
  stroke: #fff;
  stroke-width: 1.5;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.marker-hover {
  fill: #c0392b;
  transform: scale(1.2);
}

.marker-selected {
  fill: #e74c3c;
  stroke: #fff;
  stroke-width: 2;
  transform: scale(1.3);
  opacity: 1;
  animation: none;
}

.marker-province-match {
  fill: #e74c3c;
  stroke: #fff;
  stroke-width: 2;
  opacity: 1;
  animation: pulse 2s infinite;
}

.marker-province-match.marker-hover {
  animation-play-state: paused;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

.map-tooltip {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  pointer-events: none;
  transform: translateX(-50%);
  z-index: 100;
  white-space: nowrap;
}

.map-tooltip:after {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  transform: translateX(-50%);
  border-width: 5px;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.7) transparent transparent transparent;
}

.ethnic-links {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ethnic-link {
  padding: 8px 15px;
  background-color: #005bac;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.ethnic-link:hover {
  background-color: #0275d8;
  transform: translateY(-2px);
}

.ethnic-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 5px;
  flex: 1;
  margin: 0 5px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  border: 1px solid #eaeaea;
  transition: all 0.3s ease;
}

.stat-item:hover {
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: #005bac;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.ethnic-categories {
  margin-top: 40px;
}

.category-header {
  text-align: center;
  margin-bottom: 10px;
}

.category-title {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 1.5rem;
  color: #005bac;
}

.category-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 20px;
}

.category-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  max-width: 1100px;
  margin: 0 auto;
}

.province-card {
  flex: 0 0 160px;
  background-color: #fff;
  border-radius: 5px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #eaeaea;
  height: 130px;
  perspective: 1000px;
  margin: 0 0 10px 0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.province-card:hover {
  box-shadow: 0 5px 15px rgba(0, 123, 255, 0.2);
  border-color: #d9edf7;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.6s;
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.card-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.card-back {
  transform: rotateY(180deg);
  padding: 5px;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.is-flipped {
  transform: rotateY(180deg);
}

.category-icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.category-name {
  font-size: 1rem;
  color: #8B5A2B;
}

.ethnic-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-content: flex-start;
  max-height: 110px;
  overflow-y: auto;
  padding: 5px;
  margin-top: 5px;
}

.ethnic-tag {
  padding: 3px 5px;
  background-color: #005bac;
  color: white;
  border-radius: 4px;
  margin: 2px;
  font-size: 0.7rem;
  white-space: nowrap;
}

.map-legend {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 30px;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.legend-marker {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #e74c3c;
  border: 1.5px solid #fff;
  box-shadow: 0 0 3px rgba(0,0,0,0.2);
  opacity: 0.8;
}

.legend-province {
  width: 16px;
  height: 10px;
  background-color: #e8e8e8;
  border: 1px solid #fff;
  box-shadow: 0 0 3px rgba(0,0,0,0.1);
}

.map-info {
  flex: 2;
  padding: 30px;
  background-color: #fff;
  border-left: 1px solid #eaeaea;
}

.info-panel h3, .info-default h3 {
  font-family: 'Ma Shan Zheng', cursive;
  font-size: 1.8rem;
  color: #005bac;
  margin-bottom: 15px;
  position: relative;
  display: inline-block;
  padding-bottom: 10px;
}

.info-panel h3:after, .info-default h3:after {
  content: '';
  position: absolute;
  width: 40px;
  height: 2px;
  background-color: #005bac;
  bottom: 0;
  left: 0;
}

.info-panel p, .info-default p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #555;
}

@media (max-width: 992px) {
  .map-wrapper {
    flex-direction: column;
  }
  
  .map-info {
    border-left: none;
    border-top: 1px solid #eaeaea;
  }
  
  .ethnic-stats {
    flex-wrap: wrap;
  }
  
  .stat-item {
    flex: 1 0 45%;
    margin: 5px;
  }
  
  .province-card {
    flex: 0 0 calc(33.33% - 15px);
    height: 140px;
  }
}

@media (max-width: 768px) {
  .ethnic-map-container {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .map-info {
    padding: 20px;
  }
  
  .province-card {
    flex: 0 0 calc(50% - 15px);
  }
  
  .category-list {
    gap: 10px;
  }
  
  .ethnic-tag {
    padding: 2px 4px;
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .province-card {
    flex: 0 0 calc(100% - 20px);
    max-width: 200px;
    margin: 0 auto 10px;
  }
  
  .stat-item {
    flex: 1 0 100%;
    margin: 5px 0;
  }
  
  .map-legend {
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }
}

/* 非物质文化遗产相关的样式已被移除 */
</style> 