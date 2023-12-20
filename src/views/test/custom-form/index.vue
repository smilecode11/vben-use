<template>
  <div class="test-custom-form-container">
    <BasicForm @register="registerForm" @submit="handleSubmit">
      <!-- slot 方式 -->
      <template #customSlotWithMutipleUpload="{ model, field }">
        <ImageMultipleUpload v-model:value="model[field]" useDrag />
      </template>

      <template #customSlotWithAddress="{ model, field }">
        <a-input-group compact>
          <a-input
            v-model:value="model[field]"
            disabled
            placeholder="请选择地址"
            style="width: 320px"
          />
          <a-button type="primary" @click="handleMapSelectionInit">地图选点</a-button>
        </a-input-group>
      </template>
    </BasicForm>

    <MapSelection ref="mapSelectionRef" useDistance @get-map-selection="onGetMapSelection" />
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { InputGroup as AInputGroup, Input as AInput, Button as AButton } from 'ant-design-vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { ImageMultipleUpload } from '@/views/comps/upload/image/components/MultipleUploadWithDrag';
  import MapSelection from '@/views/comps/map/components/MapSelection/index.vue';
  import { formSchema } from './customForm.data';

  defineOptions({ name: 'TestCustomForm' });
  const formData = reactive({
    field1: [
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/ZVcHDo.png',
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/okhCjC.png',
    ],
    field2: [
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/ZVcHDo.png',
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/okhCjC.png',
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/tEzWxD.png',
    ],
    field3: [
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/ZVcHDo.png',
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/okhCjC.png',
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/tEzWxD.png',
    ],
    field4: ['http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/2NnL26.png'],
    address: '浙江省温州市鹿城区南汇街道温州市人民政府听证议政中心十九号楼',
    lat: '27.992617',
    lng: '120.695937',
    distance: 50,
  });

  /** 地址选择*/
  const mapSelectionRef = ref<HTMLElement | null>(null);
  const handleMapSelectionInit = () => {
    if (!mapSelectionRef.value) return;
    mapSelectionRef.value?.init({
      address: formData.address,
      distance: formData.distance,
      lat: formData.lat,
      lng: formData.lng,
    });
  };
  const onGetMapSelection = (data) => {
    // console.log('_onGetMapSelection', data);
    const { address, distance, lat, lng } = data;
    formData.address = address;
    formData.distance = distance;
    formData.lat = lat;
    formData.lng = lng;

    setFieldsValue({
      ...formData,
    });
  };

  const [registerForm, { setFieldsValue, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: true,
    baseColProps: { lg: 24, md: 24 },
    actionColOptions: {
      span: 24,
    },
    submitButtonOptions: {
      text: '提交',
    },
  });

  const handleSubmit = (values: any) => {
    console.log('_handleSubmit', values);
  };

  onMounted(() => {
    setFieldsValue({
      ...formData,
    });
  });
</script>
