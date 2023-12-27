<template>
  <div class="basic">
    <!-- 
      stripe 斑马纹
      summary 设置总结栏 summary-fixed
      :pagination="false"
     -->
    <s-table :columns="columns" :data-source="data" :scroll="{ y: 520 }" bordered summary-fixed>
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'action'">
          <a-button type="warning" size="small" class="mr-1">查看</a-button>
          <a-button type="primary" size="small" class="mr-1">编辑</a-button>
          <a-button type="error" size="small">删除</a-button>
        </template>
      </template>
      <template #summary>
        <s-table-summary-row>
          <s-table-summary-cell :index="0">总计</s-table-summary-cell>
          <s-table-summary-cell :index="1">summary content</s-table-summary-cell>
        </s-table-summary-row>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
  import STable, { STableSummaryCell, STableSummaryRow } from '@surely-vue/table';
  import { Button as AButton } from 'ant-design-vue';
  // import { useWindowSize } from '@vueuse/core';

  interface DataItem {
    title?: string;
    dataIndex?: string;
    fixed?: boolean | 'right' | 'left';
    width?: number;
  }

  const columns: DataItem[] = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      fixed: 'left',
      width: 180,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: 180,
    },
    {
      title: 'Column 1',
      dataIndex: 'address',
      width: 220,
    },
    {
      title: 'Column 2',
      dataIndex: 'address',
      width: 220,
    },
    {
      title: 'Column 3',
      width: 220,
      dataIndex: 'address',
    },
    {
      title: 'Column 4',
      width: 220,
      dataIndex: 'address',
    },
    { title: 'Column 5', dataIndex: 'address', width: 220 },
    { title: 'Column 6', dataIndex: 'address', width: 220 },
    { title: 'Column 7', dataIndex: 'address', width: 220 },
    {
      title: '操作',
      dataIndex: 'action',
      width: 190,
      fixed: 'right',
    },
  ];

  const data: DataItem[] = [];
  for (let i = 0; i < 1000; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: i + 1,
      address: `London Park no. ${i}`,
    });
  }

  // const { height, width } = useWindowSize();
  // console.log('_window.height', height, '_window.width', width);
</script>
