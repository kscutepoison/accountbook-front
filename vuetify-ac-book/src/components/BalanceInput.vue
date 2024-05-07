<template>
  <!-- <v-sheet width="400" height="1000" class="mx-auto"
    position="static"
    max-height="700"
    max-width="300"
    > -->
    <v-card>
      <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab value="expense">支出</v-tab>
        <v-tab value="income">収入</v-tab>
        <v-tab value="transfer">振替</v-tab>
      </v-tabs>
      <v-card-text>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item value="expense">
          expense
        <!-- <v-sheet width="auto" max-width="500" min-width="300">
          <v-form @submit.prevent>
            <v-text-field v-model="balance.title" :rules="rules" label="タイトル"></v-text-field>
            <v-text-field label="日付" v-model="dt.date" type="date"></v-text-field>
            <v-text-field label="時間" v-model="dt.time" type="time"></v-text-field>
            <v-text-field v-model="balance.expence" label="金額" prefix="¥">
            </v-text-field>
            <v-radio-group v-model="balance.wallet">
              <template v-slot:label>
                <div>財布</div>
              </template>
              <v-radio label="謙吾" value="謙吾"></v-radio>
              <v-radio label="ななみ" value="ななみ"></v-radio>
            </v-radio-group>
            <v-combobox
              label="店名"
              v-model="balance.baught_at"
              :items="payee"
            ></v-combobox>
            <v-autocomplete label="アカウント" v-model="balance.account_id"
              :items="accounts" item-title="account_name" item-value="id"></v-autocomplete>
            <v-autocomplete label="カテゴリ" v-model="balance.category_id"
              :items="categories"
              item-title="category_name"
              item-value="id"></v-autocomplete>
            <v-checkbox v-model="balance.checked" label="確認"></v-checkbox>
            <v-textarea v-model="balance.notes" label="メモ"></v-textarea>
            <v-btn v-if="balance.id" type="submit" block class="mt-2" @click="deleteForm">削除</v-btn>
            <v-btn type="submit" block class="mt-2" @click="submitForm">登録</v-btn>
          </v-form>
        </v-sheet> -->
        </v-tabs-window-item>

        <v-tabs-window-item value="income">
          Two
        </v-tabs-window-item>

        <v-tabs-window-item value="transfer">
          Three
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
    </v-card>
</template>

<script setup>
import { ref, computed } from "vue"
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useAccountsStore } from "@/stores/accounts";
import { useBalancesStore } from "@/stores/balances";
import { useCategoriesStore } from "@/stores/categories";

const tab = ref(null);
const route = useRoute();
const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
const { getAccounts } = accountsStore;
const balanceStore = useBalancesStore();
const { currentBalance, payee } = storeToRefs(balanceStore);
const { setPayee } = balanceStore;
const categoriesStore = useCategoriesStore();
const { categories } = storeToRefs(categoriesStore);
const { getCategories } = categoriesStore;
if (accounts.value.length == 0) {
  getAccounts();
}

if (categories.value.length == 0) {
  getCategories();
}

if (payee.value.length == 0) {
  setPayee();
}

const balance = currentBalance;
if (!balance.value.id) {
  if (route.query.categoryId) {
    balance.value.category_id = route.query.categoryId * 1;
  }
  if (route.query.accountId) {
    balance.value.account_id = route.query.accountId * 1;
  }
}
console.log('Balance', balance.value);
const dt = ref({
  date: null,
  time: null,
});
if (balance.value.date) {
  const dy = dayjs(balance.value.date);
  dt.value.date = dy.format('YYYY-MM-DD');
  dt.value.time = dy.format('HH:mm');
}
const emit = defineEmits(['submitForm', 'deleteForm']);
function submitForm() {
    // balance.value.account_id = balance.value.account.id;
    if (dt.value.date) {
      if (dt.value.time) {
        balance.value.date = dt.value.date + ' ' + dt.value.time;
      } else {
        balance.value.date = dt.value.date + ' 00:00';
      }
    }
    // balance.value.date = balanceDateTime.value.date + ' ' + balanceDateTime.value.time;
    console.log('emit', balance.value);
    // balance.value.category_id = 3;
    balance.value.category_id = balance.value.category_id * 1;
    console.log('category_id', balance.value.category_id);
    emit('submitForm', balance.value);
}

function deleteForm() {
  emit('deleteForm', balance.value.id);
}

console.log('CurrentBalance', balance.value);

</script>