import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

import { apiPrefix } from './config';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>(`${apiPrefix}/auth/profile`);
}
