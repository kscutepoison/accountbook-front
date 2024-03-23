<template>
  <!-- <v-expansion-panels v-model="panel" multiple> -->
  <!-- <v-expansion-panel v-for="accountType in accountTypeSet" :title="accountType" :value="accountType"> -->
  <!-- <v-expansion-panel-text> -->
  <!-- <v-card 
          v-for="account in accounts"
          :title="account.account_name" 
          subtitle="This is a subtitle" 
          text="This is content">
        </v-card> -->
  <!-- <div v-for="account in accountsAry"> -->
  <!-- <router-link :to="'/balances/' + account.id">{{ account.account_name }}</router-link> -->
  <!-- </div> -->
  <!-- <template v-slot:prepend> -->
  <!-- <v-avatar color="grey-lighten-1"> -->
  <!-- <v-icon color="white">mdi-folder</v-icon> -->
  <!-- </v-avatar> -->
  <!-- </template> -->
  <!-- </v-expansion-panel-text> -->
  <!-- </v-expansion-panel> -->
  <!-- </v-expansion-panels> -->
  <v-card class="mx-auto" max-width="500" min-width="300">
    <v-list v-model:opened="open">
      <v-list-group v-for="(accounts, type) in accountsAry" :value="type">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="type"></v-list-item>
        </template>
        <v-list-item v-for="account in accounts" :key="account.id" :title="account.account_name"
          :value="account.account_name">
          <template v-slot:append>
            <v-btn color="blue-grey-lighten-4" icon="mdi-information" variant="text" @click="editAccount(account)"></v-btn>
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn density="default" @click="addAccount">アカウント追加</v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn density="default">リスト編集</v-btn>
      </v-col>

    </v-row>
  </v-container>
  <v-dialog width="auto" scrollable v-model="isShowAccountInput" persistent>
    <AccountInput @submit-form="submitForm" :account="account"></AccountInput>
    <v-btn @click="isShowAccountInput = false">
      閉じる
    </v-btn>
    <!-- </v-overlay> -->
  </v-dialog>
  <!-- <div>{{ accountsAry[0].id }}</div>
  <div>{{ accountsAry[0].account_name }}</div> -->
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useAccountsStore } from '@/stores/accounts';
import { storeToRefs } from "pinia";

const isShowAccountInput = ref(false);
const open = ref([]);

const accountsStore = useAccountsStore();
const { accountTypeSet, accountsAry } = storeToRefs(accountsStore);
const { getAccounts, createAccount } = accountsStore;
onMounted(() => {
  getAccounts();
});
function submitForm(account) {
  isShowAccountInput.value = false;
  console.log('submitForm', account);
  createAccount(account);
  // getAccounts();
}
const account = ref();
function addAccount() {
  account.value = null;
  isShowAccountInput.value = true;
}
function editAccount(target) {
  account.value = target;
  isShowAccountInput.value = true;
}
</script>