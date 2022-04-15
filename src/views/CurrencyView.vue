<script setup>
import { getDynamics } from "@/api"
import { ref, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const { id: currencyId } = useRoute().params;

const data = ref([]);

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "Date",
  },
  {
    title: "Rate",
    dataIndex: "price",
    key: "Price",
  },
];

onBeforeMount(() => {
  const id = parseInt(currencyId)
  if (isNaN(id)) {
    router.push({ name: 'home' });
  } else {
    const startDate = new Date()
    startDate.setDate(new Date().getDate() - 7)

    getDynamics(id, startDate)
      .then(exchange => {
        data.value = exchange
      })
  }
});
</script>

<template>
  <a-table
    class="currency-table"
    :dataSource="data"
    :columns="columns"
  />
</template>

<style scoped>
.currency-table {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 10px;
}
</style>
