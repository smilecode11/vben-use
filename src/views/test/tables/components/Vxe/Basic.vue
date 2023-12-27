<template>
  <div class="basic">
    <vxe-table
      border
      show-overflow
      show-footer
      keep-source
      ref="xTable"
      height="600"
      class="my-xtable-antd"
      :loading="pageData.loading"
      :data="pageData.tableData"
      :footer-method="footerMethod"
      :edit-config="{ trigger: 'dblclick', mode: 'cell' }"
      @edit-closed="editClosedEvent"
    >
      >
      <vxe-column type="checkbox" width="60" />
      <vxe-column type="seq" width="80">
        <template #header>
          <span>序号</span>
        </template>
      </vxe-column>
      <vxe-column field="name" title="AInput" min-width="140" :edit-render="{}">
        <template #edit="scope">
          <a-input v-model:value="scope.row.name" @input="onUpdateWithName(scope)" />
        </template>
      </vxe-column>
      <vxe-column field="role" title="AAutoComplete" min-width="160" :edit-render="{}">
        <template #edit="{ row }">
          <a-auto-complete
            v-model:value="row.role"
            :options="pageData.searchOptions"
            @search="handleSearch"
          />
        </template>
      </vxe-column>
      <vxe-column field="age" title="AInputNumber" width="160" :edit-render="{}">
        <template #header="{ column }">
          <span>{{ column.title }}</span>
        </template>
        <template #edit="{ row }">
          <a-input-number v-model:value="row.age" :max="99" :min="18" />
        </template>
      </vxe-column>
      <vxe-column field="sex" title="ASelect" width="140" :edit-render="{}">
        <template #edit="scope">
          <vxe-select v-model="scope.row.sex" transfer>
            <vxe-option
              v-for="item in pageData.sexList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </vxe-select>
        </template>
        <template #default="{ row }">{{ getSelectLabel(row.sex, pageData.sexList) }}</template>
      </vxe-column>
      <vxe-column field="sex1" title="ASelect" width="180" :edit-render="{}">
        <template #edit="scope">
          <vxe-select v-model="scope.row.sex1" transfer multiple>
            <vxe-option
              v-for="item in pageData.sexList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </vxe-select>
        </template>
        <template #default="{ row }">
          {{ getSelectMultipleLabel(row.sex1, pageData.sexList) }}
        </template>
      </vxe-column>
      <vxe-column field="region" title="ACascader" width="200" :edit-render="{}">
        <template #edit="{ row }">
          <a-cascader v-model:value="row.region" :options="pageData.regionList" />
        </template>
        <template #default="{ row }">
          {{ getCascaderLabel(row.region, pageData.regionList) }}
        </template>
      </vxe-column>
      <vxe-column field="date7" title="ADatePicker" width="200" :edit-render="{}">
        <template #edit="{ row }">
          <a-date-picker v-model:value="row.date7" format="YYYY/MM/DD hh:mm:ss" />
        </template>
        <template #default="{ row }">{{ formatDate(row.date7, 'YYYY/MM/DD hh:mm:ss') }}</template>
      </vxe-column>
      <vxe-column field="rate" title="ARate" width="200">
        <template #default="{ row }">
          <a-rate v-model:value="row.rate" />
        </template>
      </vxe-column>
      <vxe-column field="flag" title="ElSwitch" width="100">
        <template #default="{ row }">
          <a-switch v-model:checked="row.flag" />
        </template>
      </vxe-column>
    </vxe-table>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, reactive } from 'vue';
  import { VxeTableInstance, VxeTablePropTypes, VxeTableEvents, VXETable } from 'vxe-table';
  import {
    Input as AInput,
    AutoComplete as AAutoComplete,
    InputNumber as AInputNumber,
    Cascader as ACascader,
    DatePicker as ADatePicker,
    Rate as ARate,
    Switch as ASwitch,
  } from 'ant-design-vue';

  const xTable = ref({} as VxeTableInstance);

  const pageData = reactive({
    loading: false,
    searchOptions: [] as any[],
    sexList: [] as any[],
    regionList: [] as any[],
    tableData: [] as any[],
  });

  const formatDate = (value: any, format: string) => {
    return value ? value.format(format) : null;
  };

  const getSelectLabel = (value: any, list: any[], valueProp = 'value', labelField = 'label') => {
    const item = list.find((item) => item[valueProp] === value);
    return item ? item[labelField] : null;
  };

  const getSelectMultipleLabel = (
    value: any[],
    list: any[],
    valueProp = 'value',
    labelField = 'label',
  ) => {
    return value
      .map((val) => {
        const item = list.find((item) => item[valueProp] === val);
        return item ? item[labelField] : null;
      })
      .join(', ');
  };

  const getCascaderLabel = (value: any, list: any[]) => {
    const values: any[] = value || [];
    const labels: any[] = [];
    const matchCascaderData = function (index: any, list: any[]) {
      const val = values[index];
      if (list && values.length > index) {
        list.forEach((item) => {
          if (item.value === val) {
            labels.push(item.label);
            matchCascaderData(++index, item.children);
          }
        });
      }
    };
    matchCascaderData(0, list);
    return labels.join(' / ');
  };

  const handleSearch = (value: any) => {
    // TODO: a-auto-complete 组件渲染的数据
    pageData.searchOptions = !value
      ? []
      : [{ value }, { value: value + value }, { value: value + value + value }];
  };

  const createStateFilter = (queryString: string) => {
    return (state: any) => {
      return state.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
    };
  };

  const meanNum = (list: any[], field: string) => {
    let count = 0;
    list.forEach((item) => {
      count += Number(item[field]);
    });
    return count / list.length;
  };

  const sumNum = (list: any[], field: string) => {
    let count = 0;
    list.forEach((item) => {
      count += Number(item[field]);
    });
    return count;
  };

  const footerMethod: VxeTablePropTypes.FooterMethod = ({ columns, data }) => {
    return [
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '平均';
        }
        if (['age', 'rate'].includes(column.property)) {
          return meanNum(data, column.property);
        }
        return null;
      }),
      columns.map((column, columnIndex) => {
        if (columnIndex === 0) {
          return '和值';
        }
        if (['age', 'rate'].includes(column.property)) {
          return sumNum(data, column.property);
        }
        return null;
      }),
    ];
  };

  const onUpdateWithName = (scope) => {
    const { rowIndex } = scope;
    console.log(pageData.tableData[rowIndex]);
    xTable.value.updateStatus(scope);
  };

  const onUpdateWithSex = (scope) => {
    console.log('_onUpdateWithSex', scope);
    xTable.value.updateStatus(scope);
  };

  // TIP: 编辑完成事件监听
  const editClosedEvent: VxeTableEvents.EditClosed = ({ row, column }) => {
    const $table = xTable.value;
    if ($table) {
      const field = column.field;
      const cellValue = row[field];
      // 判断单元格值是否被修改
      if ($table.isUpdateByRow(row, field)) {
        setTimeout(() => {
          VXETable.modal.message({
            content: `局部保存成功！ ${field}=${cellValue}`,
            status: 'success',
          });
          // 局部更新单元格为已保存状态
          $table.reloadRow(row, null, field);
        }, 300);
      }
    }
  };

  onMounted(() => {
    console.log('_vxe table basic');

    //  初始化区域列表
    pageData.regionList = [
      {
        label: '北京',
        value: 1,
        children: [
          { value: 3, label: '东城区' },
          { value: 4, label: '西城区' },
        ],
      },
      {
        label: '上海',
        value: 21,
        children: [
          { value: 23, label: '黄浦区' },
          { value: 24, label: '卢湾区' },
        ],
      },
      {
        label: '广东',
        value: 42,
        children: [
          { value: 43, label: '广州市' },
          { value: 67, label: '深圳市' },
        ],
      },
    ];
    pageData.sexList = [
      { value: '1', label: '男' },
      { value: '0', label: '女' },
    ];

    pageData.loading = true;
    setTimeout(() => {
      pageData.tableData = [
        {
          id: 10001,
          name: 'Test1',
          nickname: 'T1',
          role: 'Develop',
          sex: '0',
          sex1: [],
          region: [],
          age: 28,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 5,
          rate1: 59,
          flag: false,
          address: 'Shenzhen',
        },
        {
          id: 10002,
          name: 'Test2',
          nickname: 'T2',
          role: 'Test',
          sex: '1',
          sex1: [],
          region: [],
          age: 22,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 2,
          rate1: 22,
          flag: false,
          address: 'Guangzhou',
        },
        {
          id: 10003,
          name: 'Test3',
          nickname: 'T3',
          role: 'PM',
          sex: '0',
          sex1: [],
          region: [],
          age: 32,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 3,
          rate1: 12,
          flag: false,
          address: 'Shanghai',
        },
        {
          id: 10004,
          name: 'Test4',
          nickname: 'T4',
          role: 'Designer',
          sex: '0',
          sex1: ['1', '0'],
          region: [],
          age: 23,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          color1: '',
          tree1: '',
          tree2: [],
          date7: '',
          rate: 33,
          rate1: 4,
          flag: true,
          address: 'Shenzhen',
        },
        {
          id: 10005,
          name: 'Test5',
          nickname: 'T5',
          role: 'Develop',
          sex: '0',
          sex1: ['1', '0'],
          region: [],
          age: 30,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          color1: '',
          tree1: '',
          tree2: [],
          date7: '',
          rate: 0,
          rate1: 15,
          flag: true,
          address: 'Shanghai',
        },
        {
          id: 10006,
          name: 'Test6',
          nickname: 'T6',
          role: 'Designer',
          sex: '0',
          sex1: [],
          region: [],
          age: 21,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 3,
          rate1: 73,
          flag: false,
          address: 'Shenzhen',
        },
        {
          id: 10007,
          name: 'Test7',
          nickname: 'T7',
          role: 'Test',
          sex: '1',
          sex1: ['1'],
          region: [],
          age: 29,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 0,
          rate1: 0,
          flag: true,
          address: 'Guangzhou',
        },
        {
          id: 10008,
          name: 'Test8',
          nickname: 'T8',
          role: 'Develop',
          sex: '1',
          sex1: [],
          region: [],
          age: 35,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 2,
          rate1: 14,
          flag: false,
          address: 'Shenzhen',
        },
        {
          id: 10009,
          name: 'Test9',
          nickname: 'T9',
          role: 'Test',
          sex: '1',
          sex1: ['0'],
          region: [],
          age: 24,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 3,
          rate1: 52,
          flag: false,
          address: 'Shenzhen',
        },
        {
          id: 100010,
          name: 'Test10',
          nickname: 'T10',
          role: 'Develop',
          sex: '1',
          sex1: [],
          region: [],
          age: 20,
          date: '',
          date1: '',
          date2: '',
          date3: '',
          date4: [],
          date5: '',
          date7: '',
          color1: '',
          tree1: '',
          tree2: [],
          rate: 4,
          rate1: 83,
          flag: false,
          address: 'Guangzhou',
        },
      ];

      pageData.loading = false;
    }, 700);
  });
</script>
