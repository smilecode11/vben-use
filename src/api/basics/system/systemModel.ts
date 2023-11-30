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
