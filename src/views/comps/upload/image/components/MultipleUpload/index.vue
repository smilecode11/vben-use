<template>
  <div class="MultipleUploadControl">
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :action="props.action"
      :max-count="props.maxCount"
      :headers="uploadHeaders"
      multiple
      accept=".jpg,.jpeg,.png"
      :before-upload="beforeUpload"
      @preview="handlePreview"
      @change="onChange"
    >
      <div v-if="(fileList || []).length < props.maxCount">
        <plus-outlined />
        <div style="margin-top: 8px">Upload</div>
      </div>
    </a-upload>
    <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { Upload as AUpload, Modal as AModal, message } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { multipleUploadProps } from './props';
  import { getToken } from '@/utils/auth';

  const props = defineProps(multipleUploadProps);
  const emit = defineEmits(['update:value']);

  const uploadHeaders = computed(() => ({
    Authorization: `Bearer ${getToken()}`,
  }));

  const fileList = ref<any[]>([]);

  watch(
    () => props.value,
    (newV) => {
      if (newV) {
        let temp = [] as any[];
        // 根据传入数组构建 fileList 需求数据
        for (let i = 0; i < newV.length; i++) {
          let item = newV[i];
          temp.push({
            uid: i + 1,
            url: item,
            name: item.substring(item.lastIndexOf('/') + 1),
            status: 'done',
          });
        }
        fileList.value = temp;
      }
    },
    {
      immediate: true,
    },
  );

  const previewVisible = ref(false);
  const previewImage = ref('');
  const previewTitle = ref('');

  //  上传验证
  const beforeUpload = (file) => {
    // 最大数量为 1 时，允许直接替换
    if (props.maxCount === 1) return Promise.resolve(file);
    //  最大数量为多数时，超出数量提示
    if (fileList.value.length >= props.maxCount) {
      message.warning(`上传文件个已达到最高数量 ${props.maxCount}`);
      return Promise.reject();
    }
    return Promise.resolve(file);
  };

  const onChange = ({ file, fileList } = {} as any) => {
    // console.log('_onChange', file, fileList);
    if (file.status === 'done' || file.status === 'removed') {
      try {
        let newFileList = fileList.map((item) => {
          return item.url || item.response.data.url;
        });
        emit('update:value', newFileList);
      } catch (error) {
        // console.log('Not affecting the process', error);
      }
    }
  };

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf('/') + 1);
  };

  const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
  };
</script>

<style scoped>
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
