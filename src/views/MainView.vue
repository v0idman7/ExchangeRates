<script setup>
import { DeleteOutlined } from "@ant-design/icons-vue";
import { onBeforeMount, ref, watch } from "vue";
import { RouterLink } from "vue-router";
import { getRates } from "@/api"


const localRates = ref([431, 449, 451, 456, 462]);
const data = ref([]);
let rates = {};
const options = ref([]);
const selected = ref([]);

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "Name",
  },
  {
    title: "Rate",
    dataIndex: "rate",
    key: "Rate",
  },
  {
    title: "Action",
    key: "action",
  },
];

onBeforeMount(async () => {
  const cacheRates = localStorage.getItem("localRates");
  if (cacheRates && cacheRates !== '[]') {
    localRates.value = JSON.parse(cacheRates);
  } else {
    localStorage.setItem("localRates", JSON.stringify(localRates.value));
  }

  rates = await getRates();
  options.value = []
  data.value = []
  Object.values(rates).forEach(rate => {
    if (localRates.value.includes(rate.id)) {
      data.value.push(rate)
    } else {
      options.value.push( {
        value: rate.id,
        label: rate.abreviation,
      })
    }
  })
});

watch(() => [...localRates.value], (value) => {
  localStorage.setItem("localRates", JSON.stringify(value))
})

const handleDelete = (id) => {
  const index = localRates.value.findIndex(item => item === id)
  if (index !== -1) {
    localRates.value.splice(index, 1)
    data.value.splice(index, 1)
  }

  const rate = rates[id]
  if (rate) {
    options.value.push({
      value: rate.id,
      label: rate.abreviation,
    })
  }
};

const handleAdd = () => {
  selected.value.forEach(rateId => {
    const index = options.value.findIndex(item => item.value === rateId)
    if (index !== -1) {
      options.value.splice(index, 1)
    }
    const rate = rates[rateId]
    if (rate) {
      data.value.push(rate)
    }
  })
  localRates.value.push(...selected.value)
  selected.value = [];
};
</script>

<template>
  <a-table
    style="max-width: 1000px; margin: 0 auto; padding: 0 10px"
    :dataSource="data"
    :columns="columns"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'Name'">
        <RouterLink :to="`/currency/${record.id}`">
          {{ record.name }}
        </RouterLink>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-button
          type="primary"
          shape="circle"
          @click="handleDelete(record.id)"
        >
          <template #icon><DeleteOutlined /></template>
        </a-button>
      </template>
    </template>
    <template #footer>
      <a-button style="margin-right: 15px" @click="handleAdd">Add</a-button>
      <a-select
        v-model:value="selected"
        mode="tags"
        style="width: 70%"
        placeholder="Tags Mode"
        :options="options"
      ></a-select>
    </template>
  </a-table>
</template>
