// 用户等级状态枚举
export enum UserLevelStatus {
  Disabled = 0, // 禁用
  Enabled = 1, // 启用
}

export const userLevelStatusTextMap: Record<UserLevelStatus, string> = {
  [UserLevelStatus.Disabled]: '禁用',
  [UserLevelStatus.Enabled]: '启用',
};

export const userLevelStatusColorMap: Record<UserLevelStatus, string> = {
  [UserLevelStatus.Disabled]: 'red',
  [UserLevelStatus.Enabled]: 'green',
};

// 用户等级模型
export interface UserLevelModel {
  id: number;
  name: string;
  level_no: number;
  point_min: number;
  point_max: number;
  discount_rate: number; // 折扣率，如 0.85 表示 85%
  status: UserLevelStatus;
  icon?: string;
  remark?: string;
  created_at: string;
}

// 用户等级DTO
export interface UserLevelDTO {
  name: string;
  level_no: number;
  point_min: number;
  point_max: number; // 0 表示无上限
  discount_rate: number; // 0.01-1.00，1表示不打折
  status: UserLevelStatus;
  icon?: string;
  remark?: string;
}

// 用户等级状态变更DTO
export interface UserLevelStatusDTO {
  value: UserLevelStatus;
}
