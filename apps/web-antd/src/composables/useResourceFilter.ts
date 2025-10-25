import type { PageQueryDTO } from '@ay-shared-core/utils/page_query';

import type { ResourceModel } from '#/types/resource';

import { computed, onUnmounted, ref, watch } from 'vue';

import {
  createLikeFilter,
  FILTER_OPERATORS,
} from '@ay-shared-core/utils/page_query';

import { getResourceList } from '#/api/resource/resource';
import { ResourceType } from '#/types/resource';

interface FilterState {
  searchKeyword: string;
  typeFilter: ResourceType | undefined;
  folderFilter: number | undefined;
  currentPage: number;
  pageSize: number;
}

interface FilterResult {
  resources: ResourceModel[];
  total: number;
  loading: boolean;
}

export function useResourceFilter(pageSize = 100) {
  const state = ref<FilterState>({
    searchKeyword: '',
    typeFilter: undefined,
    folderFilter: undefined,
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

  const buildFilters = (): PageQueryDTO['filters'] => {
    const filters: PageQueryDTO['filters'] = [];

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
        operator: FILTER_OPERATORS.EQUAL,
        value: state.value.typeFilter,
      });
    }

    if (state.value.folderFilter !== undefined) {
      filters.push({
        field: 'folder_id',
        operator: FILTER_OPERATORS.EQUAL,
        value: state.value.folderFilter,
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
        sort_option: { sort_field: 'id', sort_order: 'desc' },
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
  watch(
    [debouncedKeyword, () => state.value.typeFilter, () => state.value.folderFilter],
    () => {
      state.value.currentPage = 1;
      loadResources();
    },
  );

  // 清理定时器
  onUnmounted(() => {
    if (searchTimer) clearTimeout(searchTimer);
  });

  const resetFilters = () => {
    state.value = {
      ...state.value,
      searchKeyword: '',
      typeFilter: undefined,
      folderFilter: undefined,
      currentPage: 1,
    };
  };

  const updateSearchKeyword = (keyword: string) => {
    state.value.searchKeyword = keyword;
  };

  const updateTypeFilter = (type: ResourceType | undefined) => {
    state.value.typeFilter = type;
  };

  const updateFolderFilter = (folderId: number | undefined) => {
    state.value.folderFilter = folderId;
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
    updateFolderFilter,
    updatePagination,
  };
}
