<template>
  <v-bottom-navigation grow>
    <v-btn value="account" @click="clickNavButton('accounts')">
      <v-icon>mdi-wallet</v-icon>
        <span>アカウント</span>
    </v-btn>

    <v-btn value="category"  @click="clickNavButton('categories')">
      <v-icon>mdi-shape-plus</v-icon>

      <span>カテゴリ</span>
    </v-btn>

    <v-btn value="all" @click="clickNavButton('balances')">
      <v-icon>mdi-menu</v-icon>
      <span>ALL</span>
    </v-btn>

    <v-btn value="budget" @click="clickNavButton('budget')">
      <v-icon>mdi-heart</v-icon>
      <span>予算</span>
    </v-btn>

  </v-bottom-navigation>
</template>

<script setup>
//
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter();
  const route = useRoute();
  const clickNavButton = val => {
    router.push('/' + val);
  };
</script>
