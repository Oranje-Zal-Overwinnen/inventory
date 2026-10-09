<script setup lang="ts">
import { reactive, watch } from "vue";
import type { CreateProductInput } from "@/stores/inventory";

const props = withDefaults(
    defineProps<{
        product: CreateProductInput;
        submitLabel: string;
        isEdit?: boolean;
    }>(),
    {
        isEdit: false,
    },
);

const emit = defineEmits<{
    submit: [product: CreateProductInput];
    cancel: [];
}>();

const form = reactive({
    id: props.product.id ?? 0,
    name: props.product.name ?? "",
    actualAmount: props.product.actualAmount ?? 0,
    minimumAmount: props.product.minimumAmount ?? 0,
    price: props.product.price ?? 0,
});

watch(
    () => props.product,
    (product) => {
        form.id = product.id ?? 0;
        form.name = product.name ?? "";
        form.actualAmount = product.actualAmount ?? 0;
        form.minimumAmount = product.minimumAmount ?? 0;
        form.price = product.price ?? 0;
    },
    { immediate: true },
);

function submitProduct() {
    const trimmedName = form.name.trim();
    if (!trimmedName) {
        return;
    }
    const payload: CreateProductInput = {
        name: trimmedName,
        actualAmount: Math.max(0, Math.floor(Number(form.actualAmount)) || 0),
        minimumAmount: Math.max(0, Math.floor(Number(form.minimumAmount)) || 0),
        price: Math.max(0, Math.round(Number(form.price) * 100) / 100 || 0),
    };

    if (props.isEdit && form.id > 0) {
        payload.id = form.id;
    }

    emit("submit", payload);
}

function cancelProduct() {
    emit("cancel");
}
</script>

<template>
    <form @submit.prevent="submitProduct">
        <p v-if="isEdit && form.id > 0">
            <label for="product-id">Product-id</label>
            <input id="product-id" :value="form.id" type="number" readonly disabled />
        </p>
        <p>
            <label for="product-name">Naam</label>
            <input id="product-name" v-model.trim="form.name" type="text" required />
        </p>
        <p>
            <label for="product-price">Prijs (€)</label>
            <input id="product-price" v-model.number="form.price" type="number" min="0" step="0.01" required />
        </p>
        <p>
            <label for="product-actual-amount">Aanwezig aantal</label>
            <input id="product-actual-amount" v-model.number="form.actualAmount" type="number" min="0" step="1"
                required />
        </p>
        <p>
            <label for="product-minimum-amount">Mini. vereist aantal</label>
            <input id="product-minimum-amount" v-model.number="form.minimumAmount" type="number" min="0" step="1"
                required />
        </p>
        <p>
            <button type="submit">{{ submitLabel }}</button>
            <button type="button" @click="cancelProduct">Annuleren</button>
        </p>
    </form>
</template>
