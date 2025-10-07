import type { PhpPageResponse, RequestGetPageQuery, UserModel } from '#/types';

import { http } from '#/api/request';

import { apiPrefix } from '../config';

/**
 * 获取用户分页列表
 */
export async function getUserPageApi(data: RequestGetPageQuery) {
  return http.post<PhpPageResponse<UserModel>>(
    `${apiPrefix}/user/list/page`,
    data,
  );
}

/**
 * 创建用户
 */
export async function createUserApi(data: Partial<UserModel>) {
  return http.post<UserModel>(`${apiPrefix}/user`, data);
}

/**
 * 更新用户
 */
export async function updateUserApi(id: number, data: Partial<UserModel>) {
  return http.put<UserModel>(`${apiPrefix}/user/${id}`, data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(id: number) {
  return http.delete<boolean>(`${apiPrefix}/user/${id}`);
}
