<template>
  <v-card class="mx-auto" max-width="700" min-width="300">
    <v-app-bar>
      <template v-slot:prepend>
        <v-icon icon="mdi-shape-plus"></v-icon>
      </template>
      <v-app-bar-title>カテゴリ</v-app-bar-title>
      <!-- <template v-slot:append> -->
        <v-text-field
          v-model="searchItems.category_name"
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
    <v-dialog
          v-model="searchDialog"
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="text-h5">カテゴリ絞込</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="18"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="searchItems.category_name"
                      label="カテゴリ名"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="18"
                    md="4"
                    sm="6"
                  >
                    <v-select
                      label="種別"
                      :items="categoryTypes"
                      v-model="searchItems.type"
                      chips
                      multiple
                    ></v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="18"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="searchItems.date_start"
                      label="集計開始日"
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col
                    cols="18"
                    md="4"
                    sm="6"
                  >
                    <v-text-field
                      v-model="searchItems.date_end"
                      label="集計終了日"
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
      <v-list-group v-for="(categories, type) in categoriesByType" :value="type">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="type">
            <template v-slot:prepend>
              <v-icon :icon="open.includes(type) ? 'mdi-menu-down' : 'mdi-menu-right'"></v-icon>
            </template>
            <template v-slot:append>
            </template>
          </v-list-item>
        </template>
        <v-list-item v-for="category in categories" :key="category.id" 
            :title="category.category_name"
          :value="category.category_name"
          @click="clickCategory(category.id)"
          >
          <template v-slot:prepend>
            <v-icon :icon="category.icon"></v-icon>
          </template>
          <template v-slot:append>
            <v-chip :color="category.roll_up >= 0 ? 'green' : 'red'">
              {{ category.roll_up.toLocaleString() }}
            </v-chip>
            <v-btn color="blue-grey-lighten-4" icon="mdi-information" variant="text" @click.stop="editCategory(category)"></v-btn>
          </template>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-card>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="auto">
        <v-btn density="default" @click="addCategory">カテゴリ追加</v-btn>
      </v-col>

      <v-col cols="auto">
        <v-btn density="default">リスト編集</v-btn>
      </v-col>

    </v-row>
  </v-container>
  <v-dialog width="auto" scrollable v-model="isShowCategoryInput" persistent>
    <CategoryInput @submit-form="submitForm" :category="category"></CategoryInput>
    <v-btn @click="isShowCategoryInput = false">
      閉じる
    </v-btn>
    <!-- </v-overlay> -->
  </v-dialog>
  <!-- <div>{{ accountsAry[0].id }}</div>
  <div>{{ accountsAry[0].account_name }}</div> -->
</template>

<script setup>
import { ref, computed, watch } from "vue"
import { storeToRefs } from "pinia";
import router from "@/router";
import dayjs from "dayjs";
import { useCategoriesStore } from "@/stores/categories";


const searchDialog = ref(false);
const searchItems = ref({});
function toggleSearchDialog(isOpen) {
  searchDialog.value = isOpen;
}

function clearSearchItems() {
  searchItems.value = {
    category_name: null,
    type: null,
    date_start: dayjs().date(1).format('YYYY-MM-DD'),
    date_end: dayjs().date(1).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD')
  };
}
clearSearchItems();

watch(() => searchItems.value.date_start, (dt, _) => {
  if (dt) {
    searchItems.value.date_end = dayjs(searchItems.value.date_start)
      .date(1).add(1, 'months').add(-1, 'days').format('YYYY-MM-DD')
  }
});

const isShowCategoryInput = ref(false);
const open = ref(['支出']);

const categoriesStore = useCategoriesStore();
const { categoriesWithBalanceSum } = storeToRefs(categoriesStore);
const { 
  getCategories, 
  createCategory, 
  updateCategory, 
  getCategoriesWithBalanceSum 
} = categoriesStore;


getCategoriesWithBalanceSum(
  (({date_start, date_end}) => ({date_start, date_end}))(searchItems.value)
);
watch(() => searchDialog.value, (isOpen, _) => {
  if (!isOpen) {
    getCategoriesWithBalanceSum(
      (({date_start, date_end}) => ({date_start, date_end}))(searchItems.value)
    );
  }
});

const categoriesByType = computed(() => {
  const categories = categoriesWithBalanceSum.value.filter(category => {
    const res = [true];
    if (searchItems.value.category_name) {
      res.push(category.category_name.indexOf(searchItems.value.category_name) >= 0);
    }
    if (searchItems.value.type &&
    searchItems.value.type.length > 0) {
      res.push(searchItems.value.type.some(type => {
        return category.type.indexOf(type) >= 0;
      }));
    }
    return !res.includes(false);
  });
  return Object.groupBy(
    categories,
    category => 
    category.type
  );
});

function setOpen() {
  open.value = Array.from(
    new Set(
      Object.entries(categoriesByType.value).map(
        ([key, value]) => key
      )
    )
  );
}

watch(() => searchItems.value.category_name, (name, _) => {
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

const categoryTypes = computed(() => {
  return Array.from(
    new Set(
      categoriesWithBalanceSum.value.map(
        category => category.type)
    )
  );
});

function submitForm(category) {
  isShowCategoryInput.value = false;
  if (category.id) {
    updateCategory(category);
  } else {
    createCategory(category);
    getCategories();
  }
}
const category = ref();
function addCategory() {
  category.value = null;
  isShowCategoryInput.value = true;
}
function editCategory(target) {
  category.value = target;
  isShowCategoryInput.value = true;
}
function clickCategory(id) {
  router.push(`/balances?categoryId=${id}`);
}

</script>