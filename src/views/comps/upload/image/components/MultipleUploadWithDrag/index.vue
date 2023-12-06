<template>
  <div class="MultipleUploadWithDragControl container">
    <div class="uploaded-list" ref="sortableContainer">
      <!-- * sortablejs 循环的对象必须正确绑定 key 值，不能是index，random 等 -->
      <div class="uploaded-item" v-for="item in fileList" :key="item.url" :data-url="item.url">
        <a-image :src="item.url" :preview="false" />
        <div class="cover-opera">
          <div class="opera-drag" v-if="props.useDrag">
            <DragOutlined />
          </div>
          <div class="opera-preview" @click="handlePreview(item)">
            <EyeOutlined />
          </div>
          <div class="opera-delete">
            <a-popconfirm
              title="确定删除当前图片?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="handleDelete(item)"
            >
              <DeleteOutlined />
            </a-popconfirm>
          </div>
        </div>
      </div>
    </div>
    <a-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :action="props.action"
      :max-count="props.maxCount"
      :headers="uploadHeaders"
      multiple
      accept=".jpg,.jpeg,.png"
      :before-upload="beforeUpload"
      @change="onChange"
      :showUploadList="false"
      :class="{ 'max-count-class': (fileList || []).length >= props.maxCount }"
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
  import { ref, computed, watch, onMounted, nextTick } from 'vue';
  import {
    Upload as AUpload,
    Modal as AModal,
    message,
    Image as AImage,
    Popconfirm as APopconfirm,
  } from 'ant-design-vue';
  import { PlusOutlined, DragOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons-vue';
  import Sortable from 'sortablejs';
  import { multipleUploadProps } from './props';
  import { getToken } from '@/utils/auth';

  defineOptions({ name: 'MultipleUploadWithDrag' });
  const sortableContainer = ref<HTMLTableSectionElement>();
  const props = defineProps(multipleUploadProps);
  const emit = defineEmits(['update:value', 'change']);

  const uploadHeaders = computed(() => ({
    Authorization: `Bearer ${getToken()}`,
  }));

  const fileList = ref<any[]>([]);

  if (props.useDrag) {
    onMounted(() => {
      new Sortable(sortableContainer.value as any, {
        // group: 'sortMultipleUploadWithDrag',
        animation: 150,
        handle: '.opera-drag',
        onEnd(evt) {
          const eles = evt.to.getElementsByClassName('uploaded-item');
          let newArr = [] as any[];
          for (let i = 0; i < eles.length; i++) {
            let url = eles[i].getAttribute('data-url');
            newArr.push(url);
          }
          // 抛出新排序好的数组
          nextTick(() => {
            emit('update:value', newArr);
            emit('change', newArr);
          });
        },
      });
    });
  }

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
      flush: 'post',
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
    if (file.status === 'done' || file.status === 'removed') {
      try {
        let newFileList = fileList.map((item) => {
          return item.url || item.response.data.url;
        });
        emit('update:value', newFileList);
        emit('change', newFileList);
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

  const handleDelete = (file) => {
    // console.log('_handleDelete', file);
    const newFileList = fileList.value
      .filter((item) => item.url !== file.url)
      .map((item) => {
        return item.url;
      });
    emit('update:value', newFileList);
    emit('change', newFileList);
  };

  const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = '';
  };
</script>

<style scoped lang="less">
  .container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .uploaded-list {
      display: inline-flex;
      align-items: center;
      .uploaded-item {
        overflow: hidden;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        margin-left: 8px;
        width: 102px;
        height: 102px;
        border-radius: 8px;
        border: 1px dashed #d9d9d9;
        .cover-opera {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          transition: all 0.7s;
          display: flex;
          align-items: center;
          justify-content: center;
          & > div {
            margin: 0 2px;
            padding: 4px;
            color: transparent;
          }
          &:hover {
            background: rgba(0, 0, 0, 0.38);
            & > div {
              color: #ffffff;
              &.opera-drag {
                cursor: move;
              }
              &.opera-delete,
              &.opera-preview {
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }

  .ant-upload-wrapper {
    margin-left: 8px;
    width: auto;

    &.max-count-class {
      visibility: hidden;
      pointer-events: none;
    }
  }
</style>
