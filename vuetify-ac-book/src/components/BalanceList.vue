<template>
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
    <BalanceInput></BalanceInput>
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
  <div>{{ balance.id }}</div>
  <div>{{ balance.title }}</div>
  <div>{{ balance.account }}</div>
  <div>{{ balance.category }}</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useCounterStore } from '@/stores/counter';
import { useBalanceStore } from "@/stores/balance";
import { storeToRefs } from "pinia";

const balances = ref([
  {
    id: 1,
    title: '食料',
    date: '2024-02-14',
    expence: -2345,
    wallet: '謙吾',
    account: 'Recruit Card Plus',
    category: '食費',
  },
  {
    id: 2,
    title: '昼食',
    date: '2024-02-17',
    expence: -1900,
    wallet: '謙吾',
    account: 'Suice',
    category: '外食費',
  },
]);
const isShowBalanceInput = ref(false);

const showBalanceInput = () => {
  isShowBalanceInput.value = true;
};

const balanceStore = useBalanceStore();
const { balance } = storeToRefs(balanceStore);
const { getBalanceById } = balanceStore;

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

</script>