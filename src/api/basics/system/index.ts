import { basicHttp } from '@/utils/http/axios';
// import { ErrorMessageMode } from '#/axios';
import {
  RolePageParams,
  RolePageListResultModel,
  RoleListItem,
  RoleCreateResultModel,
  MenuListItem,
  MenuListResultModel,
  MenuCreateResultModel,
  DeptListItem,
  DeptListResultModel,
  DeptCreateResultModel,
  DeptPageListResultModel,
  AccountPageParams,
  AccountPageListResultModel,
  AccountListItem,
  AccountCreateResultModel,
} from './systemModel';

enum Api {
  GetRoleListByPage = '/system/getRoles',
  GetAllRoleList = '/system/getAllRoleList',
  CreateRole = '/system/createRole',
  EditRole = '/system/editRole',
  SetRoleStatus = '/system/setRoleStatus',
  DeleteRole = '/system/deleteRole',
  GetAllMenuList = '/system/getAllMenu',
  CreateMenu = '/system/addMenuItem',
  EditMenu = '/system/editMenuItem',
  DeleteMenu = '/system/deleteMenu',
  GetAllDeptList = '/system/getAllDept',
  GetDeptList = '/system/getDeptList',
  CreateDept = '/system/addDept',
  EditDept = '/system/editDept',
  DeleteDept = '/system/deleteDept',
  GetAccountListByPage = '/system/getAccountList',
  CreateAccount = '/system/addAccount',
  EditAccount = '/system/editAccount',
  SetAccountStatus = '/system/setAccountStatus',
  DeleteAccount = '/system/deleteAccount',
  IsAccountExist = '/system/isAccountExist',
  EditPassword = '/system/editPassword',
}

/**
 * @description: 获取角色列表
 */
export const getRoleListByPage = (params?: RolePageParams) =>
  basicHttp.get<RolePageListResultModel>({ url: Api.GetRoleListByPage, params });

/**
 * @description: 获取全部角色列表
 */
export const getAllRoleList = (params?: RolePageParams) =>
  basicHttp.get<RoleListItem[]>({ url: Api.GetAllRoleList, params });

/**
 * @description: 新建角色
 */
export const createRole = (params?: RoleListItem) =>
  basicHttp.post<RoleCreateResultModel>({ url: Api.CreateRole, params });

/**
 * @description: 编辑角色
 */
export const editRole = (params?: RoleListItem) =>
  basicHttp.post<RoleCreateResultModel>({ url: Api.EditRole, params });

/**
 * @description: 编辑角色（状态）
 */
export const setRoleStatus = (params: { id: number; status: string }) =>
  basicHttp.post<RoleCreateResultModel>({ url: Api.SetRoleStatus, params });

/**
 * @description: 删除角色
 */
export const deleteRole = (params: { id: number }) =>
  basicHttp.post<RoleCreateResultModel>({ url: Api.DeleteRole, params });

/**
 * @description: 获取菜单列表
 */
export const getAllMenuList = (params: { menuName?: string; status?: string }) =>
  basicHttp.get<MenuListResultModel>({ url: Api.GetAllMenuList, params });

/**
 * @description: 新增菜单项
 */
export const createMenu = (params?: MenuListItem) =>
  basicHttp.post<MenuCreateResultModel>({ url: Api.CreateMenu, params });

/**
 * @description: 编辑菜单项
 */
export const editMenu = (params?: MenuListItem) =>
  basicHttp.post<MenuCreateResultModel>({ url: Api.EditMenu, params });

/**
 * @description: 删除菜单项
 */
export const deleteMenu = (params: { id: number }) =>
  basicHttp.post<MenuCreateResultModel>({ url: Api.DeleteMenu, params });

/**
 * @description: 获取部门列表(tree)
 */
export const getAllDeptList = (params: { deptName?: string; status?: string }) =>
  basicHttp.get<DeptListResultModel>({ url: Api.GetAllDeptList, params });

/**
 * @description: 获取部门列表
 */
export const getDeptList = (params: { deptName?: string; status?: string }) =>
  basicHttp.get<DeptPageListResultModel>({ url: Api.GetDeptList, params });

/**
 * @description: 新增部门项
 */
export const createDept = (params?: DeptListItem) =>
  basicHttp.post<DeptCreateResultModel>({ url: Api.CreateDept, params });

/**
 * @description: 编辑部门项
 */
export const editDept = (params?: DeptListItem) =>
  basicHttp.post<DeptCreateResultModel>({ url: Api.EditDept, params });

/**
 * @description: 删除部门项
 */
export const deleteDept = (params: { id: number }) =>
  basicHttp.post<DeptCreateResultModel>({ url: Api.DeleteDept, params });

/**
 * @description: 获取账号列表
 */
export const getAccountListByPage = (params?: AccountPageParams) =>
  basicHttp.get<AccountPageListResultModel>({ url: Api.GetAccountListByPage, params });

/**
 * @description: 新建账号
 */
export const createAccount = (params?: AccountListItem) =>
  basicHttp.post<AccountCreateResultModel>({ url: Api.CreateAccount, params });

/**
 * @description: 编辑账号
 */
export const editAccount = (params?: AccountListItem) =>
  basicHttp.post<AccountCreateResultModel>({ url: Api.EditAccount, params });

/**
 * @description: 编辑账号（状态）
 */
export const setAccountStatus = (params: { id: number; status: string }) =>
  basicHttp.post<AccountCreateResultModel>({ url: Api.SetAccountStatus, params });

/**
 * @description: 删除账号
 */
export const deleteAccount = (params: { id: number }) =>
  basicHttp.post<AccountCreateResultModel>({ url: Api.DeleteAccount, params });

/**
 * @description: 账号是否存在
 */
export const isAccountExist = (params: { account: string; id?: number }) =>
  basicHttp.post({ url: Api.IsAccountExist, params });

/**
 * @description: 密码修改
 */
export const editPassword = (params: any) =>
  basicHttp.post<AccountListItem>({ url: Api.EditPassword, params });
