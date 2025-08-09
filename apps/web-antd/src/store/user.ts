import type {
  RequestFilterQuery,
  RequestFilterSortOption,
  UserStatus,
  UserVO,
} from '#/types';

import { defineStore } from 'pinia';

import {
  createUserApi,
  deleteUserApi,
  getUserPageApi,
  updateUserApi,
} from '#/api/core/user';
import { DEFAULT_FILTER_SORT_OPTION } from '#/utils/filter';

export const useUserStore = defineStore('user', () => {
  // 移除loading状态，由VxeTable自动管理

  // 格式化方法
  const format_status = (status?: UserStatus) => {
    switch (status) {
      case 0: {
        return { text: '未激活', color: 'orange' };
      }
      case 1: {
        return { text: '正常', color: 'green' };
      }
      case 2: {
        return { text: '冻结', color: 'red' };
      }
      case 3: {
        return { text: '已删除', color: 'gray' };
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
    filters: RequestFilterQuery[] = [],
    filterSortOption: RequestFilterSortOption = DEFAULT_FILTER_SORT_OPTION,
  ) => {
    try {
      const response = await getUserPageApi({
        page,
        page_size: pageSize,
        filters,
        filter_sort_option: filterSortOption,
      });

      return response; // 直接返回数据给VxeTable
    } catch {
      return { items: [], total: 0 }; // 返回空数据
    }
  };

  const create = async (dto: Partial<UserVO>) => {
    try {
      await createUserApi(dto);
      return true;
    } catch {
      return false;
    }
  };

  // 更新用户
  const update = async (id: number, dto: Partial<UserVO>) => {
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
