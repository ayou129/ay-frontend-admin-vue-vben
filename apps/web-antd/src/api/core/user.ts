import type {
  ApiResponse,
  CustomPageResponse,
  RequestGetPageQuery,
  UserVO,
} from '#/types';

import { requestClient } from '#/api/request';

import { apiPrefix } from './config';

/**
 * 获取用户分页列表
 */
export async function getUserPageApi(data: RequestGetPageQuery) {
  return requestClient.post<ApiResponse<CustomPageResponse<UserVO>>>(
    `${apiPrefix}/user/page`,
    data,
  );
}

/**
 * 创建用户
 */
export async function createUserApi(data: Partial<UserVO>) {
  return requestClient.post<UserVO>(`${apiPrefix}/user`, data);
}

/**
 * 更新用户
 */
export async function updateUserApi(id: number, data: Partial<UserVO>) {
  return requestClient.put<UserVO>(`${apiPrefix}/user/${id}`, data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(id: number) {
  return requestClient.delete<boolean>(`${apiPrefix}/user/${id}`);
}
