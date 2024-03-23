<template>
  <!-- <v-sheet width="400" height="1000" class="mx-auto"
    position="static"
    max-height="700"
    max-width="300"
    > -->
    <v-sheet width="auto" max-width="500" min-width="300">
      <v-form @submit.prevent>
        <v-text-field v-model="title" :rules="rules" label="タイトル"></v-text-field>
        <v-text-field label="日付" v-model="date" type="date"></v-text-field>
        <v-text-field v-model="expence" label="金額" prefix="¥">
        </v-text-field>
        <v-radio-group>
          <template v-slot:label>
            <div>財布</div>
          </template>
          <v-radio label="謙吾" value="謙吾"></v-radio>
          <v-radio label="ななみ" value="ななみ"></v-radio>
        </v-radio-group>
        <v-autocomplete label="店名"
          :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>
        <v-autocomplete label="アカウント"
          :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"></v-autocomplete>
        <v-checkbox label="確認"></v-checkbox>
        <v-textarea label="メモ"></v-textarea>
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </v-sheet>
</template>

<script setup>
import { ref, computed } from "vue"

const balance = ref({
  firstName: '',
  title: '',
  date: '',
  expence: 0,
  rules: [
    value => {
      if (value) return true;
      return '必須入力です。';
    }
  ]
});
</script>