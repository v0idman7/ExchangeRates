import { createRouter, createWebHistory } from "vue-router";
import CurrencyView from "@/views/CurrencyView.vue";
import MainView from "@/views/MainView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: MainView,
    },
    {
      path: "/currency/:id",
      name: "currency",
      component: CurrencyView,
    },
  ],
});

export default router;
