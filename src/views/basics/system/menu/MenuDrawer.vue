<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from './menu.data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  // import { getMenuList } from '@/api/demo/system';
  import { getAllMenuList, editMenu, createMenu } from '@/api/basics/system';
  import { MenuListItem } from '@/api/basics/system/systemModel';
  import { usePropNameSet } from '@/hooks/custom/usePropNameSet';

  defineOptions({ name: 'MenuDrawer' });

  const { findCurNodeAndSetDisabled } = usePropNameSet();
  const emit = defineEmits(['success', 'register']);

  const isUpdate = ref(true);

  const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
    labelWidth: 100,
    schemas: formSchema,
    showActionButtonGroup: false,
    baseColProps: { lg: 12, md: 24 },
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
    let treeData = await getAllMenuList({});
    let currMenuId = data.record?.id;
    treeData = [{ id: 0, menuName: '顶级菜单' }, ...treeData];
    // TIP: 编辑时需剔除当前菜单及其下级菜单（disabled）
    if (currMenuId) {
      findCurNodeAndSetDisabled(treeData, currMenuId, 'id', null);
    }
    // console.log('_treeData fmt', treeData);
    updateSchema({
      field: 'parentMenu',
      componentProps: { treeData },
    });
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

  async function handleSubmit() {
    try {
      const values = await validate<MenuListItem>();
      setDrawerProps({ confirmLoading: true });
      // console.log(values);
      //  创建|编辑菜单
      !unref(isUpdate) ? await createMenu(values) : await editMenu(values);

      closeDrawer();
      emit('success');
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
