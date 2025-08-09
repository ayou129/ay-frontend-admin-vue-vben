import type { CustomPageResponse, UserStatus, UserVO } from '#/types';

import { reactive, toRefs } from 'vue';

import { defineStore } from 'pinia';

import {
  createUserApi,
  deleteUserApi,
  getUserPageApi,
  updateUserApi,
} from '#/api/core/user';
import { EMPTY_CUSTOM_PAGE_RESPONSE } from '#/store/common';

export const useUserStore = defineStore('user', () => {
  const state = reactive<
    CustomPageResponse<UserVO> & {
      loading: boolean;
      searchParams: Record<string, any>;
    }
  >({
    ...EMPTY_CUSTOM_PAGE_RESPONSE,
    searchParams: {},
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
  const fetchPage = async () => {
    state.loading = true;
    try {
      const response = await getUserPageApi({
        page: state.page,
        page_size: state.page_size,
        ...state.searchParams,
      });
      Object.assign(state, response);
    } catch {
      // 失败时保留用户的分页设置，只重置数据
      const { page_size } = state;
      Object.assign(state, {
        ...EMPTY_CUSTOM_PAGE_RESPONSE,
        page_size,
      });
    } finally {
      state.loading = false;
    }
  };

  // 创建用户
  const create = async (dto: Partial<UserVO>) => {
    try {
      await createUserApi(dto);
      await fetchPage();
      return true;
    } catch {
      return false;
    }
  };

  // 更新用户
  const update = async (id: number, dto: Partial<UserVO>) => {
    try {
      await updateUserApi(id, dto);
      await fetchPage();
      return true;
    } catch {
      return false;
    }
  };

  // 删除用户
  const deleteUser = async (id: number) => {
    try {
      await deleteUserApi(id);
      await fetchPage();
      return true;
    } catch {
      return false;
    }
  };

  // 设置搜索参数
  const setSearchParams = (params: Record<string, any>) => {
    state.searchParams = params;
    state.page = 1;
  };

  // 重置搜索参数
  const resetSearchParams = () => {
    state.searchParams = {};
    state.page = 1;
  };

  return {
    ...toRefs(state),
    format_status,
    fetchPage,
    create,
    update,
    delete: deleteUser,
    setSearchParams,
    resetSearchParams,
  };
});
