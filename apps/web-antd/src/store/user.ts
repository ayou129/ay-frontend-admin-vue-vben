import type { UserModel } from '@ay-shared-core/types/user';
import type {
  FilterQuery,
  FilterSortOption,
} from '@ay-shared-core/utils/page_query';

import { EMPTY_GO_PAGE_RESPONSE } from '@ay-shared-core/types/api';
import { UserStatusEnum } from '@ay-shared-core/types/user';
import { DEFAULT_SORT_OPTION } from '@ay-shared-core/utils/page_query';
import { defineStore } from 'pinia';

import {
  createUserApi,
  deleteUserApi,
  getUserPageApi,
  updateUserApi,
} from '#/api/core/user';

export const useUserStore = defineStore('user', () => {
  // 移除loading状态，由VxeTable自动管理

  // 格式化方法
  const format_status = (status?: UserStatusEnum) => {
    switch (status) {
      case UserStatusEnum.ACTIVE: {
        return { text: '正常', color: 'green' };
      }
      case UserStatusEnum.DISABLED: {
        return { text: '禁用', color: 'gray' };
      }
      default: {
        return { text: '未知', color: 'gray' };
      }
    }
  };

  // 获取分页数据
  const fetchPage = async (
    page: number,
    pageSize: number,
    filters: FilterQuery[] = [],
    sortOption: FilterSortOption = DEFAULT_SORT_OPTION,
  ) => {
    try {
      const response = await getUserPageApi({
        page,
        page_size: pageSize,
        filters,
        sort_option: sortOption,
      });

      return response; // 直接返回数据给VxeTable
    } catch {
      return EMPTY_GO_PAGE_RESPONSE; // 返回空数据
    }
  };

  const create = async (dto: Partial<UserModel>) => {
    try {
      await createUserApi(dto);
      return true;
    } catch {
      return false;
    }
  };

  // 更新用户
  const update = async (id: number, dto: Partial<UserModel>) => {
    try {
      await updateUserApi(id, dto);
      return true;
    } catch {
      return false;
    }
  };

  // 删除用户
  const deleteUser = async (id: number) => {
    try {
      await deleteUserApi(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    format_status,
    fetchPage,
    create,
    update,
    delete: deleteUser,
  };
});
