import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useApi } from './api';

export const useAuthStore = defineStore('auth', () => {
  const userId = ref('');
  const token = ref('');
  const { login, refreshToken } = useApi();

  const isAuthenticated = computed(() => {
    if (!token.value) {
      token.value = localStorage.getItem('token');
      userId.value = localStorage.getItem('userId');
    }
    return !!token.value;
  });

  async function refresh_token() {
    const res = await refreshToken(token.value);
    if (res) {
      token.value = res;
      localStorage.setItem('token', token.value);
      return true;
    }
    return false;
  }

  async function doLogin(username, password) {
    const res = await login(username, password);
    console.log(res);
    if (res) {
      token.value = res.token;
      userId.value = res.userId;
      localStorage.setItem('token', token.value);
      localStorage.setItem('userId', userId.value);
      return true;
    }
    return false;
  }

  function doLogout() {
    userId.value = null;
    token.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  return {
    userId,
    token,
    isAuthenticated,
    doLogin,
    doLogout,
    refresh_token,
  };
});