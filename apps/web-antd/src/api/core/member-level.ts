import type {
  MemberLevelDTO,
  MemberLevelStatusDTO,
  MemberLevelVO,
  PhpPageResponse,
  RequestGetPageQuery,
} from '#/types';

import { requestClient } from '#/api/request';

import { apiPrefix } from './config';

/**
 * 获取会员等级分页列表
 */
export async function getMemberLevelPageApi(data: RequestGetPageQuery) {
  return requestClient.post<PhpPageResponse<MemberLevelVO>>(
    `${apiPrefix}/user-member-level/list/page`,
    data,
  );
}

/**
 * 创建会员等级
 */
export async function createMemberLevelApi(data: MemberLevelDTO) {
  return requestClient.post(`${apiPrefix}/user-member-level`, data);
}

/**
 * 更新会员等级
 */
export async function updateMemberLevelApi(id: number, data: MemberLevelDTO) {
  return requestClient.put(`${apiPrefix}/user-member-level/${id}`, data);
}

/**
 * 启停会员等级
 */
export async function changeMemberLevelStatusApi(
  id: number,
  data: MemberLevelStatusDTO,
) {
  return requestClient.put(`${apiPrefix}/user-member-level/${id}/status`, data);
}

/**
 * 删除会员等级
 */
export async function deleteMemberLevelApi(id: number) {
  return requestClient.delete(`${apiPrefix}/user-member-level/${id}`);
}
