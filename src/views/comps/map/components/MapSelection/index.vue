<template>
  <a-modal class="map-selection-container" v-model:open="modalShow" title="地址选择" width="1000px">
    <div id="mapcontrol" v-loading="maploading"></div>
    <div class="info">
      <div class="input-item">
        <a-input
          size="small"
          id="tipinput"
          type="text"
          v-model="tipinputValue"
          placeholder="搜索地点"
          style="width: 320px"
          allowClear
        />
      </div>
    </div>
    <a-form class="settings">
      <a-form-item label="当前选择位置">
        <a-input
          disabled
          placeholder="请选择位置"
          style="margin-bottom: 12px"
          :value="formData.address"
        />
      </a-form-item>
      <a-form-item label="当前选择距离" v-if="useDistance">
        <a-select @change="onDistanceChange" :value="formData.distance" style="width: 100%">
          <a-select-option v-for="item in distanceOptions" :key="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-button @click="modalShow = false">取消</a-button>
      <a-button type="primary" @click="handleConfirm"> 确定 </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
  import AMapLoader from '@amap/amap-jsapi-loader';
  import { computed, ref, reactive, onMounted, nextTick } from 'vue';
  import {
    Input as AInput,
    Modal as AModal,
    Form as AForm,
    FormItem as AFormItem,
    Select as ASelect,
    SelectOption as ASelectOption,
    message,
  } from 'ant-design-vue';

  import { MapSelectionProps } from './props';

  const props = defineProps(MapSelectionProps);
  const emit = defineEmits(['getMapSelection']);
  const useDistance = computed(() => props.type === 'address,distance'); //  选点并需要范围值

  let AMap = '' as any;
  let map = '' as any;
  let setCircleRadiusFun = () => {};
  const modalShow = ref(false);
  const maploading = ref(true);
  const tipinputValue = ref('');

  let formData = reactive<{
    address: string;
    lat: string;
    lng: string;
    distance?: number;
    adcode?: string;
  }>({
    address: '',
    lat: '',
    lng: '',
  });

  const distanceOptions = [
    { value: 200, label: '200米' },
    { value: 100, label: '100米' },
    { value: 50, label: '50米' },
  ];

  function initMap() {
    map = new AMap.Map('mapcontrol', {
      zoom: 17, //初始化地图级别
      center: [120.699279, 27.993849], //初始化地图中心点位置
    });

    var marker; // 初始化 marker
    var circle;
    var infoWindow = new AMap.InfoWindow({
      autoMove: true,
      offset: { x: 0, y: -30 },
    });

    //  已设置, 初始化位置 * 1
    if (formData.address && formData.lng && formData.lat) {
      const lnglat = new AMap.LngLat(formData.lng, formData.lat);
      createMarker(lnglat);
      useDistance.value && createCircle(lnglat);
      map.setCenter(marker.getPosition());
      markerDragendRegister();
      openWindow();
    }

    // 地图点击 * 2
    map.on('click', async (e) => {
      const lnglat = new AMap.LngLat(e.lnglat.getLng(), e.lnglat.getLat());
      createMarker(lnglat);
      useDistance.value && createCircle(lnglat);
      await regeoCode([lnglat.getLng(), lnglat.getLat()]);
      markerDragendRegister();
      openWindow();
    });

    var autoComplete = new AMap.Autocomplete({
      input: 'tipinput',
      datatype: 'poi', //  检索 poi
      city: '全国',
    });
    // 监听autoComplete选择 * 3
    autoComplete.on('select', async ({ poi, type }) => {
      // console.log('_autoComplete select', poi);
      const lnglat = new AMap.LngLat(poi.location.getLng(), poi.location.getLat());
      createMarker(lnglat);
      useDistance.value && createCircle(lnglat);
      markerDragendRegister();
      await regeoCode([lnglat.getLng(), lnglat.getLat()]);
      openWindow();
    });
    autoComplete.on('complete', (res) => {
      // console.log('_autoComplete.on complete', res);
    });
    autoComplete.on('error', (res) => {
      console.error('_autoComplete.on error', res);
      message.error(res.info);
    });

    /** 根据经纬度逆推地理信息并赋值设置*/
    function regeoCode(lnglat) {
      return new Promise((resolve, reject) => {
        var geocoder = new AMap.Geocoder();
        geocoder.getAddress(lnglat, function (status, result) {
          // console.log('_geocoder.getAddress', status, result);
          if (status === 'complete' && result.regeocode) {
            formData.adcode = result.regeocode.addressComponent.adcode;
            formData.lng = lnglat[0];
            formData.lat = lnglat[1];
            formData.address = result.regeocode.formattedAddress;
            // console.log('_complete', formData);
            resolve(result.regeocode);
          } else {
            reject('根据经纬度查询地址失败');
            // console.error('根据经纬度查询地址失败');
          }
        });
      });
    }
    /** marker拖动事件*/
    async function markerDragend(data) {
      map.setCenter(marker.getPosition());
      const lnglat = data.lnglat;
      useDistance.value && createCircle(lnglat);
      await regeoCode([lnglat.getLng(), lnglat.getLat()]);
      openWindow();
    }
    /** 创建标记点*/
    function createMarker(lnglat) {
      clearMarker(); //  只保留一个标记
      marker = new AMap.Marker({
        map: map,
        position: lnglat,
        draggable: true,
      });
      map.setCenter(marker.getPosition());
    }
    /** 创建区域覆盖物*/
    function createCircle(lnglat) {
      if (circle) {
        //  清除之前的 circle
        circle.setMap(null);
        circle = null;
      }
      circle = new AMap.Circle({
        center: lnglat, // 圆心位置
        radius: formData.distance, //半径
        strokeColor: '#F33', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: '#ee2200', //填充颜色
        fillOpacity: 0.35, //填充透明度
      });
      map.add(circle);
    }
    //  设置区域的距离
    function setCircleRadius() {
      if (circle) {
        // console.log('_setCircleRadius', formData.distance);
        circle.setRadius(formData.distance);
      }
    }
    /** 清除标记点*/
    function clearMarker() {
      if (marker) {
        //  清除 marker
        marker.setMap(null);
        marker = null;
      }
    }
    /** 打开窗口信息*/
    function openWindow() {
      infoWindow.close();
      infoWindow.setContent(
        ['地址: ' + formData.address, '经纬度: [' + formData.lng + ', ' + formData.lat + ']'].join(
          '<br>',
        ),
      );
      infoWindow.open(map, marker.getPosition());
    }
    /** marker 拖动监听*/
    function markerDragendRegister() {
      marker.off('dragend', markerDragend); //  取消监听
      marker.on('dragend', markerDragend); // 监听
    }

    return {
      setCircleRadius,
    };
  }

  const init = async ({ address = '', lng = '', lat = '', distance = 50 }) => {
    // 初始化数据
    formData.address = address;
    formData.lng = lng;
    formData.lat = lat;
    useDistance.value && (formData.distance = distance);

    console.log('_init', formData);
    modalShow.value = true;
    await nextTick();
    AMapLoader.reset(); // 重置,解决多种sdk方式调用的报错
    AMapLoader.load({
      key: 'ccc60be0df40131454501ae4f8fca05f', // 申请好的Web端开发者Key
      version: '2.0', // 指定要加载的 JSAPI 的版本
      plugins: [
        'AMap.AutoComplete',
        'AMap.PlaceSearch',
        'AMap.Geocoder',
        // "AMap.Geolocation", // 定位
      ],
    })
      .then((Map) => {
        // console.log('_AMapLoader.load', Map);
        AMap = Map;
        //  初始化地图, 并返回系列方法或属性用于后续操作使用
        const { setCircleRadius } = initMap();
        setCircleRadiusFun = setCircleRadius;
        maploading.value = false; //  地图加载完成
      })
      .catch((error) => {
        console.error('_Load error', error);
      });
  };

  //  提交
  const handleConfirm = () => {
    emit('getMapSelection', formData);
    modalShow.value = false;
  };

  const onDistanceChange = (distance) => {
    formData.distance = distance;
    setCircleRadiusFun();
  };

  onMounted(() => {
    // 明文设置 secret
    // https://lbs.amap.com/api/javascript-api-v2/guide/abc/jscode
    (window as any)._AMapSecurityConfig = {
      securityJsCode: '472cb71bf261c059c56a73ea71324cb7',
    };
  });

  defineExpose({
    init,
  });
</script>

<style lang="scss" scoped>
  #mapcontrol {
    position: relative;
    width: 100%;
    height: 450px;
  }
  .info {
    position: absolute;
    left: 20px;
    top: 80px;
    width: 250px;
  }

  .settings {
    padding: 16px 22px;
    .ant-form-item {
      margin-bottom: 0;
    }
  }
</style>
