import { basicHttp } from '@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './userModel';
import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetUserMenuList = '/getMenuList',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
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
 * @description: 获取登录用户信息
 */
export function getUserInfo() {
  return basicHttp.get<GetUserInfoModel>({
    url: Api.GetUserInfo,
    transformResponse: (resp) => {
      // console.log('_transformResponse getUserInfo', resp);
      const fmtResp = JSON.parse(resp);
      fmtResp.data.username = fmtResp?.data?.nickname;
      fmtResp.data.realName = fmtResp?.data?.nickname;
      fmtResp.data.userId = fmtResp?.data?.id;
      return fmtResp;
    },
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
