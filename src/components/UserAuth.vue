<template>
  <v-sheet class="pa-12" rounded>
    <v-responsive class="mx-auto" max-width="400">
    <v-card>
      <v-form v-model="form" @submit.prevent="onSubmit">
        <v-text-field v-model="email" :readonly="loading" :rules="[required]" class="mb-2" label="Email"
          clearable></v-text-field>

        <v-text-field v-model="password" :readonly="loading" :rules="[required]" label="Password"
          placeholder="Enter your password" clearable type="password"></v-text-field>
          <br>
        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card>
  </v-responsive>
  </v-sheet>
  
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useAccountsStore } from '@/stores/accounts';
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import router from "@/router";

const form = ref(false);
const email = ref();
const password = ref();
const loading = ref(false);
const { doLogin, doLogout } = useAuthStore();

async function onSubmit() {
  if (!form.value) return;
  doLogout();
  loading.value = true;
  await doLogin(email.value, password.value);
  const res = await doLogin(email.value, password.value);
  if (res) {
    loading.value = false;
    router.push('/accounts')
  } else {
    loading.value = false;
  }
}

function required(v) {
  return !!v || '必須入力です';
}


</script>