import { ref, computed, reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import axios from 'axios'
import { useApi } from './api';
import { useAuthStore } from './auth';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref([]);
  const accountsWithBalanceSum = ref([]);
  const { getAccountsAll, 
    getAccountApi, 
    postAccount, 
    patchAccount,
    getAccountsWithBalanceSumApi
  } = useApi();
  const { token } = storeToRefs(useAuthStore());
  async function getAccounts() {
    accounts.value = await getAccountsAll(token.value);
  }

  async function getAccountById(accountId) {
    const response = await getAccountApi(accountId, token.value);
    console.log(response);
    return response;
  }

  async function getAccountsWithBalanceSum() {
    const response = await getAccountsWithBalanceSumApi(token.value);
    accountsWithBalanceSum.value = response;
    // console.log(response);
    return response;
  }

  const accountTypeSet = computed(() => {
    const res = new Set();
    accounts.value.forEach(account => {
      res.add(account.type);
    });
    return res;
  });
  const accountsAry = computed(() => {
    const res = {};
    accounts.value.forEach(account => {
      if(!res[account.type]) {
        res[account.type] = [];
      }
      res[account.type].push(account);
    });
    return res;
  });

  async function createAccount(account) {
    account.bonus_month = account.bonus_month == null ? 0 : account.bonus_month;
    account.closing_day = account.closing_day == null ? 0 : account.closing_day;
    account.withdrawal_day = account.withdrawal_day == null ? 0 : account.withdrawal_day;

    const accountModel = {
      "account_name": account.account_name,
      "type": account.type,
      "order": account.order,
      "owner": account.owner,
      "is_rollup": account.is_rollup,
      "is_archived": account.is_archived,
      "is_primary": account.is_primary,
      "withdrawal_day": account.withdrawal_day,
      "closing_day": account.closing_day,
      "bonus_month": account.bonus_month,
    };
    const res = await postAccount(account, token.value);
    if (res) {
      accounts.value.push(res);
    }
  }

  async function updateAccount(account) {
    account.bonus_month = account.bonus_month == null ? 0 : account.bonus_month;
    account.closing_day = account.closing_day == null ? 0 : account.closing_day;
    account.withdrawal_day = account.withdrawal_day == null ? 0 : account.withdrawal_day;
    const accountId = account.id;
    const res = await patchAccount(accountId, account, token.value);
  }

  const getAccount = (accountId) => {
    const ac = accounts.value.filter(account => {
      return account.id == accountId;
    });
    if (ac.length === 1) {
      return ac[0];
    }
    return null;
  }

  return {
    accounts,
    accountsWithBalanceSum,
    getAccounts,
    getAccount,
    getAccountById,
    accountTypeSet,
    accountsAry,
    createAccount,
    updateAccount,
    getAccountsWithBalanceSum,
  };
});