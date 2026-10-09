<script setup lang="ts">
import { reactive } from "vue";
import { RouterLink, useRouter } from "vue-router";
import ProductForm from "@/components/ProductForm.vue";
import { useInventoryStore, type CreateProductInput } from "@/stores/inventory";

const { addProduct } = useInventoryStore();
const router = useRouter();

const draft = reactive<CreateProductInput>({
    name: "",
    actualAmount: 0,
    minimumAmount: 0,
    price: 0,
});

function handleSubmit(product: CreateProductInput) {
    addProduct(product);
    router.push({ name: "overview" });
}

function cancelAdd() {
    router.push({ name: "overview" });
}
</script>

<template>
    <section>
        <h2>Product toevoegen</h2>
        <ProductForm :product="draft" submit-label="Toevoegen" @submit="handleSubmit" @cancel="cancelAdd" />
        <p>
            <RouterLink :to="{ name: 'overview' }">Terug naar het overzicht</RouterLink>
        </p>
    </section>
</template>
