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
} from './systemModel';

enum Api {
  GetRoleListByPage = '/system/getRoles',
  CreateRole = '/system/createRole',
  EditRole = '/system/editRole',
  SetRoleStatus = '/system/setRoleStatus',
  DeleteRole = '/system/deleteRole',
  GetAllMenuList = '/system/getAllMenu',
  CreateMenu = '/system/addMenuItem',
  EditMenu = '/system/editMenuItem',
  DeleteMenu = '/system/deleteMenu',
}

/**
 * @description: 获取角色列表
 */
export const getRoleListByPage = (params?: RolePageParams) =>
  basicHttp.get<RolePageListResultModel>({ url: Api.GetRoleListByPage, params });

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
