<template>
  <CollapseContainer title="通用的图片上传">
    <BasicUpload
      :maxSize="10"
      :maxNumber="3"
      @change="onChange2"
      :api="uploadToOSS"
      class="my-5"
      :accept="['image/*']"
    />
    {{ uploadUrls2 }}

    <a-divider orientation="left">【初始化+排序功能】</a-divider>

    <BasicUpload
      :maxSize="20"
      :maxNumber="10"
      @change="onChange"
      :api="uploadToOSS"
      class="my-5"
      :accept="['image/*']"
      :value="uploadUrls"
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
  import { Divider as ADivider } from 'ant-design-vue';

  const uploadUrls = ref([
    'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/ZVcHDo.png',
    'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/okhCjC.png',
    'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/tEzWxD.png',
  ]);
  const uploadUrls2 = ref('');

  const onChange = (data) => {
    // console.log('_onChange', data);
    uploadUrls.value = data;
  };

  const onChange2 = (data) => {
    uploadUrls2.value = data;
  };

  onMounted(() => {
    // console.log('uploadImages onMounted');
  });
</script>
