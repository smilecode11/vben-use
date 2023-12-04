<template>
  <CollapseContainer title="表单图片上传">
    <a-form>
      <a-form-item label="单图">
        <MultipleUpload v-model:value="formData.banner" :maxCount="1" />
      </a-form-item>
      <a-form-item label="多图">
        <MultipleUpload v-model:value="formData.images" :maxCount="5" />
      </a-form-item>
      <a-form-item label="单图数据"> {{ formData.banner }} </a-form-item>
      <a-form-item label="多图数据"> {{ formData.images }} </a-form-item>
    </a-form>
    <Divider />
  </CollapseContainer>
</template>

<script lang="ts" setup>
  import { onMounted, reactive } from 'vue';
  import { Form as AForm, FormItem as AFormItem, Divider } from 'ant-design-vue';
  import { CollapseContainer } from '@/components/Container';
  import MultipleUpload from './components/MultipleUpload/index.vue';

  const formData = reactive({
    banner: ['http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/ZVcHDo.png'],
    images: [
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/ZVcHDo.png',
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/okhCjC.png',
      'http://smile-backend2.oss-cn-hangzhou.aliyuncs.com/backend2/tEzWxD.png',
    ],
  });

  // const formData = reactive({
  //   banner: [],
  //   images: [],
  // });

  onMounted(() => {
    // console.log('uploadImageForm onMounted');
  });
</script>
