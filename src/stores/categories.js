import { ref, computed, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useApi } from './api';
import { useAuthStore } from './auth';
import dayjs from "dayjs";

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

  const open = ref([]);
  function resetOpen() {
    const list = localStorage.getItem('category_open_list');
    if (!list) {
      open.value = [];
      return;
    }
    open.value = list.split(',');
  }
  watch(
    () => open.value,
    (newValue, oldValue) => {
      localStorage.setItem('category_open_list', newValue.join(','));
    },
    { deep: false }
  );

  const searchItems = ref({});
  function clearSearchItems() {
    const json = localStorage.getItem('category_search_items');
    if (!json) {
      searchItems.value = {
        category_name: null,
        type: null,
        date_start: dayjs().date(1).format("YYYY-MM-DD"),
        date_end: dayjs()
          .date(1)
          .add(1, "months")
          .add(-1, "days")
          .format("YYYY-MM-DD"),
      };
      return;
    }
    searchItems.value = JSON.parse(json);
  }

  watch(
    () => searchItems.value,
    (newValue, oldValue) => {
      localStorage.setItem('category_search_items', JSON.stringify(newValue));
    },
    { deep: true }
  );

  watch(
    () => searchItems.value.date_start,
    (dt, _) => {
      if (dt) {
        searchItems.value.date_end = dayjs(searchItems.value.date_start)
          .date(1)
          .add(1, "months")
          .add(-1, "days")
          .format("YYYY-MM-DD");
      }
    }
  );

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
    open,
    resetOpen,
    searchItems,
    clearSearchItems,
  };
});
