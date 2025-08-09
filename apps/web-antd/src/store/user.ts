import type {
  RequestFilterQuery,
  RequestFilterSortOption,
  UserStatus,
  UserVO,
} from '#/types';

import { reactive, toRefs } from 'vue';

import { defineStore } from 'pinia';

import {
  createUserApi,
  deleteUserApi,
  getUserPageApi,
  updateUserApi,
} from '#/api/core/user';

export const useUserStore = defineStore('user', () => {
  const state = reactive<{
    filters: RequestFilterQuery[];
    filter_sort_option: RequestFilterSortOption;
    loading: boolean;
  }>({
    filters: [],
    filter_sort_option: { sort_field: 'id', sort_order: 'desc' },
    loading: false,
  });

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
  const fetchPage = async (page: number, pageSize: number) => {
    state.loading = true;
    try {
      const response = await getUserPageApi({
        page,
        page_size: pageSize,
        filters: state.filters,
        filter_sort_option: state.filter_sort_option,
      });
      
      return response; // 直接返回数据给VxeTable
    } catch (error) {
      console.error('❌ API请求失败:', error);
      return { items: [], total: 0 }; // 返回空数据
    } finally {
      state.loading = false;
    }
  };

  // 创建用户
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

  // 设置过滤条件
  const setFilters = (filters: RequestFilterQuery[]) => {
    state.filters = filters;
  };

  // 重置过滤条件
  const resetFilters = () => {
    state.filters = [];
  };

  return {
    ...toRefs(state),
    format_status,
    fetchPage,
    create,
    update,
    delete: deleteUser,
    setFilters,
    resetFilters,
  };
});
