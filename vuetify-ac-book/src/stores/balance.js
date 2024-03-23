import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useBalanceStore = defineStore('balance', () => {
    const balance = ref({
        id: 1,
        title: '食料',
        date: '2024-02-14',
        expence: -2345,
        wallet: '謙吾',
        account: 'Recruit Card Plus',
        category: '食費',
    });
    function getBalanceById() {
        console.log(balance.title);
        axios.get('http://10.0.1.56:8081/balances')
          .then(function (response) {
            console.log(response);
            const res = response.data[0];
            console.log(res);
            balance.value.id = res.id;
            balance.value.title = res.title;
            balance.value.date = res.date;
            balance.value.expence = res.expence;
            balance.value.wallet = res.wallet;
            balance.value.account = res.account.account_name;
            balance.value.category = res.category.category_name;
          })
          .catch(function (error) {
            console.log(error);
          })
          .finally(function () {
            // always executed
          });
    }
  
    return { balance, getBalanceById }
});