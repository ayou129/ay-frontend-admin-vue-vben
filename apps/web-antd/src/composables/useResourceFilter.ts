import type { ResourceModel } from '#/types/resource';
import type { RequestGetPageQuery } from '#/utils/filter';

import { computed, onUnmounted, ref, watch } from 'vue';

import { getResourceList } from '#/api/resource/resource';
import { ResourceType } from '#/types/resource';
import { createLikeFilter, FilterOperators, ValueTypes } from '#/utils/filter';

interface FilterState {
  searchKeyword: string;
  typeFilter: ResourceType | undefined;
  currentPage: number;
  pageSize: number;
}

interface FilterResult {
  resources: ResourceModel[];
  total: number;
  loading: boolean;
}

export function useResourceFilter(pageSize = 1000) {
  const state = ref<FilterState>({
    searchKeyword: '',
    typeFilter: undefined,
    currentPage: 1,
    pageSize,
  });

  const data = ref<FilterResult>({
    resources: [],
    total: 0,
    loading: false,
  });

  const debouncedKeyword = ref('');
  let searchTimer: NodeJS.Timeout | null = null;

  // 防抖搜索
  watch(
    () => state.value.searchKeyword,
    (keyword) => {
      if (searchTimer) clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        debouncedKeyword.value = keyword;
      }, 300);
    },
    { immediate: true },
  );

  const buildFilters = (): RequestGetPageQuery['filters'] => {
    const filters: RequestGetPageQuery['filters'] = [];

    if (debouncedKeyword.value.trim()) {
      filters.push(
        createLikeFilter(
          'file_original_filename',
          debouncedKeyword.value.trim(),
        ),
      );
    }

    if (state.value.typeFilter !== undefined) {
      filters.push({
        field: 'type',
        operator: FilterOperators.EQUAL,
        value: state.value.typeFilter,
        value_type: ValueTypes.NUMBER,
      });
    }

    return filters;
  };

  const loadResources = async () => {
    try {
      data.value.loading = true;

      const response = await getResourceList({
        page: state.value.currentPage,
        page_size: state.value.pageSize,
        filters: buildFilters(),
        filter_sort_option: { sort_field: 'id', sort_order: 'desc' },
      });

      data.value = {
        resources: response.items,
        total: response.total,
        loading: false,
      };
    } catch (error) {
      console.error('加载资源列表失败:', error);
      data.value = { resources: [], total: 0, loading: false };
    }
  };

  // 自动加载
  watch([debouncedKeyword, () => state.value.typeFilter], () => {
    state.value.currentPage = 1;
    loadResources();
  });

  // 清理定时器
  onUnmounted(() => {
    if (searchTimer) clearTimeout(searchTimer);
  });

  const resetFilters = () => {
    state.value = {
      ...state.value,
      searchKeyword: '',
      typeFilter: undefined,
      currentPage: 1,
    };
  };

  const updateSearchKeyword = (keyword: string) => {
    state.value.searchKeyword = keyword;
  };

  const updateTypeFilter = (type: ResourceType | undefined) => {
    state.value.typeFilter = type;
  };

  const updatePagination = (page: number, pageSize?: number) => {
    state.value.currentPage = page;
    if (pageSize) state.value.pageSize = pageSize;
  };

  const hasActiveFilters = computed(
    () =>
      state.value.searchKeyword.trim() !== '' ||
      state.value.typeFilter !== undefined,
  );

  return {
    state,
    data,
    hasActiveFilters,
    loadResources,
    resetFilters,
    updateSearchKeyword,
    updateTypeFilter,
    updatePagination,
  };
}
