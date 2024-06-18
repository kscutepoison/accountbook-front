<template>
  <v-card class="mx-auto" max-width="600" min-width="300">
    <v-list>
      <v-list-item v-for="balance in balances" :key="balance.id" :title="balance.title"
        :subtitle="getDateW(balance.date) + ' ' + balance.expence" @click="showBalanceInput(balance)">
        <template v-slot:prepend>
          <v-avatar color="grey-lighten-1">
            <v-icon color="white">mdi-folder</v-icon>
          </v-avatar>
        </template>

        <template v-slot:append>
          <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn density="compact" icon="mdi-plus" size="large" @click="showBalanceInput()"></v-btn>
      </v-col>
    </v-row>
  </v-container>
  <!-- <v-overlay v-model="isShowBalanceInput" contained class="align-center justify-center"
   persistent="true" scrollable > -->
  <v-dialog width="auto" scrollable v-model="isShowBalanceInput" persistent>
    <BalanceInput @submit-form="submitForm" @delete-form="deleteForm"></BalanceInput>
    <v-btn @click="isShowBalanceInput = false">
      閉じる
    </v-btn>
    <!-- </v-overlay> -->
  </v-dialog>
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

const { getAccountById } = useAccountsStore();
const { getCategoryById, getCategories } = useCategoriesStore();
// const balances = ref([]);
const balancesStore = useBalancesStore();
const { getBalances } = balancesStore;
const { balances, currentBalance } = storeToRefs(balancesStore);
const { categories } = storeToRefs(useCategoriesStore());
// if (categories.value.length == 0) {
//   getCategories();
// }

const updBalances = ()=> {
  if (categoryId) {
    categoryOrAccount = getCategoryById(categoryId);
    categoryOrAccount.then(result => {
      balances.value = result.balances;
    });
  } else if (accountId) {
    // categoryOrAccount = getAccountById(accountId);
    // categoryOrAccount.then(result => {
    //   balances.value = result.balances;
    // }
    // );
    getBalances({
      account_id: accountId,
      transfer_id: accountId,
    }).then(result => {
      balances.value = result;
    });
  } else {
    getBalances(null).then(result => {
      balances.value = result;
    });
  }
};

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
</script>