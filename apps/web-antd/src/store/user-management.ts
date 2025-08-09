import type {
  CustomPageResponse,
  RequestFilterQuery,
  UserDTO,
  UserVO,
} from '#/types/user';

import { reactive, toRefs } from 'vue';

import { message } from 'ant-design-vue';
import { defineStore } from 'pinia';

import {
  createUserApi,
  deleteUserApi,
  getUserPageApi,
  updateUserApi,
} from '#/api/core/user-management';
import { EMPTY_CUSTOM_PAGE_RESPONSE } from '#/types/user';

export const useUserManagementStore = defineStore('user-management', () => {
  const state = reactive<
    CustomPageResponse<UserVO> & {
      filters: RequestFilterQuery[];
      loading: boolean;
    }
  >({
    ...EMPTY_CUSTOM_PAGE_RESPONSE,
    filters: [],
    loading: false,
  });

  // 格式化方法
  const format_status = (status: number) => {
    switch (status) {
      case 0: {
        return { text: '禁用', color: 'red' };
      }
      case 1: {
        return { text: '启用', color: 'green' };
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
        filters: state.filters,
      });
      if (response.code === 0 && response.data) {
        const pageData = response.data as unknown as CustomPageResponse<UserVO>;
        Object.assign(state, pageData);
      } else {
        message.error(response.msg);
        Object.assign(state, {
          ...EMPTY_CUSTOM_PAGE_RESPONSE,
          page_size: state.page_size,
        });
      }
    } finally {
      state.loading = false;
    }
  };

  // 创建用户
  const create = async (dto: UserDTO) => {
    const res = await createUserApi(dto);
    if (res.code === 0) {
      message.success(res.msg);
      await fetchPage();
      return true;
    }
    if (res.msg) message.error(res.msg);
    return false;
  };

  // 更新用户
  const update = async (id: number, dto: UserDTO) => {
    const res = await updateUserApi(id, dto);
    if (res.code === 0) {
      message.success(res.msg);
      await fetchPage();
      return true;
    }
    if (res.msg) message.error(res.msg);
    return false;
  };

  // 删除用户
  const deleteUser = async (id: number) => {
    const res = await deleteUserApi(id);
    if (res.code === 0) {
      message.success(res.msg);
      await fetchPage();
      return true;
    }
    if (res.msg) message.error(res.msg);
    return false;
  };

  // 设置过滤条件
  const setFilters = (filters: RequestFilterQuery[]) => {
    state.filters = filters;
    state.page = 1;
  };

  // 重置过滤条件
  const resetFilters = () => {
    state.filters = [];
    state.page = 1;
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
