import type {
  CustomPageResponse,
  RequestFilterQuery,
  UserDTO,
  UserVO,
} from '#/types/user';

import { requestClient } from '#/api/request';

import { apiPrefix } from './config';

export namespace UserManagementApi {
  export interface PageParams {
    page: number;
    page_size: number;
    filters?: RequestFilterQuery[];
  }
}

/**
 * 获取用户分页列表
 */
export async function getUserPageApi(params: UserManagementApi.PageParams) {
  return requestClient.post<CustomPageResponse<UserVO>>(
    `${apiPrefix}/user-management/page`,
    params,
  );
}

/**
 * 创建用户
 */
export async function createUserApi(data: UserDTO) {
  return requestClient.post<UserVO>(`${apiPrefix}/user-management`, data);
}

/**
 * 更新用户
 */
export async function updateUserApi(id: number, data: UserDTO) {
  return requestClient.put<UserVO>(`${apiPrefix}/user-management/${id}`, data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(id: number) {
  return requestClient.delete<boolean>(`${apiPrefix}/user-management/${id}`);
}
