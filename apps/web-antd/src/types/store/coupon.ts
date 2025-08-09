// 优惠券类型枚举
export enum CouponType {
  Discount = 2, // 折扣券
  FixedAmount = 1, // 满减券
}

// 优惠券子类型枚举
export enum CouponSubType {
  Ladder = 2, // 阶梯满减
  Normal = 1, // 普通满减/比例折扣
}

// 优惠券发放方式枚举
export enum CouponIssueMethod {
  Automatic = 2, // 自动发放
  Manual = 1, // 手动发放
}

// 优惠券模板状态枚举
export enum CouponTemplateStatus {
  Active = 1, // 生效中
  Disabled = 2, // 已停用
}

export interface CouponTemplate {
  id: number;
  coupon_name: string;
  coupon_type: CouponType; // 1=满减券 2=折扣券
  sub_type: CouponSubType; // 满减子类型：1=普通满减 2=阶梯满减；折扣券固定为1=比例折扣
  face_value: number;
  min_amount: number;
  ladder_rules?: string;
  valid_start: string;
  valid_end: string;
  issue_method: CouponIssueMethod; // 1=手动发放 2=自动发放
  max_per_user: number;
  total_quantity: number;
  used_quantity: number;
  status: CouponTemplateStatus; // 1=生效中 2=已停用
  applicable_order_types: string;
  created_at: string;
  updated_at: string;
}

// 优惠券状态枚举
export enum CouponStatus {
  Disabled = -2, // 管理员失效
  Expired = -1, // 已过期
  Unused = 0, // 未使用
  Used = 1, // 已使用
}

export interface Coupon {
  id: number;
  template_id: number;
  coupon_sn: string;
  status: CouponStatus; // 0=未使用 1=已使用 -1=已过期 -2=管理员失效
  get_time: string;
  use_time?: string;
  created_at: string;
  updated_at: string;
}

// 优惠券规则类型枚举
export enum CouponRuleType {
  Holiday = 2, // 节日定时发放
  UserBehavior = 1, // 用户行为触发
}

export interface CouponRule {
  id: number;
  template_id: number;
  rule_type: CouponRuleType; // 1=用户行为触发 2=节日定时发放
  trigger_event?: string;
  holiday_type?: string;
  effective_days: number;
  created_at: string;
  updated_at: string;
}

export interface OrderCouponUsage {
  id: number;
  order_id: number;
  order_item_id?: number;
  coupon_id: number;
  coupon_deduction_amount: number;
  created_at: string;
  updated_at: string;
}
