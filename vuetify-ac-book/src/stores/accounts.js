import { ref, computed, reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import axios from 'axios'
import { useApi } from './api';
import { useAuthStore } from './auth';

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref([]);
  const { getAccountsAll, getAccount, postAccount, patchAccount } = useApi();
  const { token } = storeToRefs(useAuthStore());
  async function getAccounts() {
    accounts.value = await getAccountsAll(token.value);
  }

  async function getAccountById(accountId) {
    const response = await getAccount(accountId, token.value);
    console.log(response);
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
    account.closing_date = account.closing_date == null ? 0 : account.closing_date;
    account.withdrawal_date = account.withdrawal_date == null ? 0 : account.withdrawal_date;

    const accountModel = {
      "account_name": account.account_name,
      "type": account.type,
      "order": account.order,
      "is_rollup": account.is_rollup,
      "is_archived": account.is_archived,
      "is_primary": account.is_primary,
      "withdrawal_date": account.withdrawal_date,
      "closing_date": account.closing_date,
      "bonus_month": account.bonus_month,
    };
    const res = await postAccount(account, token.value);
    if (res) {
      accounts.value.push(res);
    }
  }

  async function updateAccount(account) {
    account.bonus_month = account.bonus_month == null ? 0 : account.bonus_month;
    account.closing_date = account.closing_date == null ? 0 : account.closing_date;
    account.withdrawal_date = account.withdrawal_date == null ? 0 : account.withdrawal_date;
    const accountId = account.id;
    const res = await patchAccount(accountId, account, token.value);
  }

  return {
    accounts,
    getAccounts,
    getAccountById,
    accountTypeSet,
    accountsAry,
    createAccount,
    updateAccount,
  };
});