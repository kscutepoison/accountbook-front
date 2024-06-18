import axios from 'axios'
import router from "@/router";

export const useApi = () => {
  // const BASE_URL = "http://localhost:8000";
  const BASE_URL = "http://10.0.1.52:8000";

  async function login(username, password) {
    try {
      const res = await axios.postForm(`${BASE_URL}/token`, {
        username,
        password,
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      return {
        token: res.data.access_token,
        userId: username,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function refreshToken(token) {
    try {
      const res = await axios.get(`${BASE_URL}/refresh_token`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data.access_token; 
    } catch (error) {
      console.log('エラー', error.response.status);
      console.log('エラー', error);
      return null;
    }
  }

  async function usersMe(token) {
    try {
      const res = await axios.get(`${BASE_URL}/users/me`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      console.log('エラー', error.response.status);
      console.log('エラー', error);
      return null;
    }
  }

  async function getCategoriesAll(token) {
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log('エラー', error.response.status);
      console.log('エラー', error);
    }
  }

  async function getPayee(token) {
    try {
      const res = await axios.get(`${BASE_URL}/balances/payee/`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401){
        router.push('/auth');
        return null;
      }
      console.log('エラー', error.response.status);
      console.log('エラー', error);
    }
  }

  async function getAccountsAll(token) {
    try {
      console.log('TOKEN', token);
      const res = await axios.get(`${BASE_URL}/accounts`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log('エラー', error.response.status);
      console.log('エラー', error);
    }
  }

  async function getBalancesApi(params, token) {
    let url = `${BASE_URL}/balances`;
    if (params) {
      Object.keys(params).forEach(function (key) {
        url += '&' + key + '=' + params[key];
      });
      url = url.replace('balances&', 'balances?');
    }
    try {
      const res = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log('エラー', error.response.status);
      console.log('エラー', error);
    }
  }

  async function getAccountsWithBalanceSumApi(token) {
    try {
      const res = await axios.get(`${BASE_URL}/accounts/sum/`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log('エラー', error.response.status);
      console.log('エラー', error);
    }
  }

  async function getCategoriesWithBalanceSumApi(params, token) {
    let url = `${BASE_URL}/categories/sum/`;
    if (params) {
      Object.keys(params).forEach(function (key) {
        url += '&' + key + '=' + params[key];
      });
      url = url.replace('sum/&', 'sum/?');
    }
    try {
      const res = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log('エラー', error.response.status);
      console.log('エラー', error);
    }
  }

  async function getBalanceSumApi(params, token) {
    let url = `${BASE_URL}/balances/sum`;
    if (params) {
      Object.keys(params).forEach(function (key) {
        url += '&' + key + '=' + params[key];
      });
      url = url.replace('sum&', 'sum?');
    }
    try {
      const res = await axios.get(url, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log('エラー', error.response.status);
      console.log('エラー', error);
    }
  }

  async function getBalance(balanceId, token) {
    try {
      const res = await axios.get(`${BASE_URL}/balances/${balanceId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function getCategoryApi(categoryId, token) {
    try {
      const res = await axios.get(`${BASE_URL}/categories/${categoryId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function getAccountApi(accountId, token) {
    try {
      const res = await axios.get(`${BASE_URL}/accounts/${accountId}`, {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function postBalance(balance, token) {
    try {
      const res = await axios.post(`${BASE_URL}/balances`, balance, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function postCategory(category, token) {
    try {
      const res = await axios.post(`${BASE_URL}/categories`, category, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function postAccount(account, token) {
    try {
      const res = await axios.post(`${BASE_URL}/accounts`, account, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function patchCategory(categoryId, category, token) {
    try {
      const res = await axios.patch(`${BASE_URL}/categories/${categoryId}`,
        category, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function patchAccount(accountId, account, token) {
    try {
      const res = await axios.patch(`${BASE_URL}/accounts/${accountId}`,
        account, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function patchBalance(balanceId, balance, token) {
    try {
      console.log('patchBalance', balance);
      const res = await axios.patch(`${BASE_URL}/balances/${balanceId}`,
        balance, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      });
      return res.data;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function deleteBalance(balanceId, token) {
    try {
      const res = await axios.delete(`${BASE_URL}/balances/${balanceId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
      return res;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  async function deleteCategory(categoryId, token) {
    try {
      const res = await axios.delete(`${BASE_URL}/categories/${categoryId}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });
      return res;
    } catch (error) {
      if (error.response.status == 401) {
        router.push('/auth');
        return null;
      }
      console.log(error);
    }
  }

  return {
    login,
    refreshToken,
    usersMe,
    getAccountsAll,
    getAccountApi,
    postAccount,
    patchAccount,
    getAccountsWithBalanceSumApi,
    getCategoriesWithBalanceSumApi,
    getBalancesApi,
    getBalanceSumApi,
    getBalance,
    postBalance,
    patchBalance,
    deleteBalance,
    getCategoriesAll,
    getCategoryApi,
    postCategory,
    patchCategory,
    deleteCategory,
    getPayee,
  }
}