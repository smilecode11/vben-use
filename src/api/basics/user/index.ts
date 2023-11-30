import { basicHttp } from '@/utils/http/axios';
import { ErrorMessageMode } from '#/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './userModel';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetUserMenuList = '/getMenuList',
  GetPermCode = '/getPermCode',
  // TestRetry = '/testRetry',
}

/**
 * @description: 用户登录
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return basicHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 用户登出
 */
export function logoutApi() {
  return basicHttp.get<LoginResultModel>({
    url: Api.Logout,
  });
}

/**
 * @description: 获取登录用户信息
 */
export function getUserInfo() {
  return basicHttp.get<GetUserInfoModel>({
    url: Api.GetUserInfo,
  });
}

/**
 * @description: 获取登录用户Code码
 */
export function getPermCode() {
  return basicHttp.get({
    url: Api.GetPermCode,
  });
}

/**
 * @description: 获取登录用户菜单列表
 */
export function getMenuList() {
  return basicHttp.get({
    url: Api.GetUserMenuList,
  });
}
