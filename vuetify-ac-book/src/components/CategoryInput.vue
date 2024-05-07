<template>
  <v-sheet width="auto" max-width="500" min-width="300">
    <v-form @submit.prevent>
      <v-text-field v-model="category.category_name" label="カテゴリ名"></v-text-field>
      <v-text-field v-model="category.type" label="収支区分" type="text"></v-text-field>
      <v-btn type="submit" block class="mt-2" @click="submitForm">登録</v-btn>
    </v-form>
  </v-sheet>
</template>

<script setup>
import { ref, computed, useAttrs, onMounted } from "vue"
import { useCategoriesStore } from '@/stores/categories';
import { useAccountsStore } from '@/stores/accounts';
import { storeToRefs } from "pinia";

const category = ref({
  category_name: '',
  type: '',
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
const categoriesStore = useCategoriesStore();
const { getCategories, createCategory, updateCategory, removeCategory } = categoriesStore;
const create = () => {
  createCategory(category.value);
}
const emit = defineEmits(['submitForm']);

function submitForm() {
  console.log('emit', category.value);
  emit('submitForm', category.value);
}
if (attrs.category) {
  category.value = attrs.category;
}
</script>