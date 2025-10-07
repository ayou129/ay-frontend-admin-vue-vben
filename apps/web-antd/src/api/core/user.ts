import { http } from '#/api/request';

import { apiPrefix } from '../config';

/**
 * 获取用户分页列表
 */
export async function getUserPageApi(data: RequestGetPageQuery) {
  return http.post<PhpPageResponse<UserVO>>(
    `${apiPrefix}/user/list/page`,
    data,
  );
}

/**
 * 创建用户
 */
export async function createUserApi(data: Partial<UserVO>) {
  return http.post<UserVO>(`${apiPrefix}/user`, data);
}

/**
 * 更新用户
 */
export async function updateUserApi(id: number, data: Partial<UserVO>) {
  return http.put<UserVO>(`${apiPrefix}/user/${id}`, data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(id: number) {
  return http.delete<boolean>(`${apiPrefix}/user/${id}`);
}
