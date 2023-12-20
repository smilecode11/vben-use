<template>
  <PageWrapper title="Excel导出示例">
    <template #headerContent> </template>

    <BasicTable title="基础表格" :columns="columns" :dataSource="data">
      <template #toolbar>
        <a-button type="primary" @click="openModal"> 导出 </a-button>
        <a-button type="warning" @click="exportCustomHeader"> 导出自定义头部 </a-button>
        <a-button type="error" @click="exportMoreSheet"> 导出多sheet </a-button>
      </template>
    </BasicTable>

    <ExpExcelModal @register="register" @success="onExcelSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { PageWrapper } from '@/components/Page';
  import { BasicTable } from '@/components/Table';
  import {
    jsonToSheetXlsx,
    jsonToMultipleSheetXlsx,
    ExpExcelModal,
    ExportModalResult,
  } from '@/components/Excel';
  import { useModal } from '@/components/Modal';
  import { columns, /* arrData, */ data } from './data.ts';

  // console.log('_columns', columns);
  // console.log('_arrData', arrData);
  // console.log('_data', data);

  const [register, { openModal }] = useModal();

  const onExcelSuccess = ({ filename, bookType }: ExportModalResult) => {
    // 默认Object.keys(data[0])作为header
    jsonToSheetXlsx({
      data,
      filename,
      write2excelOpts: {
        bookType,
      },
    });
  };

  const exportCustomHeader = () => {
    jsonToSheetXlsx({
      data,
      header: {
        id: 'ID',
        name: '姓名',
        age: '年龄',
        no: '编号',
        address: '地址',
        beginTime: '开始时间233',
        endTime: '结束时间233',
      },
      filename: '自定义头部.xlsx',
      json2sheetOpts: {
        // 指定顺序
        header: ['name', 'id'],
      },
    });
  };

  const exportMoreSheet = () => {
    jsonToMultipleSheetXlsx({
      sheetList: [
        {
          data,
          sheetName: '使用key作为默认头部',
        },
        {
          data,
          header: {
            id: 'ID',
            name: '姓名',
            age: '年龄',
            no: '编号',
            address: '地址',
            beginTime: '开始时间233',
            endTime: '结束时间233',
          },
          json2sheetOpts: {
            // 指定顺序
            header: ['name', 'id'],
          },
          sheetName: '自定义头部',
        },
      ],
      filename: '多Sheet导出示例.xlsx',
    });
  };
</script>
