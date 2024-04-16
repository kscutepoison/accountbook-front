import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useApi } from './api';
import { useAuthStore } from './auth';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([]);
  const { getCategoriesAll, getCategory, postCategory, patchCategory } = useApi();
  const { token } = storeToRefs(useAuthStore());
  async function getCategories() {
    categories.value = await getCategoriesAll(token.value);
  }

  async function getCategoryById(categoryId) {
    const response = await getCategory(categoryId, token.value);
    console.log(response);
    return response;
  }

  const categoryTypeSet = computed(() => {
    const res = new Set();
    categories.value.forEach(category => {
      res.add(category.type);
    });
    return res;
  });
  const categoriesAry = computed(() => {
    const res = {};
    categories.value.forEach(category => {
      if(!res[category.type]) {
        res[category.type] = [];
      }
      res[category.type].push(category);
    });
    return res;
  });

  async function createCategory(category) {
    const res = await postCategory(category, token.value);
    if (res) {
      categories.value.push(res);
    }
  }

  async function updateCategory(category) {
    const categoryId = category.id;
    const res = await patchCategory(categoryId, category, token.value);
  }

  return {
    categories,
    getCategories,
    getCategoryById,
    categoryTypeSet,
    categoriesAry,
    createCategory,
    updateCategory,
  };
});