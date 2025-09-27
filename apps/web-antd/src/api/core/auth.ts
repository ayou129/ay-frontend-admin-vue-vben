import type { UserVO } from '#/types';

import { requestClient } from '#/api/request';

import { apiPrefix } from './config';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    access_token: string;
    refresh_token: string;
  }

  export interface RefreshTokenResult {
    access_token: string;
    refresh_token: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>(
    `${apiPrefix}/auth/login`,
    data,
  );
}

/**
 * 获取用户信息
 */
export async function getProfileApi() {
  return requestClient.get<UserVO>(`${apiPrefix}/auth/profile`);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return requestClient.post<AuthApi.RefreshTokenResult>(
    `${apiPrefix}/auth/refresh-token`,
    {},
    {
      __skipAuthRefresh: true, // 标记这个请求不需要被认证拦截器处理
    },
  );
}

/**
 * 退出登录 - 已移除真实请求，只做本地清理
 * 不再发送真实的logout请求到服务器
 */
export async function logoutApi() {
  // 不发送真实请求，直接返回成功
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>(`${apiPrefix}/auth/codes`);
}
