import { ref, computed, reactive } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useApi } from './api'
import { useAuthStore } from './auth';
import dayjs from 'dayjs';

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
    },
    category: {
      id: null,
      category_name: null,
    },
  });
  const payee = ref([]);
  const { token } = storeToRefs(useAuthStore());
  const { 
    getBalancesAll,
    getBalance, 
    postBalance, 
    patchBalance, 
    deleteBalance, 
    getPayee 
  } = useApi();

  async function getBalanceById(balanceId) {
    const response = await getBalance(balanceId, token.value);
    console.log(response);
    return response;
  }

  async function getBalances() {
    const response = await getBalancesAll(token.value);
    return response;
  }

  async function setPayee() {
    const response = await getPayee(token.value);
    payee.value = response;
    return response;
  }

  async function createBalance(balance) {
    if (!balance.modified) {
      const dy = dayjs();
      balance.modified = dy.format('YYYY-MM-DD HH:mm');
    }
    const res = await postBalance(balance, token.value);
    if (res) {
      balances.value.push(res);
    }
    resetCurrentBalance();
    addPayee(balance.baught_at);
  }

  async function updateBalance(balance) {
    console.log('updateBalance', balance);
    const dy = dayjs();
    balance.modified = dy.format('YYYY-MM-DD HH:mm');
    const res = await patchBalance(balance.id, balance, token.value);
    if (res) {
      // balances.value.push(res);
    }
    resetCurrentBalance();
    addPayee(balance.baught_at);
  }

  async function removeBalance(id) {
    const res = await deleteBalance(id, token.value);
    resetCurrentBalance();
  }

  function addPayee(item) {
    const val = payee.value.filter(val => {
      return item == val;
    });
    if (val.length == 0) {
      payee.value.push(item);
    }
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
      },
      category: {
        id: null,
        category_name: null,
      },
    };
  }

  return {
    balances,
    currentBalance,
    payee,
    getBalances,
    getBalanceById,
    createBalance,
    updateBalance,
    removeBalance,
    resetCurrentBalance,
    setPayee,
  }
});