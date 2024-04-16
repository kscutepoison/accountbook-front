<template>
  <!-- <v-sheet width="400" height="1000" class="mx-auto"
    position="static"
    max-height="700"
    max-width="300"
    > -->
    <v-sheet width="auto" max-width="500" min-width="300">
        <v-form @submit.prevent>
            <v-text-field v-model="account.account_name" label="アカウント名"></v-text-field>
            <v-text-field v-model="account.type" label="種別" type="text"></v-text-field>
            <v-checkbox v-model="account.is_rollup" label="集計に含む"></v-checkbox>
            <v-checkbox v-model="account.is_archived" label="アーカイブ"></v-checkbox>
            <v-checkbox v-model="account.is_primary" label="メインアカウント"></v-checkbox>
            <v-text-field v-model="account.closing_date" label="締日" type="number"></v-text-field>
            <v-text-field v-model="account.withdrawal_date" label="引落日" type="number"></v-text-field>
            <v-text-field v-model="account.bonus_month" label="ボーナス月" type="number"></v-text-field>
            <v-btn type="submit" block class="mt-2" @click="submitForm">Submit</v-btn>
        </v-form>
    </v-sheet>
    
</template>

<script setup>
import { ref, computed, useAttrs, onMounted } from "vue"
import { useAccountsStore } from '@/stores/accounts';
import { storeToRefs } from "pinia";

const account = ref({
  account_name: '',
  type: '',
  is_rollup: true,
  is_archived: false,
  is_primary: false,
  withdrawal_date: null,
  closing_date: null,
  bonus_month: null,
  order: 100,
  id: null,
});
const validation = ref({
    rules: [
    value => {
      if (value) return true;
      return '必須入力です。';
    }
  ]
});

const attrs = useAttrs();
const accountsStore = useAccountsStore();
const { getAccounts, createAccount } = accountsStore;
const create = () => {
    console.log(account.value);
    createAccount(account.value);
}
const emit = defineEmits(['submitForm']);

function submitForm() {
    console.log('emit', account.value);
    emit('submitForm', account.value);
}
// onMounted(() => {
  console.log(attrs.account);
  if (attrs.account) {
    account.value = attrs.account;
  }
// });
</script>