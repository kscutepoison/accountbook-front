<template>
  <v-card class="mx-auto" max-width="900">
    <!-- <v-layout> -->
    <v-app-bar>
      <template v-slot:prepend>
        <v-icon icon="mdi-wallet"></v-icon>
      </template>
      <v-app-bar-title>アカウント</v-app-bar-title>
      <!-- <template v-slot:append> -->
        <v-text-field
          v-model="searchItems.account_name"
          density="compact"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="solo-filled"
          flat
          hide-details
          single-line
          append-inner-icon="mdi-dots-vertical"
          @click:append-inner="toggleSearchDialog(true)"
        ></v-text-field>
      <!-- </template> -->
    </v-app-bar>
    <!-- <div class="text-center">
      <v-chip
        class="ma-2"
        label
      >
        <p class="text-medium-emphasis">
          総資産
        </p>
        {{ allBalancesSum.toLocaleString() }}
      </v-chip>
    </div> -->
    
    <v-dialog
          v-model="searchDialog"
          max-width="1000px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">アカウント絞込</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="searchItems.account_name"
                      label="アカウント名"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-select
                      label="種別"
                      :items="accountTypes"
                      v-model="searchItems.type"
                      chips
                      multiple
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-select
                      label="所有者"
                      :items="owners"
                      v-model="searchItems.owner"
                      chips
                      multiple
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-select
                      v-model="searchItems.is_archived"
                      :items="[
                        {key: true, item: '済'},
                        {key: false, item: '未'},
                      ]"
                      item-title="item"
                      item-value="key"
                      label="アーカイブ"
                      chips
                      multiple
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    md="4"
                    sm="6"
                  >
                    <v-select
                      v-model="searchItems.is_primary"
                      :items="[
                        {key: true, item: 'メイン'},
                        {key: false, item: 'メインでない'},
                      ]"
                      item-title="item"
                      item-value="key"
                      label="メイン"
                      chips
                      multiple
                    ></v-select>
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
    <!-- <template v-slot:text>
      <v-text-field
        v-model="search"
        label="Search"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        hide-details
        single-line
      ></v-text-field>
    </template> -->
    <!-- <v-main> -->
    <v-list v-model:opened="open">
      <v-list-group v-for="(accounts, type) in accountsByType" :value="type">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="type">
            <template v-slot:prepend>
              <v-icon :icon="open.includes(type) ? 'mdi-menu-down' : 'mdi-menu-right'"></v-icon>
            </template>
            <template v-slot:append>
              <v-chip :color="getBalancesByTypeSum(type) >= 0 ? 'green' : 'red'">
                {{ getBalancesByTypeSum(type).toLocaleString() }}
              </v-chip>
            </template>
          </v-list-item>
        </template>
        <v-list-item v-for="account in accounts" :key="account.id" :title="account.account_name"
          :value="account.account_name"
          @click="clickAccount(account.id)">
          <template v-slot:append>
            <v-chip :color="account.roll_up >= 0 ? 'green' : 'red'">
              {{ account.roll_up.toLocaleString() }}
            </v-chip>
            <v-btn color="blue-grey-lighten-4" icon="mdi-information" variant="text" @click.stop="editAccount(account)"></v-btn>
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  <!-- </v-main> -->
  <!-- </v-layout> -->
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
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { useAccountsStore } from '@/stores/accounts';
import { storeToRefs } from "pinia";
import router from "@/router";

const isShowAccountInput = ref(false);

const open = ref([]);

const searchDialog = ref(false);
const searchItems = ref({});
function toggleSearchDialog(isOpen) {
  searchDialog.value = isOpen;
}

function clearSearchItems() {
  searchItems.value = {
    account_name: null,
    type: null,
    owner: null,
    is_archived: null,
    is_primary: null,
  };
}
clearSearchItems();

const accountsStore = useAccountsStore();
const { createAccount, updateAccount, getAccountsWithBalanceSum } = accountsStore;
const { accountsWithBalanceSum } = storeToRefs(accountsStore);

getAccountsWithBalanceSum();

const accountsByType = computed(() => {
  const accounts = accountsWithBalanceSum.value.filter(account => {
    const res = [true];
    if (searchItems.value.account_name) {
      res.push(account.account_name.indexOf(searchItems.value.account_name) >= 0);
    }
    if (searchItems.value.type &&
    searchItems.value.type.length > 0) {
      res.push(searchItems.value.type.some(type => {
        return account.type.indexOf(type) >= 0;
      }));
    }
    if (searchItems.value.owner &&
    searchItems.value.owner.length > 0
    ) {
      res.push(searchItems.value.owner.some(owner => {
        return account.owner.indexOf(owner) >= 0;
      }));
    }
    if (searchItems.value.is_archived &&
    searchItems.value.is_archived.length > 0) {
      res.push(searchItems.value.is_archived.some(is_archived => {
        return account.is_archived === is_archived;
      }));
    }
    if (searchItems.value.is_primary &&
    searchItems.value.is_primary.length > 0) {
      res.push(searchItems.value.is_primary.some(is_primary => {
        return account.is_primary === is_primary;
      }));
    }
    return !res.includes(false);
  });
  return Object.groupBy(
    accounts,
    account => 
    account.type
  );
});

function setOpen() {
  open.value = Array.from(
    new Set(
      Object.entries(accountsByType.value).map(
        ([key, value]) => key
      )
    )
  );
}

watch(() => searchItems.value.account_name, (name, _) => {
  if (name != null && name != '') {
    setOpen();
  }
});
watch(() => searchItems.value.type, (type, _) => {
  if (type == null || type.length === 0) {
    return;
  }
  setOpen();
});
watch(() => searchItems.value.owner, (owner, _) => {
  if (owner == null || owner.length === 0) {
    return;
  }
  setOpen();
});
watch(() => searchItems.value.is_archived, (is_archived, _) => {
  if (is_archived == null || is_archived.length === 0) {
    return;
  }
  setOpen();
});
watch(() => searchItems.value.is_primary, (is_primary, _) => {
  if (is_primary == null || is_primary.length === 0) {
    return;
  }
  setOpen();
});

const accountTypes = computed(() => {
  return Array.from(
    new Set(
      accountsWithBalanceSum.value.map(
        account => account.type)
    )
  );
});

const owners = computed(() => {
  return Array.from(
    new Set(
      accountsWithBalanceSum.value.map(
        account => account.owner
      )
    )
  );
});

function getBalancesByTypeSum(accountType) {
  return accountsByType.value[accountType].reduce((result, account) =>{
    return result + account.roll_up
  }, 0);
}

const allBalancesSum = ref(0);
watch(() => accountsWithBalanceSum.value, (accounts, _) => {
  allBalancesSum.value = accounts.reduce((result, account) => {
    return result + account.roll_up;
  }, 0);
});

function submitForm(account) {
  isShowAccountInput.value = false;
  if (account.id) {
    updateAccount(account);
  } else {
    createAccount(account);
  }
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
function clickAccount(id) {
  router.push(`/balances?accountId=${id}`);
}

</script>