import type { GoPageModel } from '@ay-shared-core/types/api';
import type { PageQueryDTO } from '@ay-shared-core/utils/page_query';

import type {
  UserLevelDTO,
  UserLevelModel,
  UserLevelStatusDTO,
} from '#/types/user-level';

import { apiPrefix } from '#/api/config';
import { http } from '#/api/request';

/**
 * 获取用户等级分页列表
 */
export async function getUserLevelPageApi(data: PageQueryDTO) {
  return http.post<GoPageModel<UserLevelModel>>(
    `${apiPrefix}/admin/user-member-level/list/page`,
    data,
  );
}

/**
 * 创建用户等级
 */
export async function createUserLevelApi(data: UserLevelDTO) {
  return http.post(`${apiPrefix}/admin/user-member-level`, data);
}

/**
 * 更新用户等级
 */
export async function updateUserLevelApi(id: number, data: UserLevelDTO) {
  return http.put(`${apiPrefix}/admin/user-member-level/${id}`, data);
}

/**
 * 启停用户等级
 */
export async function changeUserLevelStatusApi(
  id: number,
  data: UserLevelStatusDTO,
) {
  return http.put(`${apiPrefix}/admin/user-member-level/${id}/status`, data);
}

/**
 * 删除用户等级
 */
export async function deleteUserLevelApi(id: number) {
  return http.delete(`${apiPrefix}/admin/user-member-level/${id}`);
}
