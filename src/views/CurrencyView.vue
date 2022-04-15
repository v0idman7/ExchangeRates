<script setup>
import axios from "axios";
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const data = ref([]);
const endDate = ref(new Date());
const now = new Date();
const start = new Date(now.setDate(now.getDate() - 7));
const startDate = ref(start);

const columns = [
  {
    title: "Date",
    dataIndex: "Date",
    key: "Date",
  },
  {
    title: "Rate",
    dataIndex: "Cur_OfficialRate",
    key: "Cur_OfficialRate",
  },
];

async function fetchData(startDate, endDate) {
  try {
    const responce = await axios.get(
      `https://www.nbrb.by/api/exrates/rates/dynamics/${
        route.params.id
      }?startdate=${startDate.toISOString()}&enddate=${endDate.toISOString()}`
    );
    data.value = responce.data.map((item) => ({
      ...item,
      Date: formatDate(item.Date),
    }));
  } catch (e) {
    console.error(e);
  }
}

watchEffect(() => {
  fetchData(startDate.value, endDate.value);
});

const formatDate = (dateString) => {
  const date = new Date(dateString);

  let dd = date.getDate();
  if (dd < 10) dd = "0" + dd;

  let mm = date.getMonth() + 1;
  if (mm < 10) mm = "0" + mm;

  let yy = date.getFullYear() % 100;
  if (yy < 10) yy = "0" + yy;

  return dd + "." + mm + "." + yy;
};
</script>

<template>
  <a-table
    style="max-width: 1000px; margin: 0 auto; padding: 0 10px"
    :dataSource="data"
    :columns="columns"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'Cur_OfficialRate'">
        <span>
          {{ `${record.Cur_OfficialRate}&nbsp;BYN` }}
        </span>
      </template>
    </template>
  </a-table>
</template>
