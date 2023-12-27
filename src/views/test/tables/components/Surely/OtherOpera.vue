<template>
  <div class="basic">
    <!-- 
       表头合并，对 columns 进行 tree 层级操作 
       自定义 tip 需要再 columns 手动添加 tooltip 属性声明
       设置 contextmenuPopup 插槽，启用右键菜单功能
       通过 column.showMenu 配置是否显示菜单，通过插槽 menuIcon menuPopup 分别自定义菜单图标和菜单内容
     -->
    <s-table :columns="columns" :data-source="data" :scroll="{ y: 520 }" bordered summary-fixed>
      <template #bodyCell="{ column }">
        <template v-if="column.dataIndex === 'action'">
          <a-button type="warning" size="small" class="mr-1">查看</a-button>
          <a-button type="primary" size="small" class="mr-1">编辑</a-button>
          <a-button type="error" size="small">删除</a-button>
        </template>
      </template>
      <!-- tooltipTitle 提示插槽 -->
      <template #tooltipTitle="{ value }">
        <home-two-tone />
        {{ value }}
      </template>
      <!-- contextmenuPopup 右键菜单插槽 -->
      <template #contextmenuPopup="args">
        <ul class="popup">
          <li
            class="popup-item"
            :class="args?.column?.key === 'operation' && 'disabled'"
            @click="copyClick(args, 'cell')"
          >
            <copy-outlined />
            复制
          </li>
          <li class="popup-item" @click="copyClick(args, 'record')">
            <copy-outlined />
            复制整行
          </li>
          <li
            class="popup-item"
            :class="args?.column?.key === 'operation' && 'disabled'"
            @click="copyClick(args, 'column')"
          >
            <copy-outlined />
            复制整列
          </li>
        </ul>
      </template>
      <!-- 表头菜单 -->
      <template #menuIcon="{ filtered }">
        <menu-outlined :class="filtered && 'filter-active'" />
      </template>
      <template
        #menuPopup="{ column, filter: { setSelectedKeys, selectedKeysRef, confirm, clearFilters } }"
      >
        <a-tabs :active-key="titleActive">
          <a-tab-pane key="1">
            <template #tab>
              <span style="padding: 0 16px"> 111 </span>
            </template>
            1111
          </a-tab-pane>
          <a-tab-pane key="2">
            <template #tab>
              <span style="padding: 0 16px">
                <bars-outlined />
                列
              </span>
            </template>
            <div class="menu-popup-container">
              <ul class="menu-popup">
                <li class="menu-popup-item" style="border-bottom: 1px solid #f0f0f0">
                  <a-checkbox v-model:checked="checkedAll" :indeterminate="indeterminate">
                    全选 / 取消选择
                  </a-checkbox>
                </li>
                <template v-for="menu in menus" :key="menu.column">
                  <li class="menu-popup-item">
                    <a-checkbox
                      v-model:checked="menu.checked"
                      style="width: 100%"
                      :disabled="!!menu.disabled"
                    >
                      {{ menu.column }}
                    </a-checkbox>
                  </li>
                </template>
              </ul>
            </div>
          </a-tab-pane>
        </a-tabs>
      </template>
    </s-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import STable, { SurelyTableProps, ContextmenuPopupArg } from '@surely-vue/table';
  import {
    Button as AButton,
    message,
    Checkbox as ACheckbox,
    Tabs as ATabs,
    TabPane as ATabPane,
  } from 'ant-design-vue';
  import { HomeTwoTone, CopyOutlined, MenuOutlined } from '@ant-design/icons-vue';

  interface DataItem {
    title?: string;
    dataIndex?: string;
    fixed?: boolean | 'right' | 'left';
    width?: number;
  }

  const columns: SurelyTableProps['columns'] = [
    {
      title: 'Full Name',
      dataIndex: 'name',
      fixed: 'left',
      width: 180,
      tooltip: { title: ({ value }) => value, color: '#f50', placement: 'topLeft' },
      showMenu: true,
    },
    {
      title: '合并表头演示',
      children: [
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
        {
          title: '操作',
          dataIndex: 'action',
          width: 190,
          fixed: 'right',
        },
      ],
    },
  ];

  const data: DataItem[] = [];
  for (let i = 0; i < 100; i++) {
    data.push({
      key: i,
      name: `Edrward ${i}`,
      age: i + 1,
      address: `London Park no. ${i}`,
    });
  }

  const copyValue = (val) => {
    console.log('copyValue', val);
    const input = document.createElement('input');
    input.setAttribute('readonly', 'readonly');
    input.setAttribute('value', val);
    document.body.appendChild(input);
    input.select();
    if (document.execCommand('copy')) {
      document.execCommand('copy');
      message.info('复制成功');
    }
    document.body.removeChild(input);
  };

  const copyClick = (args: ContextmenuPopupArg<any, any>, type: 'cell' | 'column' | 'record') => {
    console.log('_copyClick', args, type);
    if (type === 'cell') {
      if (args.column.key === 'operation') return;
      copyValue(args.text);
    } else if (type === 'column') {
      if (args.column.key === 'operation') return;
      const { dataIndex } = args.column;
      copyValue(data.map((d) => d[dataIndex]).join('\r\n'));
    } else {
      const record = args.record;
      copyValue(
        columns
          .map((c: any) => (c.dataIndex ? record[c.dataIndex] : ''))
          .filter((c) => !!c)
          .join(' '),
      );
    }
    // 3.0.1 新增
    args.hidePopup();
  };

  const titleActive = ref('2');
  const menus = ref([
    {
      column: 'No.',
      checked: true,
      disabled: true,
    },
    { column: 'name', checked: true },
    { column: 'age', checked: true },
    { column: 'address', checked: true },
  ]);

  const checkedAll = computed({
    get() {
      return menus.value.every((menu) => menu.checked);
    },
    set(value: boolean) {
      menus.value.forEach((menu) => {
        if (!menu.disabled) {
          menu.checked = value;
        }
      });
    },
  });
  const indeterminate = computed(() => {
    const checkedCount = menus.value.filter((menu) => menu.checked).length;
    return checkedCount > 0 && checkedCount < menus.value.length;
  });
</script>

<style lang="less" scope>
  .popup {
    width: 120px;
    .popup-item {
      cursor: pointer;
      padding: 8px;
      &:hover {
        background-color: var(--surely-table-row-hover-bg);
      }
      &.disabled {
        color: var(--surely-table-disabled-color);
        cursor: not-allowed;
      }
    }
  }

  .filter-active {
    color: var(--surely-table-primary-color) !important;
    opacity: 1 !important;
  }
  .menu-popup-container {
    max-height: 200px;
    overflow-y: auto;
    padding: 4px 0;
  }
  .menu-popup {
    width: 100%;
    .menu-popup-item {
      width: 100%;
      padding: 4px 8px;
      &:hover {
        background-color: var(--surely-table-row-hover-bg);
      }
      &.disabled {
        color: var(--surely-table-disabled-color);
        cursor: not-allowed;
      }
    }
  }
</style>
