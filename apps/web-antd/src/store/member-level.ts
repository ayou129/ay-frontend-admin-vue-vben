import type {
  MemberLevelDTO,
  RequestFilterQuery,
  RequestFilterSortOption,
} from '#/types';

import { defineStore } from 'pinia';

import {
  changeMemberLevelStatusApi,
  createMemberLevelApi,
  deleteMemberLevelApi,
  getMemberLevelPageApi,
  updateMemberLevelApi,
} from '#/api/core/member-level';
import { MemberLevelStatus } from '#/types';
import { DEFAULT_FILTER_SORT_OPTION } from '#/utils/filter';

export const useMemberLevelStore = defineStore('memberLevel', () => {
  // 格式化状态
  const format_status = (status?: MemberLevelStatus) => {
    switch (status) {
      case MemberLevelStatus.Disabled: {
        return { text: '禁用', color: 'red' };
      }
      case MemberLevelStatus.Enabled: {
        return { text: '启用', color: 'green' };
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
    filters: RequestFilterQuery[] = [],
    filterSortOption: RequestFilterSortOption = DEFAULT_FILTER_SORT_OPTION,
  ) => {
    try {
      const response = await getMemberLevelPageApi({
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

  // 创建会员等级
  const create = async (dto: MemberLevelDTO) => {
    try {
      await createMemberLevelApi(dto);
      return true;
    } catch {
      return false;
    }
  };

  // 更新会员等级
  const update = async (id: number, dto: MemberLevelDTO) => {
    try {
      await updateMemberLevelApi(id, dto);
      return true;
    } catch {
      return false;
    }
  };

  // 启停会员等级
  const changeStatus = async (id: number, status: MemberLevelStatus) => {
    try {
      await changeMemberLevelStatusApi(id, { value: status });
      return true;
    } catch {
      return false;
    }
  };

  // 删除会员等级
  const deleteMemberLevel = async (id: number) => {
    try {
      await deleteMemberLevelApi(id);
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
    delete: deleteMemberLevel,
  };
});
