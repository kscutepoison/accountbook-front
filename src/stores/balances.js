import { ref, computed, reactive, watch } from 'vue'
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
    withdrawal_date: null,
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
    transfer_id: null,
  });
  const payee = ref([]);
  const tab = ref();
  const { token } = storeToRefs(useAuthStore());
  const {
    getBalancesApi,
    getBalanceSumApi,
    getBalancesWithAccountIdApi,
    getBalancesGroupByAccountApi,
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

  async function getBalances(params) {
    balances.value = await getBalancesApi(params, token.value);
    return balances.value;
  }

  async function getBalancesWithAccountId(accountId, params) {
    balances.value = await getBalancesWithAccountIdApi(accountId, params, token.value);
    return balances.value;
  }

  async function getBalancesSum(params) {
    const response = await getBalanceSumApi(params, token.value);
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
      withdrawal_date: null,
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
      transfer_id: null,
    };
  }

  const open = ref([]);
  function resetOpen() {
    const list = localStorage.getItem('balance_open_list');
    if (!list) {
      open.value = [];
      return;
    }
    open.value = list.split(',');
  }
  watch(
    () => open.value,
    (newValue, oldValue) => {
      localStorage.setItem('balance_open_list', newValue.join(','));
    },
    { deep: false }
  );

  const searchItems = ref({});
  function clearSearchItems() {
    const json = localStorage.getItem('balance_search_items');
    if (!json) {
      searchItems.value = {
        title: null,
        baught_at: null,
        checked: null,
        notes: null,
        start_date: dayjs().date(1).add(-6, "months").format("YYYY-MM-DD"),
        end_date: null,
      };
      return;
    }
    searchItems.value = JSON.parse(json);
  }

  watch(
    () => searchItems.value,
    (newValue, oldValue) => {
      localStorage.setItem('balance_search_items', JSON.stringify(newValue));
    },
    { deep: true }
  );

  return {
    balances,
    currentBalance,
    payee,
    getBalances,
    getBalancesWithAccountId,
    getBalancesSum,
    getBalanceById,
    createBalance,
    updateBalance,
    removeBalance,
    resetCurrentBalance,
    setPayee,
    tab,
    open,
    resetOpen,
    searchItems,
    clearSearchItems,
  }
});
