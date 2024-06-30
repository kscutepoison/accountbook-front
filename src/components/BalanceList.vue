<template>
  <v-card class="mx-auto" max-width="800" min-width="300">
    <v-app-bar>
      <template v-slot:prepend>
        <v-icon icon="mdi-view-list"></v-icon>
      </template>
      <v-app-bar-title>{{ title }}</v-app-bar-title>
      <!-- <template v-slot:append> -->
      <v-text-field
        v-model="searchItems.title"
        density="compact"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="solo-filled"
        flat
        hide-details
        single-line
        clearable
        append-inner-icon="mdi-dots-vertical"
        @click:append-inner="toggleSearchDialog(true)"
      ></v-text-field>
      <!-- </template> -->
    </v-app-bar>
    <v-dialog v-model="searchDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">絞り込み</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="18" md="4" sm="6">
                <v-text-field
                  v-model="searchItems.title"
                  label="件名"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="18" md="4" sm="6">
                <v-text-field
                  v-model="searchItems.baught_at"
                  label="店名"
                  clearable
                ></v-text-field>
              </v-col>
              <v-col cols="18" md="4" sm="6">
                <v-select
                  label="確認"
                  :items="['確認済', '未確認']"
                  v-model="searchItems.checked"
                  chips
                  multiple
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="18" md="4" sm="6">
                <v-text-field
                  v-model="searchItems.start_date"
                  label="開始日"
                  type="date"
                ></v-text-field>
              </v-col>
              <v-col cols="18" md="4" sm="6">
                <v-text-field
                  v-model="searchItems.end_date"
                  label="終了日"
                  type="date"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="toggleSearchDialog(false)"
          >
            OK
          </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            @click="clearSearchItems()"
          >
            クリア
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-list v-model:opened="open">
      <v-list-group
        v-for="(items, yearMonth) in balancesbyDate"
        :value="yearMonth"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="yearMonth">
            <template v-slot:prepend>
              <v-icon
                :icon="
                  open.includes(yearMonth) ? 'mdi-menu-down' : 'mdi-menu-right'
                "
              ></v-icon>
            </template>
            <template v-slot:append>
              <v-chip
                :color="getBalancesSumByYearMonth(items) >= 0 ? 'green' : 'red'"
              >
                {{ getBalancesSumByYearMonth(items).toLocaleString() }}
              </v-chip>
            </template>
          </v-list-item>
        </template>
        <v-list-item
          v-for="balance in items"
          :key="balance.id"
          :title="balance.title + (balance.baught_at ? '(' + balance.baught_at + ')' : '')"
          @click="showBalanceInput(balance)"
        >
          <template v-slot:subtitle>
            {{ getDateW(balance.date) + (balance.checked ? ' ☑️' : '') }}
            <v-chip
              v-if="balance.roll_up"
              variant="text"
              :color="balance.roll_up >= 0 ? 'green' : 'red'"
            >
              {{ balance.roll_up.toLocaleString() }}
            </v-chip>
          </template>
          <template v-slot:prepend>
            <!-- <v-avatar color="grey-lighten-1"> -->
            <v-icon :color="getIconColor(balance.category_id)">{{
              getCategoryIcon(balance.category_id)
            }}</v-icon>
            <!-- </v-avatar> -->
          </template>
          <template v-slot:append>
            <v-chip :color="balance.expence >= 0 ? 'green' : 'red'">
              {{ balance.expence.toLocaleString() }}
            </v-chip>
            <!-- <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"></v-btn> -->
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
  <v-btn
    fab
    right
    absolute
    v-show="true"
    icon="mdi-plus"
    style="bottom: 80px; position: fixed; right: 45%"
    size="large"
    @click="showBalanceInput()"
  >
  </v-btn>
  <BalanceInput
    v-model="isShowBalanceInput"
    @close-form="
      isShowBalanceInput = false;
      refleshBalances();
    "
  ></BalanceInput>
</template>

<script setup>
import { ref, watch, computed, useAttrs, onMounted } from "vue";
import { useBalancesStore } from "@/stores/balances";
import { useCategoriesStore } from "@/stores/categories";
import { useAccountsStore } from "@/stores/accounts";
import { storeToRefs } from "pinia";
import { useRoute, onBeforeRouteUpdate } from "vue-router";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

const searchDialog = ref(false);
function toggleSearchDialog(isOpen) {
  searchDialog.value = isOpen;
}

const route = useRoute();
let categoryId = route.query.categoryId;
let accountId = route.query.accountId;

const accountsStore = useAccountsStore();
const { getAccountById, getAccount, getAccounts } = accountsStore;
const { accounts } = storeToRefs(accountsStore);
const { getCategoryById, getCategories, getCategory } = useCategoriesStore();
// const balances = ref([]);
const balancesStore = useBalancesStore();
const {
  getBalances,
  getBalancesWithAccountId,
  resetOpen,
  clearSearchItems,
  initSearchItems,
} = balancesStore;
const { balances, currentBalance, searchItems, open, } = storeToRefs(balancesStore);
const { categories } = storeToRefs(useCategoriesStore());


initSearchItems();
resetOpen();

const getCategoryIcon = (categoryId) => {
  const ct = getCategory(categoryId);
  if (ct) {
    return ct.icon;
  }
  return "";
};

const getIconColor = (id) => {
  const ct = getCategory(id);
  let color = "white";
  if (ct) {
    switch (ct.type) {
      case "支出":
        color = "#f26a6a";
        break;
      case "収入":
        color = "green";
        break;
      case "振替":
        color = "yellow";
        break;
    }
  }
  return color;
};

const title = ref("収支一覧");
const refleshBalances = () => {
  let param = {};
  if (categoryId) {
    param = {
      category_id: categoryId,
    };
    const ct = getCategory(categoryId);
    if (ct) {
      title.value = ct.category_name;
    }
  } else if (accountId) {
    const ac = getAccount(accountId);
    if (ac) {
      title.value = ac.account_name;
    }
  }
  const searchParams = {};
  Object.keys(searchItems.value).forEach((key) => {
    if (searchItems.value[key]) {
      searchParams[key] = searchItems.value[key];
    }
  });
  if (accountId) {
    getBalancesWithAccountId(accountId, searchParams).then((result) => {
      result.map((b) => {
        if (b.transfer_id && +b.expence > 0) {
          b.account_id = b.transfer_id;
          b.transfer_id = +accountId;
        }
        return b;
      });
      return (balances.value = result);
    });
  } else {
    getBalances({ ...param, ...searchParams }).then((result) => {
      return (balances.value = result);
    });
  }
};

if (accounts.value.length === 0) {
  getAccounts().then(() => {
    refleshBalances();
  });
};
if (categories.value.length == 0) {
  getCategories().then(() => {
    refleshBalances();
  });
};

watch(
  () => searchDialog.value,
  (isOpen, _) => {
    if (!isOpen) {
      refleshBalances();
    }
  }
);

refleshBalances();
watch(
  () => route.query.categoryId,
  (newId, oldId) => {
    categoryId = newId;
    refleshBalances();
  }
);
watch(
  () => route.query.accountId,
  (newId, oldId) => {
    accountId = newId;
    refleshBalances();
  }
);

const {
  getBalanceById,
  createBalance,
  updateBalance,
  removeBalance,
  resetCurrentBalance,
} = balancesStore;

const balancesbyDate = computed(() => {
  const filteredBalances = balances.value.filter((balance) => {
    const res = [true];
    if (searchItems.value.title) {
      res.push(
        balance.title
          .toLowerCase()
          .indexOf(searchItems.value.title.toLowerCase()) >= 0
      );
    }
    if (searchItems.value.baught_at) {
      res.push(
        balance.baught_at &&
        balance.baught_at
          .toLowerCase()
          .indexOf(searchItems.value.baught_at.toLowerCase()) >= 0
      );
    }
    if (searchItems.value.checked && searchItems.value.checked.length === 1) {
      switch (balance.checked) {
        case true:
          res.push(searchItems.value.checked.indexOf("確認済") >= 0);
          break;
        case false:
          res.push(searchItems.value.checked.indexOf("未確認") >= 0);
          break;
        default:
          break;
      }
    }
    if (balance.transfer_id && !accountId) {
      res.push(false);
    }
    return !res.includes(false);
  });
  const ac = getAccount(accountId);

  filteredBalances.sort((a, b) => (a.date < b.date ? 1 : -1));

  return Object.groupBy(filteredBalances, (balance) => {
    if (accountId && ac && ac.type === "クレジットカード") {
      return getYearMonth(balance.withdrawal_date);
    } else {
      return getYearMonth(balance.date);
    }
  });
});

// function setOpen() {
//   open.value = Array.from(
//     new Set(Object.entries(balancesbyDate.value).map(([key, value]) => key))
//   );
// }

// watch(
//   () => searchItems.value.title,
//   (title, _) => {
//     if (title != null && title != "") {
//       setOpen();
//     }
//   }
// );
// watch(
//   () => searchItems.value.baught_at,
//   (baught_at, _) => {
//     if (baught_at == null || baught_at.length === 0) {
//       return;
//     }
//     setOpen();
//   }
// );
// watch(
//   () => searchItems.value.checked,
//   (checked, _) => {
//     if (checked == null || checked.length === 0) {
//       return;
//     }
//     setOpen();
//   }
// );

const getBalancesSumByYearMonth = (items) => {
  return items.reduce((result, item) => {
    return result + item.expence;
  }, 0);
};

const isShowBalanceInput = ref(false);
const showBalanceInput = (balance) => {
  if (balance) {
    currentBalance.value = { ...balance };
  } else {
    resetCurrentBalance();
  }
  isShowBalanceInput.value = true;
};

const getDateW = (date) => {
  dayjs.locale(ja);
  const dt = dayjs(date);
  return dt.format("MM-DD(ddd) HH:mm");
  // return dt.format("YYYY-MM-DD(ddd) HH:mm");
};

const getYearMonth = (date) => {
  dayjs.locale(ja);
  const dt = dayjs(date);
  return dt.format("YYYY-MM");
};

</script>
