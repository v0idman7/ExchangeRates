<script setup>
import { useRouter, RouterView } from "vue-router";
import { HomeOutlined } from "@ant-design/icons-vue";

const router = useRouter();
</script>

<template>
  <a-page-header
    style="border: 1px solid rgb(235, 237, 240)"
    title="Exchange
  Rates"
    @back="() => router.push('/')"
  >
    <template #backIcon>
      <HomeOutlined />
    </template>
  </a-page-header>
  <RouterView />
</template>

<style></style>
