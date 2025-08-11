import type { UserVO } from '#/types';

import { baseRequestClient, requestClient } from '#/api/request';

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
    `${apiPrefix}/auth/refresh`,
    {
      withCredentials: true,
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post<null>(`${apiPrefix}/auth/logout`, {
    withCredentials: true,
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>(`${apiPrefix}/auth/codes`);
}
