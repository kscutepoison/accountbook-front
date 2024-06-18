import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useApi } from './api';
import { useAuthStore } from './auth';

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([]);
  const categoriesWithBalanceSum = ref([]);
  const { 
    getCategoriesAll, 
    getCategoryApi, 
    getCategoriesWithBalanceSumApi,
    postCategory, 
    patchCategory,
    deleteCategory, 
  } = useApi();
  const { token } = storeToRefs(useAuthStore());
  async function getCategories() {
    categories.value = await getCategoriesAll(token.value);
  }

  async function getCategoryById(categoryId) {
    const response = await getCategoryApi(categoryId, token.value);
    console.log(response);
    return response;
  }

  async function getCategoriesWithBalanceSum(params) {
    console.log(params);
    const response = await getCategoriesWithBalanceSumApi(params, token.value);
    categoriesWithBalanceSum.value = response;
    // console.log(response);
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

  async function removeCategory(category) {
    const categoryId = category.id;
    const res = await deleteCategory(categoryId, token.value);
  }

  const getCategory = (categoryId) => {
    const ct = categories.value.filter(category => {
      return category.id == categoryId;
    });
    if (ct.length === 1) {
      return ct[0];
    }
    return null;
  }

  return {
    categories,
    categoriesWithBalanceSum,
    getCategories,
    getCategory,
    getCategoryById,
    categoryTypeSet,
    categoriesAry,
    createCategory,
    updateCategory,
    removeCategory,
    getCategoriesWithBalanceSum,
  };
});