// 系统管理员状态枚举
export enum AdminStatus {
  Active = 1, // 正常
  Inactive = 0, // 未激活
}

export interface Admin {
  id: number;
  dept_id?: number;
  role_id?: number;
  username: string;
  password?: string;
  nick_name?: string;
  phone?: string;
  email?: string;
  avatar_name?: string;
  avatar_path?: string;
  status: AdminStatus;
  pwd_reset_time?: string;
  created_at: string;
  updated_at: string;
}
