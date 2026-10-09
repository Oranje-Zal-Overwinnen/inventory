<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import ProductForm from "@/components/ProductForm.vue";
import { useInventoryStore, type CreateProductInput } from "@/stores/inventory";

const props = defineProps<{
    id: string;
}>();

const { getProductById, updateProduct } = useInventoryStore();
const router = useRouter();
const errorMessage = ref("");

const productId = computed(() => Number(props.id));
const product = computed(() => getProductById(productId.value));

function handleSubmit(input: CreateProductInput) {
    if (!updateProduct(productId.value, input)) {
        errorMessage.value = "Kon product niet bijwerken.";
        return;
    }
    router.push({ name: "overview" });
}

function cancelEdit() {
    router.push({ name: "overview" });
}
</script>

<template>
    <section>
        <h2>Product aanpassen</h2>
        <template v-if="product">
            <p>Pas de gegevens van {{ product.name }} aan.</p>
            <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
            <ProductForm :product="product" :is-edit="true" submit-label="Aanpassen" @submit="handleSubmit"
                @cancel="cancelEdit" />
        </template>
        <template v-else>
            <p>Product met id {{ id }} is niet gevonden.</p>
            <p>
                <RouterLink :to="{ name: 'overview' }">Terug naar het overzicht</RouterLink>
            </p>
        </template>
    </section>
</template>
