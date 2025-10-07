import type { PhpPageResponse, RequestGetPageQuery } from '#/types';
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
export async function getUserLevelPageApi(data: RequestGetPageQuery) {
  return http.post<PhpPageResponse<UserLevelModel>>(
    `${apiPrefix}/user-member-level/list/page`,
    data,
  );
}

/**
 * 创建用户等级
 */
export async function createUserLevelApi(data: UserLevelDTO) {
  return http.post(`${apiPrefix}/user-member-level`, data);
}

/**
 * 更新用户等级
 */
export async function updateUserLevelApi(id: number, data: UserLevelDTO) {
  return http.put(`${apiPrefix}/user-member-level/${id}`, data);
}

/**
 * 启停用户等级
 */
export async function changeUserLevelStatusApi(
  id: number,
  data: UserLevelStatusDTO,
) {
  return http.put(`${apiPrefix}/user-member-level/${id}/status`, data);
}

/**
 * 删除用户等级
 */
export async function deleteUserLevelApi(id: number) {
  return http.delete(`${apiPrefix}/user-member-level/${id}`);
}
