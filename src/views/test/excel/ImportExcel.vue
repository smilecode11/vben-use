<template>
  <PageWrapper title="excel数据导入示例">
    <template #headerContent>
      <div class="flex">
        <ImpExcel @success="onImpExcel" :isReturnFile="isReturnFile">
          <a-button type="primary" class="mb3">excel 导入</a-button>
        </ImpExcel>
        <a-radio-group v-model:value="isReturnFile" class="ml3">
          <a-radio-button :value="false">展示</a-radio-button>
          <a-radio-button :value="true">上传</a-radio-button>
        </a-radio-group>
      </div>
    </template>

    <BasicTable
      v-for="(item, index) in tableListRef"
      :key="index"
      :columns="item.columns"
      :dataSource="item.dataSource"
      :title="item.title"
    />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { RadioGroup as ARadioGroup, RadioButton as ARadioButton } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import { ImpExcel, ExcelData } from '@/components/Excel';
  import { BasicTable, BasicColumn } from '@/components/Table';

  const tableListRef = ref<{ title: string; dataSource: any[]; columns: any[] }[]>([]);

  //  导入 excel 是否直接返回文件， 为 true 时直接返回上传的文件, 否则解析数据
  const isReturnFile = ref(false);

  const onImpExcel = (data: ExcelData | File) => {
    console.log('_onImpExcel', data);
    if (!isReturnFile.value) {
      tableListRef.value = [];
      for (const excelData of data) {
        const {
          header,
          results,
          meta: { sheetName },
        } = excelData;
        const columns: BasicColumn[] = [];
        for (const title of header) {
          columns.push({ title, dataIndex: title });
        }
        tableListRef.value.push({ title: sheetName, columns, dataSource: results });
      }
    } else {
      //  直接返回 file
      console.log('TODO: upload excel with server');
    }
  };
</script>
