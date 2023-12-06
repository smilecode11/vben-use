<template>
  <CollapseContainer title="选择图片并上传（弹窗）" :show="false">
    <div class="flex" style="align-items: center">
      <CropperAvatar :src="sourceSrc" :uploadApi="uploadToOSS" @change="onChange" />
      <a-image :src="sourceSrc" class="ml-2" />
    </div>
  </CollapseContainer>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { CollapseContainer } from '@/components/Container';
  import { CropperAvatar } from '@/components/Cropper';
  import { Image as AImage } from 'ant-design-vue';
  import { uploadToOSS } from '@/api/basics/upload';

  const sourceSrc = ref('http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/U1JMPF.png');

  const onChange = ({ data }) => {
    sourceSrc.value = data.url;
  };

  onMounted(() => {
    // console.log('uploadAvatar onMounted');
  });
</script>
