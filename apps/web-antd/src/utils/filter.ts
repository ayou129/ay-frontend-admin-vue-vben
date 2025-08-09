// 通用筛选类型定义

// 过滤操作符常量
export const FilterOperators = {
  // 相等类
  EQUAL: 'eq', // 等于
  NOT_EQUAL: 'neq', // 不等于

  // 比较类
  GT: 'gt', // 大于
  GTE: 'gte', // 大于等于
  LT: 'lt', // 小于
  LTE: 'lte', // 小于等于

  // 范围类
  BETWEEN: 'between', // 区间范围 (需要两个值)
  NOT_BETWEEN: 'not_between', // 不在区间范围 (需要两个值)

  // 模糊匹配类
  LIKE: 'like', // 包含 (%关键词%)
  NOT_LIKE: 'not_like', // 不包含
  STARTS_WITH: 'starts_with', // 前缀匹配 (关键词%)
  ENDS_WITH: 'ends_with', // 后缀匹配 (%关键词)

  // 集合类
  IN: 'in', // 在集合中
  NOT_IN: 'not_in', // 不在集合中

  // 特殊类
  IS_NULL: 'is_null', // 是空值
  IS_NOT_NULL: 'is_not_null', // 不是空值
};

// 值类型
export const ValueTypes = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  ARRAY: 'array',
};

// 分页查询参数
export interface RequestGetPageQuery {
  page: number;
  page_size: number;
  filters: RequestFilterQuery[];
  filter_sort_option: RequestFilterSortOption;
}

// 排序选项
export interface RequestFilterSortOption {
  sort_field: string; // 排序字段
  sort_order: 'asc' | 'desc'; // 排序方向 (asc/desc)
}

// 单个筛选条件查询
export interface RequestFilterQuery {
  field: string; // 字段名
  operator: string; // 操作符
  value: any; // 值
  value_type: string; // 字段类型，如"string", "number" "bool"等
}

// 辅助函数：创建简单字符串过滤器
export const createStringFilter = (
  field: string,
  operator: string,
  value: string,
): RequestFilterQuery => ({
  field,
  operator,
  value,
  value_type: ValueTypes.STRING,
});

// 辅助函数：创建数值过滤器
export const createNumberFilter = (
  field: string,
  operator: string,
  value: number,
): RequestFilterQuery => ({
  field,
  operator,
  value,
  value_type: ValueTypes.NUMBER,
});

// 辅助函数：创建前缀匹配过滤器
export const createStartsWithFilter = (
  field: string,
  value: string,
): RequestFilterQuery => ({
  field,
  operator: FilterOperators.STARTS_WITH,
  value,
  value_type: ValueTypes.STRING,
});

// 辅助函数：创建后缀匹配过滤器
export const createEndsWithFilter = (
  field: string,
  value: string,
): RequestFilterQuery => ({
  field,
  operator: FilterOperators.ENDS_WITH,
  value,
  value_type: ValueTypes.STRING,
});

// 辅助函数：创建包含匹配过滤器
export const createLikeFilter = (
  field: string,
  value: string,
): RequestFilterQuery => ({
  field,
  operator: FilterOperators.LIKE,
  value,
  value_type: ValueTypes.STRING,
});

// 筛选字段配置接口（从FilterBar组件移植过来）
export interface FilterField {
  field: string; // 字段名
  label: string; // 显示名称
  valueType: string; // 值类型
  operators?: string[]; // 可用操作符列表
  placeholder?: string; // 快速搜索时的提示文字
}

// 是否需要显示值输入框
export const shouldShowValueInput = (operator: string): boolean => {
  return ![FilterOperators.IS_NOT_NULL, FilterOperators.IS_NULL].includes(
    operator,
  );
};

// 根据值类型获取可用的操作符
export const getAvailableOperatorsByType = (valueType: string): string[] => {
  switch (valueType) {
    case ValueTypes.BOOLEAN: {
      return [FilterOperators.EQUAL, FilterOperators.NOT_EQUAL];
    }
    case ValueTypes.DATE: {
      return [
        FilterOperators.EQUAL,
        FilterOperators.NOT_EQUAL,
        FilterOperators.GT,
        FilterOperators.GTE,
        FilterOperators.LT,
        FilterOperators.LTE,
        FilterOperators.IS_NULL,
        FilterOperators.IS_NOT_NULL,
      ];
    }
    case ValueTypes.NUMBER: {
      return [
        FilterOperators.EQUAL,
        FilterOperators.NOT_EQUAL,
        FilterOperators.GT,
        FilterOperators.GTE,
        FilterOperators.LT,
        FilterOperators.LTE,
        FilterOperators.IS_NULL,
        FilterOperators.IS_NOT_NULL,
      ];
    }
    case ValueTypes.STRING: {
      return [
        FilterOperators.EQUAL,
        FilterOperators.NOT_EQUAL,
        FilterOperators.LIKE,
        FilterOperators.NOT_LIKE,
        FilterOperators.STARTS_WITH,
        FilterOperators.ENDS_WITH,
        FilterOperators.IS_NULL,
        FilterOperators.IS_NOT_NULL,
      ];
    }
    default: {
      return [
        FilterOperators.EQUAL,
        FilterOperators.NOT_EQUAL,
        FilterOperators.LIKE,
        FilterOperators.NOT_LIKE,
        FilterOperators.STARTS_WITH,
        FilterOperators.ENDS_WITH,
        FilterOperators.IS_NULL,
        FilterOperators.IS_NOT_NULL,
      ];
    }
  }
};
