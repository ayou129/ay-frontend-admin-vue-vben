import type { Recordable, UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getAccessCodesApi, getProfileApi, loginApi, logoutApi } from '#/api';
import { $t } from '#/locales';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: Recordable<any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let profile: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const resp = await loginApi(params);
      const { access_token, refresh_token } = resp;
      console.warn('access_token', access_token);
      console.warn('refresh_token', refresh_token);
      // 如果成功获取到 accessToken
      if (access_token && refresh_token) {
        accessStore.setAccessToken(access_token);
        accessStore.setRefreshToken(refresh_token);

        // 获取用户信息并存储到 accessStore 中
        const [fetchProfileResult, accessCodes] = await Promise.all([
          fetchProfile(),
          getAccessCodesApi(),
        ]);

        profile = {
          avatar: fetchProfileResult.avatar_url ?? '',
          realName: fetchProfileResult.real_name ?? '',
          userId: fetchProfileResult.id.toString(),
          username: fetchProfileResult.nick_name ?? '',
          roles: [],
          desc: '',
          homePath: '',
          token: access_token,
        };

        userStore.setProfile(profile);
        accessStore.setAccessCodes(accessCodes);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          onSuccess
            ? await onSuccess?.()
            : await router.push(
                profile?.homePath || preferences.app.defaultHomePath,
              );
        }

        if (profile?.realName) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${profile?.realName}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      profile,
    };
  }

  async function logout(redirect: boolean = true) {
    try {
      await logoutApi();
    } catch {
      // 不做任何处理
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    // 回登录页带上当前路由地址
    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          }
        : {},
    });
  }

  async function fetchProfile() {
    const profile = await getProfileApi();
    userStore.setProfile({
      avatar: profile.avatar_url ?? '',
      realName: profile.real_name ?? '',
      userId: profile.id.toString(),
      username: profile.nick_name ?? '',
      roles: [],
    });
    return profile;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchProfile,
    loginLoading,
    logout,
  };
});
