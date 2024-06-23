<template>
  <v-dialog
    v-model="dialog"
    width="auto"
    scrollable
    persistent
    max-width="500"
    min-width="300"
  >
    <v-card>
      <v-card-title>
        <v-tabs v-model="tab" :bg-color="tabColor" class="">
          <v-tab value="expense">支出</v-tab>
          <v-tab value="income">収入</v-tab>
          <v-tab value="transfer">振替</v-tab>
        </v-tabs>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 600px">
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="expense">
            <v-form @submit.prevent>
              <v-text-field
                v-model="balance.title"
                label="タイトル"
                clearable
              ></v-text-field>
              <v-text-field
                label="日付"
                v-model="dt.date"
                type="date"
              ></v-text-field>
              <!-- <v-text-field label="日付" v-model="balance.date" ></v-text-field> -->
              <v-text-field
                label="時間"
                v-model="dt.time"
                type="time"
              ></v-text-field>
              <v-text-field
                v-model="balance.exp"
                label="金額"
                prefix="¥"
                clearable
              ></v-text-field>
              <v-combobox
                label="店名"
                v-model="balance.baught_at"
                :items="payee"
                clearable
              ></v-combobox>
              <v-autocomplete
                label="アカウント"
                v-model="balance.account_id"
                :items="accounts"
                item-title="account_name"
                item-value="id"
                clearable
              ></v-autocomplete>
              <v-text-field
                v-if="getAccountType(balance.account_id) == 'クレジットカード'"
                label="引落日"
                v-model="balance.withdrawal_date"
                type="date"
              ></v-text-field>
              <v-autocomplete
                label="カテゴリ"
                v-model="balance.category_id"
                :items="categories"
                item-title="category_name"
                item-value="id"
                clearable
              ></v-autocomplete>
              <v-checkbox v-model="balance.checked" label="確認"></v-checkbox>
              <v-textarea v-model="balance.notes" label="メモ"></v-textarea>
            </v-form>
          </v-tabs-window-item>

          <v-tabs-window-item value="income">
            <v-form @submit.prevent>
              <v-text-field
                v-model="balance.title"
                label="タイトル"
                clearable
              ></v-text-field>
              <v-text-field
                label="日付"
                v-model="dt.date"
                type="date"
              ></v-text-field>
              <v-text-field
                label="時間"
                v-model="dt.time"
                type="time"
              ></v-text-field>
              <v-text-field
                v-model="balance.exp"
                label="金額"
                prefix="¥"
                type="number"
                clearable
              >
              </v-text-field>
              <v-combobox
                label="支払元"
                v-model="balance.baught_at"
                :items="payee"
                clearable
              ></v-combobox>
              <v-autocomplete
                label="アカウント"
                v-model="balance.account_id"
                :items="accounts"
                item-title="account_name"
                item-value="id"
                clearable
              ></v-autocomplete>
              <v-text-field
                v-if="getAccountType(balance.account_id) == 'クレジットカード'"
                label="引落日"
                v-model="balance.withdrawal_date"
                type="date"
              ></v-text-field>
              <v-autocomplete
                label="カテゴリ"
                v-model="balance.category_id"
                :items="categories"
                item-title="category_name"
                item-value="id"
                clearable
              ></v-autocomplete>
              <v-checkbox v-model="balance.checked" label="確認"></v-checkbox>
              <v-textarea v-model="balance.notes" label="メモ"></v-textarea>
            </v-form>
          </v-tabs-window-item>

          <v-tabs-window-item value="transfer">
            <v-form @submit.prevent>
              <v-text-field
                v-model="balance.title"
                label="タイトル"
                clearable
              ></v-text-field>
              <v-text-field
                label="日付"
                v-model="dt.date"
                type="date"
              ></v-text-field>
              <v-text-field
                label="時間"
                v-model="dt.time"
                type="time"
              ></v-text-field>
              <v-text-field
                v-model="balance.exp"
                label="金額"
                prefix="¥"
                clearable
              ></v-text-field>
              <v-autocomplete
                label="振替元アカウント"
                v-model="balance.account_id"
                :items="accounts"
                item-title="account_name"
                item-value="id"
                clearable
              ></v-autocomplete>
              <v-autocomplete
                label="振替先アカウント"
                v-model="balance.transfer_id"
                :items="accounts"
                item-title="account_name"
                item-value="id"
                clearable
              ></v-autocomplete>
              <v-checkbox v-model="balance.checked" label="確認"></v-checkbox>
              <v-textarea v-model="balance.notes" label="メモ"></v-textarea>
            </v-form>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn @click="closeForm"> 閉じる </v-btn>
        <v-btn @click="deleteForm" v-if="balance.id">削除</v-btn>
        <v-btn @click="balance.id = null" v-if="balance.id">複製</v-btn>
        <v-btn @click="submitForm">{{ balance.id ? "更新" : "登録" }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import dayjs from "dayjs";
import { useAccountsStore } from "@/stores/accounts";
import { useBalancesStore } from "@/stores/balances";
import { useCategoriesStore } from "@/stores/categories";

const route = useRoute();
const accountsStore = useAccountsStore();
const { accounts } = storeToRefs(accountsStore);
const { getAccounts, getAccount } = accountsStore;
const balanceStore = useBalancesStore();
const { currentBalance, payee, balances } = storeToRefs(balanceStore);
const { setPayee, createBalance, removeBalance, updateBalance } = balanceStore;
const categoriesStore = useCategoriesStore();
const { categories } = storeToRefs(categoriesStore);
const { getCategories } = categoriesStore;

const dt = ref({
  date: dayjs().format("YYYY-MM-DD"),
  time: '00:00',
});

const balance = ref({});
watch(
  () => currentBalance.value,
  (blc, _) => {
    balance.value = { ...currentBalance.value };
    if (!balance.value.id) {
      if (route.query.categoryId) {
        balance.value.category_id = route.query.categoryId * 1;
      }
      if (route.query.accountId) {
        balance.value.account_id = route.query.accountId * 1;
      }
    }
  }
);

const dialog = ref();
const tab = ref();
const tabColor = computed(() => {
  let color = "primary";
  switch (tab.value) {
    case "expense":
      color = "orange";
      break;
    case "income":
      color = "green";
      break;
    case "transfer":
      color = "yellow";
      break;
  }
  return color;
});

if (accounts.value.length == 0) {
  getAccounts();
}
const getAccountType = (accountId) => {
  const ac = getAccount(accountId);
  if (ac) {
    return ac.type;
  }
  return "";
};

if (categories.value.length == 0) {
  getCategories();
}

if (payee.value.length == 0) {
  setPayee();
}

watch(
  () => balance.value,
  (blc, _) => {
    if (blc.date) {
      const dy = dayjs(blc.date);
      dt.value.date = dy.format("YYYY-MM-DD");
      dt.value.time = dy.format("HH:mm");
    }
    blc.exp = Math.abs(+blc.expence);
    if (blc.transfer_id) {
      tab.value = "transfer";
    } else if (blc.expence < 0) {
      tab.value = "expense";
      blc.exp = blc.expence * -1;
    } else if (blc.expence > 0) {
      tab.value = "income";
      blc.exp = blc.expence;
    } else {
      tab.value = "expense";
    }
  }
);

const emit = defineEmits(["closeForm"]);

const closeForm = () => {
  emit("closeForm");
};

function submitForm() {
  // balance.value.account_id = balance.value.account.id;
  if (dt.value.date) {
    if (dt.value.time) {
      balance.value.date = dt.value.date + " " + dt.value.time;
    } else {
      balance.value.date = dt.value.date + " 00:00";
    }
  }
  balance.value.category_id = balance.value.category_id * 1;
  switch (tab.value) {
    case "expense":
      balance.value.expence = balance.value.exp * -1;
      break;
    case "income":
      balance.value.expence = balance.value.exp;
      break;
    case "transfer":
      balance.value.expence = balance.value.exp * -1;
      balance.value.category_id = 6;
      if (getAccount(balance.value.transfer_id).type === "クレジットカード") {
        balance.value.withdrawal_date = dt.value.date;
      }
      break;
    default:
      break;
  }
  if (balance.value.id) {
    updateBalance(balance.value);
    currentBalance.value = balance.value;
    balances.value.map((bl) => {
      if (bl.id == balance.value.id) {
        bl.title = balance.value.title;
        bl.date = balance.value.date;
        bl.expence = balance.value.expence;
        bl.baught_at = balance.value.baught_at;
        bl.checked = balance.value.checked;
        bl.notes = balance.value.notes;
        bl.withdrawal_date = balance.value.withdrawal_date;
        bl.account_id = balance.value.account_id;
        bl.category_id = balance.value.category_id;
      }
    });
  } else {
    createBalance(balance.value);
    // balances.value.push(balance.value);
  }
  closeForm();
}

function deleteForm() {
  removeBalance(balance.value.id);
  balances.value = balances.value.filter((b) => {
    return b.id != balance.value.id;
  });
  closeForm();
}

const getWithdrawalDate = () => {
  if (!balance.value.account_id) {
    return;
  }
  const account = getAccount(balance.value.account_id);
  if (account.type !== "クレジットカード") {
    balance.value.withdrawal_date = null;
    return;
  }
  if (!dt.value.date) {
    return;
  }
  const criteriaDate = dayjs(dt.value.date);
  let closingDate = criteriaDate.date(account.closing_day);
  if (criteriaDate > closingDate) {
    closingDate = closingDate.add(1, "months");
  }
  let withdrawalDate = closingDate.date(account.withdrawal_day);
  if (closingDate > withdrawalDate) {
    withdrawalDate = withdrawalDate.add(1, "months");
  }
  balance.value.withdrawal_date = withdrawalDate.format("YYYY-MM-DD");
};
watch(
  () => balance.value.account_id,
  (accountId, _) => {
    getWithdrawalDate();
  }
);
watch(
  () => dt.value.date,
  (dt, _) => {
    getWithdrawalDate();
  }
);
watch(
  () => balance.value.transfer_id,
  (transferId, _) => {
    getWithdrawalDate();
  }
);
</script>
