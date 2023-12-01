import { BasicPageParams, BasicFetchResult } from '@/api/model/baseModel';

export type RoleParams = {
  roleName?: string;
  status?: string;
};

/**
 * @description: 角色项模型
 */
export interface RoleListItem {
  roleName: string;
  roleValue: string;
  status: string;
  remark: string;
  menu: number[];
  id?: string | number;
  createTime?: string;
}
export type RolePageParams = BasicPageParams & RoleParams;
export type RolePageListResultModel = BasicFetchResult<RoleListItem>;
export type RoleCreateResultModel = {
  id: string;
};

/**
 * @description: 菜单项模型
 */
export interface MenuListItem {
  id: string | number;
  menuName: string;
  parentMenu?: number | string;
  type?: '0' | '1' | '2';
  menuEnName?: string;
  routePath?: string;
  redirectRoutePath?: string;
  keepalive?: string;
  isExt?: string;
  orderNo?: number;
  show?: string;
  status?: string;
  icon?: string;
  createdAt?: string;
  children?: MenuListItem[];
}
export type MenuListResultModel = MenuListItem[];
export type MenuCreateResultModel = RoleCreateResultModel;

/**
 * @description: 部门项模型
 */
export interface DeptListItem {
  deptName: string;
  id: string | number;
  parentDept?: number | string;
  type?: '0' | '1' | '2';
  orderNo?: number;
  status?: string;
  createdAt?: string;
  children?: DeptListItem[];
}
export type DeptListResultModel = DeptListItem[];
export type DeptCreateResultModel = RoleCreateResultModel;
export type DeptPageListResultModel = BasicFetchResult<DeptListItem>;

/**
 * @description: 账号项模型
 */
export type AccountParams = {
  deptId?: number;
  account?: string;
  status?: string;
};

export interface AccountListItem {
  account: string;
  nickname?: string;
  email?: string;
  remark?: string;
  role?: string;
  dept?: string;
  id?: string | number;
  status: '0' | '1' | '2';
  createdAt?: string;
}
export type AccountPageParams = BasicPageParams & AccountParams;
export type AccountPageListResultModel = BasicFetchResult<AccountListItem>;
export type AccountCreateResultModel = {
  id: string;
};
