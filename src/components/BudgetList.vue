<template>
  <v-card
    title="Nutrition"
    flat
  >
    <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template>
 <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn density="compact" icon="mdi-plus" size="large" @click="showBalanceInput()"></v-btn>
      </v-col>
    </v-row>
  </v-container>
 <!-- <v-data-table 
    :items="tableItems"
    :headers="headers"
    density="compact"
    hide-default-header>
  </v-data-table> -->
  <v-data-table 
    :group-by="groupBy"
    :items="tableItems"
    :headers="headers"
    :search="search"
    hide-default-footer
    hide-default-header>
    <!-- <template v-slot:item.group="{ item }">
      <tr>
        <td></td>
      </tr>
    </template> -->
    <template v-slot:item="{ item }">
      <tr>
        <td>
          <v-card>
            <v-icon color="white">mdi-folder</v-icon><v-spacer></v-spacer>{{ item.title }}
              {{ item.date }} {{ item.expense }}<v-spacer></v-spacer>
            <v-icon
              class="me-2"
              size="small"
              @click="showBalanceInput(item.balance)"
            >
              mdi-pencil
            </v-icon>
          </v-card>
        </td>
      </tr>
    </template>
  </v-data-table>
  
  <v-dialog width="auto" scrollable v-model="isShowBalanceInput" persistent>
    <BalanceInput @submit-form="submitForm" @delete-form="deleteForm"></BalanceInput>
    <v-btn @click="isShowBalanceInput = false">
      閉じる
    </v-btn>
  </v-dialog>
</v-card>
</template>



<script setup>
  import { ref, watch, computed, useAttrs } from "vue"
import { useBalancesStore } from "@/stores/balances";
import { useCategoriesStore } from "@/stores/categories";
import { useAccountsStore } from "@/stores/accounts";
import { storeToRefs } from "pinia";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import dayjs from "dayjs";
import ja from 'dayjs/locale/ja';

const route = useRoute();
let categoryId = route.query.categoryId;
let accountId = route.query.accountId;

const { getCategoryById } = useCategoriesStore();
const balancesStore = useBalancesStore();
const { getBalances } = balancesStore;
const { balances, currentBalance } = storeToRefs(balancesStore);

const updBalances = ()=> {
  const param = {};
  if (categoryId) {
    param = {
      category_id: categoryId,
    }
  } else if (accountId) {
    param = {
      account_id: accountId,
      transfer_id: accountId,
    }
  } else {
    param = null;
  }
  getBalances(param).then(result => {
    balances.value = result;
  });
};

const headers = [
  // {title: 'ID', key: 'id'},
  {title: 'Title', key: 'title'},
  {title: 'Date', key: 'date'},
  {title: 'Expense', key: 'expense'},
];

const groupBy = [{
  key: 'yearMonth', 
  order: 'desc',
}];

const search = ref('');

const tableItems = computed(() => {
  const res = [];
  balances.value.forEach(b => {
    res.push({
      // id: b.id,
      title: b.title,
      date: getDateW(b.date),
      expense: b.expence,
      yearMonth: getYearMonth(b.date),
      balance: b,
    });
  });
  return res;
});

let categoryOrAccount;
updBalances();
watch(() => route.query.categoryId, (newId, oldId) => {
  categoryId = newId;
  updBalances();
});
watch(() => route.query.accountId, (newId, oldId) => {
  accountId = newId;
  updBalances();
});
onBeforeRouteUpdate(async (to, from) => {
  console.log('onBeforeRouteUpdate');
  // react to route changes...
  // userData.value = await fetchUser(to.params.id)
  
})

const isShowBalanceInput = ref(false);
const {
  getBalanceById,
  createBalance,
  updateBalance,
  removeBalance,
  resetCurrentBalance,
} = balancesStore;

const showBalanceInput = (balance) => {
  if (balance) {
    currentBalance.value = balance;
  } else {
    console.log('resetCurrent');
    resetCurrentBalance();
  }
  isShowBalanceInput.value = true;
};

function submitForm(balance) {
  isShowBalanceInput.value = false;
  console.log('submitForm', balance);
  if (balance.id) {
    updateBalance(balance);
    categoryOrAccount = getCategoryById(categoryId);
    categoryOrAccount.then(result => {
      balances.value = result.balances;
    });
  } else {
    createBalance(balance);
  }
}
function deleteForm(id) {
  isShowBalanceInput.value = false;
  removeBalance(id);
  balances.value = balances.value.filter(b => {
    return b.id != id;
  });
}

const getDateW = (date) => {
  dayjs.locale(ja);
  const dt = dayjs(date);
  return dt.format('YYYY-MM-DD(ddd) HH:mm');
};

const getYearMonth = (date) => {
  dayjs.locale(ja);
  const dt = dayjs(date);
  return dt.format('YYYY-MM');
}
</script>