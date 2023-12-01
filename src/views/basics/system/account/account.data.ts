import { getAllRoleList /* , isAccountExist  */, getDeptList } from '@/api/basics/system';
import { BasicColumn, FormSchema } from '@/components/Table';
import { h } from 'vue';
import { Time } from '@/components/Time';

//  角色列表
export const allRolePromise = (async () => {
  const roles = (await getAllRoleList()).map((item) => ({ id: item.id, roleName: item.roleName }));
  return roles;
})();
const allRoleList = (await allRolePromise) || [];
// console.log('_allRoleList', allRoleList);

//  部门列表
export const allDeptPromise = (async () => {
  const depts = [
    { id: 0, deptName: '未分配部门' },
    ...(await getDeptList({})).items.map((item) => ({
      id: item.id,
      deptName: item.deptName,
    })),
  ];
  return depts;
})();
const allDeptList = (await allDeptPromise) || [];
// console.log('_allDeptList', allDeptList);

export const columns: BasicColumn[] = [
  {
    title: '用户名',
    dataIndex: 'account',
    width: 120,
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    width: 120,
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    width: 120,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 180,
    customRender: ({ record }) => {
      return h(Time, {
        value: record.createdAt,
        mode: 'datetime',
      });
    },
  },
  {
    title: '角色',
    dataIndex: 'role',
    width: 200,
    customRender: ({ value }) => allRoleList.find((item) => item.id == value)?.roleName,
  },
  {
    title: '所属部门',
    dataIndex: 'dept',
    customRender: ({ value }) => {
      return allDeptList.find((item) => item.id == value)?.deptName;
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

export const searchFormSchema: FormSchema[] = [
  {
    field: 'account',
    label: '用户名',
    component: 'Input',
    colProps: { span: 8 },
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    colProps: { span: 8 },
  },
];

export const accountFormSchema: FormSchema[] = [
  {
    field: 'id',
    label: '用户ID',
    component: 'Input',
    show: false,
  },
  {
    field: 'account',
    label: '用户名',
    component: 'Input',
    // helpMessage: ['本字段演示异步验证', '不能输入带有admin的用户名'],
    rules: [
      {
        required: true,
        message: '请输入用户名',
      },
      // {
      //   trigger: 'blur',
      //   validator(_, value) {
      //     return new Promise((resolve, reject) => {
      //       if (!value) return resolve();
      //       isAccountExist({ account: value, id: (_ as any).id })
      //         .then(resolve)
      //         .catch((err) => {
      //           reject(err.message || '验证失败');
      //         });
      //     });
      //   },
      // },
    ],
  },
  {
    field: 'pwd',
    label: '登录密码',
    component: 'InputPassword',
    required: true,
  },
  // {
  //   field: 'pwd',
  //   label: '密码',
  //   component: 'InputPassword',
  //   required: true,
  //   ifShow: false,
  // },
  {
    label: '角色',
    field: 'role',
    component: 'ApiSelect',
    componentProps: {
      api: getAllRoleList,
      labelField: 'roleName',
      valueField: 'id',
    },
    required: true,
  },
  {
    field: 'dept',
    label: '所属部门',
    component: 'TreeSelect',
    componentProps: {
      fieldNames: {
        label: 'deptName',
        key: 'id',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    // required: true,
  },
  {
    field: 'nickname',
    label: '昵称',
    component: 'Input',
    required: true,
  },

  {
    label: '邮箱',
    field: 'email',
    component: 'Input',
    required: true,
  },

  {
    label: '备注',
    field: 'remark',
    component: 'InputTextArea',
  },
];
