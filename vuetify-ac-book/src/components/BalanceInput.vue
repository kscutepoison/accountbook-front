<template>
  <!-- <v-sheet width="400" height="1000" class="mx-auto"
    position="static"
    max-height="700"
    max-width="300"
    > -->
    <v-sheet width="auto" max-width="500" min-width="300">
      <v-form @submit.prevent>
        <v-text-field v-model="balance.title" :rules="rules" label="タイトル"></v-text-field>
        <v-text-field label="日付" v-model="balance.date" type="date"></v-text-field>
        <v-text-field label="時間" v-model="dateTime.time" type="time"></v-text-field>
        <v-text-field v-model="balance.expence" label="金額" prefix="¥">
        </v-text-field>
        <v-radio-group v-model="balance.wallet">
          <template v-slot:label>
            <div>財布</div>
          </template>
          <v-radio label="謙吾" value="謙吾"></v-radio>
          <v-radio label="ななみ" value="ななみ"></v-radio>
        </v-radio-group>
        <v-autocomplete label="店名" v-model="balance.baught_at"
          :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>
        <v-autocomplete label="アカウント" v-model="balance.account"
          :items="accounts" item-title="account_name" item-value="id"></v-autocomplete>
        <v-autocomplete label="カテゴリ" v-model="balance.category_id"
          :items="categoryNames"></v-autocomplete>
        <v-checkbox v-model="balance.checked" label="確認"></v-checkbox>
        <v-textarea v-model="balance.notes" label="メモ"></v-textarea>
        <v-btn type="submit" block class="mt-2" @click="submitForm">Submit</v-btn>
      </v-form>
    </v-sheet>
</template>

<script setup>
import { ref, computed, useAttrs } from "vue"
import { storeToRefs } from "pinia";
import { useAccountsStore } from "@/stores/accounts";
import { useBalancesStore } from "@/stores/balances";
import { useCategoriesStore } from "@/stores/categories";

const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
const { getAccounts } = accountsStore;
const balanceStore = useBalancesStore();
const { currentBalance } = storeToRefs(balanceStore);
const categoriesStore = useCategoriesStore();
const { categories } = storeToRefs(categoriesStore);
const { getCategories } = categoriesStore;
if (accounts.value.length == 0) {
  getAccounts();
}

if (categories.value.length == 0) {
  getCategories();
}
const categoryNames = computed(() => {
  const res = [];
  console.log(categories.value);
  categories.value.forEach(category => {
    res.push({
      title: category.category_name,
      value: category.id, 
    });
  });
  return res;
})

const dateTime = ref({
  date: null,
  time: null,
});

const balance = currentBalance;
const attrs = useAttrs();
const emit = defineEmits(['submitForm']);
function submitForm() {
    balance.value.account_id = balance.value.account.id;
    console.log('emit', balance.value);
    emit('submitForm', balance.value);
}
if (attrs.balance) {
  balance.value = attrs.balance;
}

console.log('CurrentBalance', balance.value);

</script>