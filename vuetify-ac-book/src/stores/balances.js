import { ref, computed, reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useApi } from './api'
import { useAuthStore } from './auth';

export const useBalancesStore = defineStore('balances', () => {
  const balances = ref([]);
  const currentBalance = ref({
    id: null,
    title: '',
    date: null,
    expence: null,
    wallet: '',
    baught_at: null,
    checked: false,
    notes: '',
    modified: null,
    category_id: null,
    account_id: null,
    account: {
      id: null,
      account_name: null,
    }
  });
  const { token } = storeToRefs(useAuthStore());
  const { getBalance, postBalance, patchBalance } = useApi();

  async function getBalanceById(balanceId) {
    const response = await getBalance(balanceId, token.value);
    console.log(response);
    return response;
  }

  async function createBalance(balance) {
    console.log(balance.date);
    if (!balance.modified) {
      balance.modified = new Date();
    }
    const res = await postBalance(balance, token.value);
    if (res) {
      balances.value.push(res);
    }
    resetCurrentBalance();
  }

  async function updateBalance(balance) {
    balance.modified = new Date();
    const res = await patchBalance(balance.id, balance, token.value);
    if (res) {
      // balances.value.push(res);
    }
    resetCurrentBalance();
  }

  function resetCurrentBalance() {
    currentBalance.value = {
      id: null,
      title: '',
      date: null,
      expence: null,
      wallet: '',
      baught_at: null,
      checked: false,
      notes: '',
      modified: null,
      category_id: null,
      account_id: null,
      account: {
        id: null,
        account_name: null,
      }
    };
  }

  return { balances, currentBalance, getBalanceById, createBalance }
});