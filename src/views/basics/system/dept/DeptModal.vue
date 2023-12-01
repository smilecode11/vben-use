<template>
  <BasicModal v-bind="$attrs" @register="registerModal" :title="getTitle" @ok="handleSubmit">
    <BasicForm @register="registerForm" />
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '@/components/Modal';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from './dept.data';

  // import { getDeptList } from '@/api/demo/system';
  import { DeptListItem } from '@/api/basics/system/systemModel';
  import { getAllDeptList, createDept, editDept } from '@/api/basics/system/index';
  import { usePropNameSet } from '@/hooks/custom/usePropNameSet';

  defineOptions({ name: 'DeptModal' });

  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);
  const { findCurNodeAndSetDisabled } = usePropNameSet();
  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner(async (data) => {
    resetFields();
    setModalProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
    let treeData = await getAllDeptList({});
    treeData = [{ id: 0, deptName: '顶级部门' }, ...treeData];
    // TIP: 处理部门结构，编辑时当前部门及下级不可选
    let currDeptId = data.record?.id;
    if (currDeptId) {
      findCurNodeAndSetDisabled(treeData, currDeptId, 'id', null);
    }
    updateSchema({
      field: 'parentDept',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增部门' : '编辑部门'));

  async function handleSubmit() {
    try {
      const values = await validate<DeptListItem>();
      setModalProps({ confirmLoading: true });
      // console.log('_handleSubmit dept', values);
      !unref(isUpdate) ? await createDept(values) : await editDept(values);
      closeModal();
      emit('success');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
