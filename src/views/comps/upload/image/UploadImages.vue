<template>
  <CollapseContainer title="通用的上传组件">
    <BasicUpload
      :maxSize="20"
      :maxNumber="10"
      @change="onChange"
      :api="uploadToOSS"
      class="my-5"
      :accept="['image/*']"
      useCustomDrag
    />
    {{ uploadUrls }}
  </CollapseContainer>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { CollapseContainer } from '@/components/Container';
  import { BasicUpload } from '@/components/Upload';
  import { uploadToOSS } from '@/api/basics/upload';

  const uploadUrls = ref('');

  const onChange = (data) => {
    // console.log('_onChange', data);
    uploadUrls.value = data;
  };

  onMounted(() => {
    // console.log('uploadImages onMounted');
  });
</script>
