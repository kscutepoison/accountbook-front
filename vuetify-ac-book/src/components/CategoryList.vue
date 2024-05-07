<template>
  <v-card class="mx-auto" max-width="500" min-width="300">
    <v-list v-model:opened="open">
      <v-list-group v-for="(categories, type) in categoriesAry" :value="type">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" :title="type"></v-list-item>
        </template>
        <v-list-item v-for="category in categories" :key="category.id" 
            :title="category.category_name"
          :value="category.category_name"
          @click="clickCategory(category.id)"
          >
          <template v-slot:append>
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
import { ref, computed, onMounted } from "vue"
import { useCategoriesStore } from "@/stores/categories";
import { storeToRefs } from "pinia";
import router from "@/router";

const isShowCategoryInput = ref(false);
const open = ref([]);

const categoriesStore = useCategoriesStore();
const { categoryTypeSet, categoriesAry } = storeToRefs(categoriesStore);
const { getCategories, createCategory, updateCategory } = categoriesStore;
getCategories();

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