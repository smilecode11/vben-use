<template>
  <CollapseContainer title="图片裁切使用和上传">
    <div class="flex" style="align-items: center">
      <CropperImage
        ref="refCropper"
        :src="headImg"
        @cropend="onCropend"
        :circled="circled"
        class="mr10"
        style="width: 520px"
        :options="cropperOption"
      />
      <a-image :src="circleImg" :preview="false" style="width: 320px" />
      <div class="ml10 flex flex-col" style="align-self: flex-start">
        <a-radio-group class="mb-1" v-model:value="circled">
          <a-radio-button :value="true">圆形</a-radio-button>
          <a-radio-button :value="false">方形</a-radio-button>
        </a-radio-group>
        <a-input-group compact>
          <a-input
            :disabled="circled"
            type="number"
            style="width: 100px"
            v-model:value="cropperOption.aspectRatio"
          />
          <a-button>长宽比</a-button>
        </a-input-group>

        <a-button class="mt-1" @click="handleUpload">上传图片</a-button>

        <a-image :src="uploadedImg" :preview="false" style="width: 120px" />
      </div>
    </div>
  </CollapseContainer>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { dataURLtoBlob } from '/@/utils/file/base64Conver';
  import { CollapseContainer } from '@/components/Container';
  import { CropperImage } from '@/components/Cropper';
  import {
    message,
    Image as AImage,
    Button as AButton,
    RadioGroup as ARadioGroup,
    RadioButton as ARadioButton,
    Input as AInput,
    InputGroup as AInputGroup,
  } from 'ant-design-vue';

  import headImg from '@/assets/images/header.jpg';
  import { uploadToOSS } from '@/api/basics/upload';

  const refCropper = ref<null | HTMLElement>(null);
  const circleInfo = ref({});
  const circleImg = ref('');
  const cropperOption = reactive({
    aspectRatio: 1.2,
  });
  const circled = ref(false);
  const uploadedImg = ref('');

  //  TIP: 监听图片裁切
  const onCropend = ({ imgBase64, imgInfo }) => {
    // console.log('_onCropend imgBase64', imgBase64);
    // console.log('_onCropend imgInfo', imgInfo);
    circleInfo.value = imgInfo;
    circleImg.value = imgBase64;
  };

  //  TIP：上传图片
  const handleUpload = async () => {
    const blob = dataURLtoBlob(circleImg.value);
    const result = await uploadToOSS({ name: 'file', file: blob, filename: 'test.png' });
    // console.log('_upload resp', result);
    if (result.data.data.url) {
      console.log('oss 访问地址：', result.data.data.url);
      uploadedImg.value = result.data.data.url;
      message.success({
        content: '上传图片成功, 结果查看控制台',
      });
    }
  };

  /** 设置比例并重新裁切图片*/
  function setAspectRatioAndCrop(value) {
    if (!refCropper.value) return;
    refCropper.value?.setAspectRatioAndCrop(value);
  }

  watch(
    () => circled.value,
    (newV) => {
      if (newV) {
        cropperOption.aspectRatio = 1;
      } else {
        setAspectRatioAndCrop(cropperOption.aspectRatio);
      }
    },
  );

  watch(
    () => cropperOption.aspectRatio,
    (newV) => {
      setAspectRatioAndCrop(Number(newV));
    },
  );

  // onMounted(() => {
  //   console.log('_leftbar onMounted');
  // });
</script>
