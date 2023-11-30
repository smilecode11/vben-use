<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <!-- 菜单分配 -->
      <template #menu="{ model, field }">
        <!-- 
          :checkedKeys="model[field]"
         -->
        <BasicTree
          v-model:value="model[field]"
          :treeData="treeData"
          :check-strictly="true"
          :fieldNames="{ title: 'menuName', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '@/components/Form';
  import { formSchema } from './role.data';
  import { BasicDrawer, useDrawerInner } from '@/components/Drawer';
  import { BasicTree, TreeItem } from '@/components/Tree';

  // import { getMenuList } from '@/api/demo/system';
  import { getAllMenuList } from '@/api/basics/system';

  import { createRole, editRole } from '@/api/basics/system/index';
  import { RoleListItem } from '@/api/basics/system/systemModel';

  const emit = defineEmits(['success', 'register']);
  const isUpdate = ref(true);
  const treeData = ref<TreeItem[]>([]);

  const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
    labelWidth: 90,
    baseColProps: { span: 24 },
    schemas: formSchema,
    showActionButtonGroup: false,
  });

  const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
    resetFields();
    setDrawerProps({ confirmLoading: false });
    // 需要在setFieldsValue之前先填充treeData，否则Tree组件可能会报key not exist警告
    if (unref(treeData).length === 0) {
      treeData.value = (await getAllMenuList({})) as any as TreeItem[];
    }
    isUpdate.value = !!data?.isUpdate;

    if (unref(isUpdate)) {
      setFieldsValue({
        ...data.record,
      });
    }
  });

  const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

  async function handleSubmit() {
    try {
      const values = await validate<RoleListItem>();
      setDrawerProps({ confirmLoading: true });
      //  处理菜单tree值为number[]
      values.menu = values.menu['checked'];
      console.log('_values', values);
      //  创建|编辑角色
      !unref(isUpdate) ? await createRole(values) : await editRole(values);
      closeDrawer();
      emit('success');
    } catch (e) {
      console.log('_role catch', e);
    } finally {
      setDrawerProps({ confirmLoading: false });
    }
  }
</script>
