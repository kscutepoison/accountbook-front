<template>
  <v-bottom-navigation grow>
    <v-btn value="account" @click="clickNavButton('accounts')">
      <v-icon>mdi-heart</v-icon>
        <span>アカウント</span>
    </v-btn>

    <v-btn value="budget" @click="clickNavButton('budget')">
      <v-icon>mdi-heart</v-icon>
      <span>予算</span>
    </v-btn>

    <v-btn value="category">
      <v-icon>mdi-history</v-icon>

      <span>カテゴリ</span>
    </v-btn>

    <v-btn value="nearby">
      <v-icon>mdi-map-marker</v-icon>

      <span>Nearby</span>
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
//
  import { useRouter, useRoute } from 'vue-router'
  const router = useRouter();
  const route = useRoute();
  const clickNavButton = val => {
    console.log(val);
    router.push('/' + val);
  };
</script>
