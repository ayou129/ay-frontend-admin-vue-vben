export interface UserModel {
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

export interface RequestFilterQuery {
  field: string;
  operator: string;
  value: any;
}

// 用户状态枚举
export enum UserStatus {
  Active = 1, // 正常
  Deleted = 3, // 已删除
  Frozen = 2, // 冻结
  Inactive = 0, // 未激活
}

export const userStatusTextMap: Record<UserStatus, string> = {
  [UserStatus.Inactive]: '未激活',
  [UserStatus.Active]: '正常',
  [UserStatus.Frozen]: '冻结',
  [UserStatus.Deleted]: '已删除',
};

export const userStatusColorMap: Record<UserStatus, string> = {
  [UserStatus.Inactive]: 'gray',
  [UserStatus.Active]: 'green',
  [UserStatus.Frozen]: 'orange',
  [UserStatus.Deleted]: 'red',
};

export enum UserGender {
  Female = 2, // 女性
  Male = 1, // 男性
  Unknown = 0, // 未知
}

export const userGenderTextMap: Record<UserGender, string> = {
  [UserGender.Unknown]: '未知',
  [UserGender.Male]: '男',
  [UserGender.Female]: '女',
};

export const userGenderColorMap: Record<UserGender, string> = {
  [UserGender.Unknown]: 'gray',
  [UserGender.Male]: 'blue',
  [UserGender.Female]: 'pink',
};
