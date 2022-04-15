<script setup>
import { DeleteOutlined } from "@ant-design/icons-vue";
import { onMounted, ref, watchPostEffect } from "vue";
import { RouterLink } from "vue-router";
import axios from "axios";

const localRates = ref(["449", "431", "451", "456", "462"]);
const rates = ref([]);
const data = ref([]);
const options = ref([{}]);
const value = ref([]);

const columns = [
  {
    title: "Name",
    dataIndex: "Cur_Name",
    key: "Cur_Name",
  },
  {
    title: "Rate",
    dataIndex: "Cur_OfficialRate",
    key: "Cur_OfficialRate",
  },
  {
    title: "Action",
    key: "action",
  },
];

const fetchRates = async () => {
  try {
    const responce = await axios.get(
      "https://www.nbrb.by/api/exrates/rates?periodicity=0"
    );
    rates.value = responce.data;
  } catch (e) {
    console.error(e);
  }
};

onMounted(async () => {
  const localRatesString = localStorage.getItem("localRates");
  if (localRatesString) {
    localRates.value = localRatesString.split(" ");
  } else {
    localStorage.setItem("localRates", localRates.value.join(" "));
  }
  await fetchRates();
  options.value = rates.value
    .filter((rate) => !localRates.value.includes(String(rate.Cur_ID)))
    .map((rate) => ({
      value: String(rate.Cur_ID),
      label: rate.Cur_Abbreviation,
    }));
  data.value = rates.value.filter((rate) =>
    localRates.value.includes(String(rate.Cur_ID))
  );
});

watchPostEffect(() => {
  options.value = rates.value
    .filter((rate) => !localRates.value.includes(String(rate.Cur_ID)))
    .map((rate) => ({
      value: String(rate.Cur_ID),
      label: rate.Cur_Abbreviation,
    }));
  data.value = rates.value.filter((rate) =>
    localRates.value.includes(String(rate.Cur_ID))
  );
});

const handleDelete = (id) => {
  localRates.value = localRates.value.filter((item) => item !== String(id));
  localStorage.setItem("localRates", localRates.value.join(" "));
};

const handleAdd = () => {
  localRates.value = localRates.value.concat(...value.value);
  value.value = [];
  localStorage.setItem("localRates", localRates.value.join(" "));
};
</script>

<template>
  <a-table
    style="max-width: 1000px; margin: 0 auto; padding: 0 10px"
    :dataSource="data"
    :columns="columns"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'Cur_Name'">
        <RouterLink :to="`/currency/${record.Cur_ID}`">
          {{ `${record.Cur_Scale}&nbsp;${record.Cur_Name}` }}
        </RouterLink>
      </template>
      <template v-else-if="column.key === 'Cur_OfficialRate'">
        <span>
          {{
            `${record.Cur_Scale}&nbsp;${record.Cur_Abbreviation} = ${record.Cur_OfficialRate}&nbsp;BYN`
          }}
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button
          type="primary"
          shape="circle"
          @click="handleDelete(record.Cur_ID)"
        >
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </template>
    </template>
    <template #footer>
      <a-button style="margin-right: 15px" @click="handleAdd">Add</a-button>
      <a-select
        v-model:value="value"
        mode="tags"
        style="width: 70%"
        placeholder="Tags Mode"
        :options="options"
      ></a-select>
    </template>
  </a-table>
</template>
