import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicSysUser {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户昵称
   */
  realName: string;
  /**
   * 用户角色
   */
  roles?: string[];
  /**
   * 用户id
   */
  userId: string;
  /**
   * 用户名
   */
  username: string;
}

interface AccessState {
  /**
   * 用户信息
   */
  profile: BasicSysUser | null;
  /**
   * 用户角色
   */
  roles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setProfile(profile: BasicSysUser | null) {
      // 设置用户信息
      this.profile = profile;
      // 设置角色信息
      const roles = profile?.roles ?? [];
      this.setRoles(roles);
    },
    setRoles(roles: string[]) {
      this.roles = roles;
    },
  },
  getters: {
    userInfo(): BasicSysUser | null {
      return this.profile;
    },
  },
  state: (): AccessState => ({
    profile: null,
    roles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
