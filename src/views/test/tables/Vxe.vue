<template>
  <PageWrapper title="VxeTable">
    <template #headerContent>
      <h4>{{ headerContent }}</h4>
    </template>
    <div class="container">
      <a-tabs v-model:active="activeKey" animated @change="onTabChange">
        <a-tab-pane :tab="BASIC_TITLE" key="basic">
          <Basic />
        </a-tab-pane>
        <a-tab-pane :tab="SERVICE_TITLE" key="service">
          <Service />
        </a-tab-pane>
        <a-tab-pane key="other_opera" :tab="OTHER_OPERA_TITLE">
          <OtherOpera />
        </a-tab-pane>
        <a-tab-pane key="export_save" :tab="EXPORT_SAVE_TITLE">
          <!--  -->
        </a-tab-pane>
      </a-tabs>
    </div>
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Tabs as ATabs, TabPane as ATabPane } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import Basic from './components/Vxe/Basic.vue';
  import Service from './components/Vxe/Service.vue';
  import OtherOpera from './components/Vxe/OtherOpera.vue';

  const activeKey = ref('basic');
  const headerContent = ref('Vxe Table 使用示例');
  const BASIC_TITLE = '基础示例';
  const SERVICE_TITLE = '远程数据获取示例';
  const OTHER_OPERA_TITLE = '合并表头/拖拽/右键菜单示例';
  const EXPORT_SAVE_TITLE = '导出/保存市里';

  const onTabChange = (keyName) => {
    console.log(keyName);
    switch (keyName) {
      case 'basic':
        headerContent.value = BASIC_TITLE;
        break;
      case 'service':
        headerContent.value = SERVICE_TITLE;
        break;
      case 'other_opera':
        headerContent.value = OTHER_OPERA_TITLE;
        break;
      case 'export_save':
        headerContent.value = EXPORT_SAVE_TITLE;
        break;
      default:
        headerContent.value = 'Surely Table 使用示例';
    }
  };
</script>

<style scopd lang="less">
  .container {
    padding: 12px;
    background: #ffffff;
  }
</style>
