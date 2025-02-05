import Vue from "vue";
import VueRouter from "vue-router";

import LocationsPage from "../components/locations/Locations.vue";
import InventoryPage from "../components/inventory/Inventory.vue";
import ShopPage from "../components/shop/Shop.vue";
import FishingPage from "../components/fishing/Fishing.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/locations",
  },
  {
    path: "/locations",
    name: "Locations",
    component: LocationsPage,
  },
  {
    path: "/inventory",
    name: "Inventory",
    component: InventoryPage,
  },
  {
    path: "/shop",
    name: "Shop",
    component: ShopPage,
  },
  {
    path: "/fishing",
    name: "Fishing",
    component: FishingPage,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
