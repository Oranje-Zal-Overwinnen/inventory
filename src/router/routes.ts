import type { RouteRecordRaw } from "vue-router";
import ProductOverviewView from "@/views/ProductOverviewView.vue";
import ProductAddView from "@/views/ProductAddView.vue";
import ProductEditView from "@/views/ProductEditView.vue";
import OrderView from "@/views/OrderView.vue";
import NotFoundView from "@/views/NotFoundView.vue";

export const routes: RouteRecordRaw[] = [
    { path: "/", name: "overview", component: ProductOverviewView },
    { path: "/toevoegen", name: "add-product", component: ProductAddView },
    { path: "/bewerken/:id", name: "edit-product", component: ProductEditView, props: true },
    { path: "/bestellen", name: "order", component: OrderView },
    { path: "/:pathMatch(.*)*", name: "not-found", component: NotFoundView },
];
