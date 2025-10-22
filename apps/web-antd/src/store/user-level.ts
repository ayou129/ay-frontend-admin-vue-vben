import type {
  FilterQuery,
  FilterSortOption,
} from '@ay-shared-core/utils/page_query';

import type { UserLevelDTO } from '#/types/user-level';

import { EMPTY_GO_PAGE_RESPONSE } from '@ay-shared-core/types/api';
import { DEFAULT_SORT_OPTION } from '@ay-shared-core/utils/page_query';
import { defineStore } from 'pinia';

import {
  changeUserLevelStatusApi,
  createUserLevelApi,
  deleteUserLevelApi,
  getUserLevelPageApi,
  updateUserLevelApi,
} from '#/api/core/user-level';
import { UserLevelStatus } from '#/types/user-level';

export const useUserLevelStore = defineStore('userLevel', () => {
  // 格式化状态
  const format_status = (status?: UserLevelStatus) => {
    switch (status) {
      case UserLevelStatus.Disabled: {
        return { text: '已禁用', color: 'red' };
      }
      case UserLevelStatus.Enabled: {
        return { text: '已启用', color: 'green' };
      }
      default: {
        return { text: '未知', color: 'gray' };
      }
    }
  };

  // 格式化折扣率 - xx折(xx%)
  const format_discount_rate = (rate?: number) => {
    if (rate === undefined || rate === null) return '--';

    // rate 是小数，如 0.85 表示 85%
    const percentage = Math.round(rate * 100);

    // 根据具体值确定折扣显示
    let discountText;
    if (percentage === 100) {
      discountText = '不打折'; // 1.00 显示为不打折
    } else if (percentage >= 95) {
      discountText = `${percentage}折`; // 97折、95折等
    } else if (percentage >= 90 && percentage < 95) {
      discountText = '9折'; // 90-94折都显示为9折
    } else if (percentage >= 80 && percentage < 90) {
      discountText = '8折'; // 80-89折都显示为8折
    } else if (percentage >= 70 && percentage < 80) {
      discountText = '7折'; // 70-79折都显示为7折
    } else if (percentage >= 60 && percentage < 70) {
      discountText = '6折'; // 60-69折都显示为6折
    } else {
      discountText = `${Math.floor(percentage / 10)}折`;
    }

    return `${discountText}`;
  };

  // 格式化积分范围
  const format_point_range = (pointMin?: number, pointMax?: number) => {
    if (pointMin === undefined || pointMin === null) return '--';
    if (pointMax === undefined || pointMax === null || pointMax === 0) {
      return `${pointMin}+`;
    }
    return `${pointMin}-${pointMax}`;
  };

  // 获取分页数据
  const fetchPage = async (
    page: number,
    pageSize: number,
    filters: FilterQuery[] = [],
    sortOption: FilterSortOption = DEFAULT_SORT_OPTION,
  ) => {
    try {
      const response = await getUserLevelPageApi({
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

  // 创建用户等级
  const create = async (dto: UserLevelDTO) => {
    try {
      await createUserLevelApi(dto);
      return true;
    } catch {
      return false;
    }
  };

  // 更新用户等级
  const update = async (id: number, dto: UserLevelDTO) => {
    try {
      await updateUserLevelApi(id, dto);
      return true;
    } catch {
      return false;
    }
  };

  // 启停用户等级
  const changeStatus = async (id: number, status: UserLevelStatus) => {
    try {
      await changeUserLevelStatusApi(id, { value: status });
      return true;
    } catch {
      return false;
    }
  };

  // 删除用户等级
  const deleteUserLevel = async (id: number) => {
    try {
      await deleteUserLevelApi(id);
      return true;
    } catch {
      return false;
    }
  };

  return {
    format_status,
    format_discount_rate,
    format_point_range,
    fetchPage,
    create,
    update,
    changeStatus,
    delete: deleteUserLevel,
  };
});
