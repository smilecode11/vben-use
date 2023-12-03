<template>
  <PageWrapper dense contentFullHeight fixedHeight contentClass="flex">
    <DeptTree class="w-1/4 xl:w-1/5" @select="handleSelect" />
    <BasicTable @register="registerTable" class="w-3/4 xl:w-4/5" :searchInfo="searchInfo">
      <template #toolbar>
        <!-- TIP: 细粒度权限测试代码 -->
        <a-button type="warning" v-if="hasPermission(['10001'])" @click="testAuth">
          细粒度权限10001
        </a-button>
        <a-button type="error" v-if="hasPermission(['10002', '10003'])" @click="testAuth">
          细粒度权限10002
        </a-button>
        <a-button type="primary" @click="handleCreate">新增账号</a-button>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <TableAction
            :actions="[
              {
                icon: 'clarity:info-standard-line',
                tooltip: '查看用户详情',
                onClick: handleView.bind(null, record),
              },
              {
                icon: 'clarity:note-edit-line',
                tooltip: '编辑用户资料',
                onClick: handleEdit.bind(null, record),
              },
              {
                icon: 'ant-design:delete-outlined',
                color: 'error',
                tooltip: '删除此账号',
                popConfirm: {
                  title: `是否确认删除【${record.account}】`,
                  placement: 'left',
                  confirm: handleDelete.bind(null, record),
                },
              },
            ]"
          />
        </template>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" @success="handleSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { reactive } from 'vue';
  import { BasicTable, useTable, TableAction } from '@/components/Table';
  import { getAccountListByPage, deleteAccount } from '@/api/basics/system';
  import { PageWrapper } from '@/components/Page';
  import { useModal } from '@/components/Modal';
  import DeptTree from './DeptTree.vue';
  import AccountModal from './AccountModal.vue';

  import { columns, searchFormSchema } from './account.data';
  import { useGo } from '@/hooks/web/usePage';
  import { useMessage } from '@/hooks/web/useMessage';
  import { usePermission } from '@/hooks/web/usePermission';

  defineOptions({ name: 'AccountManagement' });
  const { createMessage } = useMessage();
  const { hasPermission } = usePermission();
  const go = useGo();
  const [registerModal, { openModal }] = useModal();
  const searchInfo = reactive<Recordable>({});
  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '账号列表',
    api: getAccountListByPage,
    rowKey: 'id',
    columns,
    formConfig: {
      labelWidth: 120,
      schemas: searchFormSchema,
      autoSubmitOnEnter: true,
    },
    useSearchForm: true,
    showTableSetting: true,
    bordered: true,
    handleSearchInfoFn(info) {
      console.log('handleSearchInfoFn', info);
      return info;
    },
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      // slots: { customRender: 'action' },
    },
  });

  function testAuth() {
    console.log('_Test AUTH');
  }

  function handleCreate() {
    openModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    // console.log(record);
    openModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleDelete(record: Recordable) {
    // console.log(record);
    deleteAccount({ id: record.id })
      .then(() => {
        createMessage.success('删除成功');
        reload();
      })
      .catch((e) => {
        console.log('_deleteDept catch', e);
      });
  }

  function handleSuccess({ isUpdate, values }) {
    // console.log('_account handleSuccess', isUpdate, values);
    if (isUpdate) {
      // 演示不刷新表格直接更新内部数据。
      // 注意：updateTableDataRecord要求表格的rowKey属性为string并且存在于每一行的record的keys中
      const result = updateTableDataRecord(values.id, values);
      console.log(result);
      createMessage.success('编辑成功');
    } else {
      createMessage.success('新增成功');
      reload();
    }
  }

  function handleSelect(deptId = '') {
    searchInfo.deptId = deptId;
    reload();
  }

  function handleView(record: Recordable) {
    go('/system/account_detail/' + record.id);
  }
</script>
