<template>
  <v-card class="mx-auto" max-width="600" min-width="300">
  <v-list>
    <v-list-item v-for="balance in balances" :key="balance.id" :title="balance.title"
      :subtitle="balance.date + ' ' + balance.expence">
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
        <v-btn density="compact" icon="mdi-plus" size="large" @click="showBalanceInput"></v-btn>
      </v-col>
    </v-row>
  </v-container>
  <!-- <v-overlay v-model="isShowBalanceInput" contained class="align-center justify-center"
   persistent="true" scrollable > -->
  <v-dialog width="auto" scrollable v-model="isShowBalanceInput" persistent>
    <BalanceInput @submit-form="submitForm"></BalanceInput>
    <v-btn @click="isShowBalanceInput = false">
      閉じる
    </v-btn>
    <!-- </v-overlay> -->
  </v-dialog>
  <v-btn @click="increment">
    Increment
  </v-btn>
  <div>{{ count }}</div>
  <div>{{ name }}</div>
  <div>{{ doubleValue }}</div>
  <v-btn @click="getBalanceById">
    OK
  </v-btn>
</template>

<script setup>
import { ref, computed, useAttrs } from "vue"
import { useCounterStore } from '@/stores/counter';
import { useBalancesStore } from "@/stores/balances";
import { useAccountsStore } from "@/stores/accounts";
import { storeToRefs } from "pinia";

const attrs = useAttrs();
console.log(attrs.accountId);
// if (attrs.account) {
//   account.value = attrs.account;
// }
const { getAccountById, getAccounts } = useAccountsStore();
// const balances = ref([]);
const balancesStore = useBalancesStore();
const { balances, currentBalance } = storeToRefs(balancesStore);
const account = getAccountById(attrs.accountId);
account.then( result => {
  balances.value = result.balances;
  currentBalance.value.account_id = attrs.accountId;
  currentBalance.value.account.id = result.id;
  currentBalance.value.account.account_name = result.account_name;
  console.log('account', result);
  console.log(currentBalance.value.account.id);
  console.log(currentBalance.value.account.account_name);
}
);
const isShowBalanceInput = ref(false);

const showBalanceInput = () => {
  isShowBalanceInput.value = true;
};

const { getBalanceById, createBalance } = balancesStore;

// const userStore = useUserStore();
// const getUsers = computed(() => {
//   return userStore.getUsers;
// });
// const users = computed(() => {
//   return userStore.users;
// });
// onMounted(() => {
//   userStore.fetchUsers();
//   console.log(userStore.users);
// });

const store = useCounterStore();
setTimeout(() => {
  store.increment()
}, 1000)
const { count, name} = storeToRefs(store);
const { increment } = store;
const doubleValue = computed(() => store.doubleCount)

function submitForm(balance) {
  isShowBalanceInput.value = false;
  console.log('submitForm', balance);
  if (balance.id) {
    // updateBalance(balance);
  } else {
    createBalance(balance);
  }
}
</script>