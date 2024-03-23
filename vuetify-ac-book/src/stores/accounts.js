import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref([]);
  function getAccounts() {
    axios.get('http://10.0.1.56:8081/accounts')
      .then(function (response) {
        console.log(response);
        const res = response.data;
        console.log(res);
        accounts.value = res;
        console.log(accounts.value);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(function () {
        // always executed
      });
  }
  const accountTypeSet = computed(() => {
    const res = new Set();
    accounts.value.forEach(account => {
      res.add(account.type);
    });
    return res;
  });
  const accountsAry = computed(() => {
    console.log('accountsAry');
    console.log(accounts.value);
    const res = {};
    accounts.value.forEach(account => {
      if(!res[account.type]) {
        res[account.type] = [];
      }
      res[account.type].push(account);
    });
    console.log(res);
    return res;
  });

  function createAccount(account) {
    console.log('ACCOUNT', account);
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
    console.log(accountModel);
    axios.post('http://10.0.1.56:8081/accounts',
      account, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(response => {
        console.log('レスポンス', response);
        if (response.data) {
          accounts.value.push(response.data);
        }
      })
      .catch(error => {
        console.log(error);
      })
      .finally(() => {
        // always executed
      });
  }

  return {
    accounts,
    getAccounts,
    accountTypeSet,
    accountsAry,
    createAccount,
  };
});