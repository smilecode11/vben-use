<template>
  <PageWrapper title="下载&打印" content="例子演示" contentFullHeight class="download-container">
    <div class="content-wrap">
      <div>
        <a-button type="primary" @click="handleDownload()">文件流下载</a-button>
        <a-alert message="根据后台接口文件流下载" type="info" />
      </div>
      <div>
        <a-button type="primary" @click="handleDownload('fileaddress')">文件地址下载</a-button>
        <a-alert message="根据文件地址下载文件" type="warning" />
      </div>
      <div>
        <a-button type="primary" @click="handleDownload('base64')">base64流下载</a-button>
        <a-alert message="base64流下载" type="success" />
      </div>
      <div>
        <a-button type="primary" @click="handleDownload('imageurl')">图片Url下载</a-button>
        <a-alert message="图片Url下载,如果有跨域问题，需要处理图片跨域" type="error" />
      </div>
      <a-divider content="打印" />
      <div>
        <a-button type="primary" @click="handlePrint('json')">json打印表格</a-button>
        <a-alert message="json 打印表格" type="error" />
      </div>
      <div>
        <a-button type="primary" @click="handlePrint('image')">图片打印</a-button>
        <a-alert message="打印图片" type="error" />
      </div>
    </div>
    <PageFooter>
      <template #left>left</template>
      <template #right>right</template>
    </PageFooter>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Alert as AAlert, Divider as ADivider, Switch } from 'ant-design-vue';
  import { PageWrapper, PageFooter } from '@/components/Page';
  import printJS from 'print-js';
  import {
    downloadByData,
    downloadByUrl,
    downloadByBase64,
    downloadByOnlineUrl,
  } from '@/utils/file/download';

  import imgBase64 from './imgBase64';

  defineOptions({
    name: 'TestDownload',
  });

  const handleDownload = (type?: string) => {
    switch (type) {
      case 'file': {
        console.log('文件流下载');
        downloadByData('text content', 'testName.txt');
        break;
      }
      case 'fileaddress': {
        console.log('文件地址');
        downloadByUrl({
          url: 'https://codeload.github.com/anncwb/vue-vben-admin-doc/zip/master',
          target: '_self',
        });
        break;
      }
      case 'base64': {
        console.log('base64');
        downloadByBase64(imgBase64, 'logo.png');
        break;
      }
      case 'imageurl': {
        console.log('imageurl');
        downloadByOnlineUrl(
          'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5944817f47b8408e9f1442ece49d68ca~tplv-k3u1fbpfcp-watermark.image',
          'logo.png',
        );
        break;
      }
      default: {
        console.log('其他操作');
      }
    }
  };

  const handlePrint = (type?: string) => {
    switch (type) {
      case 'json': {
        printJS({
          printable: [
            { name: 'll', email: '123@gmail.com', phone: '123' },
            { name: 'qq', email: '456@gmail.com', phone: '456' },
          ],
          properties: ['name', 'email', 'phone'],
          type: 'json',
        });
        break;
      }
      case 'image':
        printJS({
          printable: [
            'https://anncwb.github.io/anncwb/images/preview1.png',
            'https://anncwb.github.io/anncwb/images/preview2.png',
          ],
          type: 'image',
          header: 'Multiple Images',
          imageStyle: 'width:100%;',
        });
        break;
    }
  };

  onMounted(() => {
    console.log('onMounted download-container');
  });
</script>

<style lang="less" scoped>
  .content-wrap {
    padding: 12px;
    background: #fff;
    & > div {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      & > .ant-alert {
        margin-left: 8px;
      }
    }
  }
</style>
