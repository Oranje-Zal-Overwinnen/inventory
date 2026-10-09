import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createInventoryStore, inventoryStoreKey } from "@/stores/inventory";

const app = createApp(App);

app.provide(inventoryStoreKey, createInventoryStore());
app.use(router);
app.mount("#app");
