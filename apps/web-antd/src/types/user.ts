export interface UserVO {
  id: number;
  phone: string;
  wx_union_id?: string;
  apple_id?: string;
  email?: string;
  password?: string;
  real_name?: string;
  nick_name?: string;
  avatar_url?: string;
  gender?: UserGender;
  birthday?: string;
  constellation?: string;
  city?: string;
  province?: string;
  country?: string;
  status?: UserStatus;
  delete_countdown_at?: string;
  roles?: string[];
  homePath?: string;
  created_at: string;
  updated_at: string;
}

export interface ChangePasswordDTO {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

// 用户状态枚举
export enum UserStatus {
  Active = 1, // 正常
  Deleted = 3, // 已删除
  Frozen = 2, // 冻结
  Inactive = 0, // 未激活
}
export enum UserGender {
  Female = 2, // 女性
  Male = 1, // 男性
  Unknown = 0, // 未知
}
