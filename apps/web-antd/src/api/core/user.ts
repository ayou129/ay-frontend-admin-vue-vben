import type { GoPageModel } from '@ay-shared-core/types/api';
import type { UserModel } from '@ay-shared-core/types/user';
import type { PageQueryDTO } from '@ay-shared-core/utils/page_query';

import { http } from '#/api/request';

import { apiPrefix } from '../config';

/**
 * 获取用户分页列表（管理员）
 */
export async function getUserPageApi(data: PageQueryDTO) {
  return http.post<GoPageModel<UserModel>>(
    `${apiPrefix}/admin/user/list/page`,
    data,
  );
}

/**
 * 创建用户
 */
export async function createUserApi(data: Partial<UserModel>) {
  return http.post<UserModel>(`${apiPrefix}/admin/user`, data);
}

/**
 * 更新用户
 */
export async function updateUserApi(id: number, data: Partial<UserModel>) {
  return http.put<UserModel>(`${apiPrefix}/admin/user/${id}`, data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(id: number) {
  return http.delete<boolean>(`${apiPrefix}/admin/user/${id}`);
}
