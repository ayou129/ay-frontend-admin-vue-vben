// 会员等级状态枚举
export enum MemberLevelStatus {
  Disabled = 0, // 禁用
  Enabled = 1, // 启用
}

// 会员等级VO
export interface MemberLevelVO {
  id: number;
  name: string;
  level_no: number;
  point_min: number;
  point_max: number;
  discount_rate: number; // 折扣率，如 0.85 表示 85%
  status: MemberLevelStatus;
  icon?: string;
  remark?: string;
  created_at: string;
}

// 会员等级DTO
export interface MemberLevelDTO {
  name: string;
  level_no: number;
  point_min: number;
  point_max: number; // 0 表示无上限
  discount_rate: number; // 0.01-1.00，1表示不打折
  status: MemberLevelStatus;
  icon?: string;
  remark?: string;
}

// 会员等级状态变更DTO
export interface MemberLevelStatusDTO {
  value: MemberLevelStatus;
}
