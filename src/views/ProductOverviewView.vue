<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useInventoryStore } from "@/stores/inventory";

const { products, productCount, lowStockCount, totalOrderCost, setActualAmount, deleteProduct } =
    useInventoryStore();

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
}

function updateActualAmount(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = String(setActualAmount(id, input.value));
}

function removeProduct(id: number, name: string) {
    if (window.confirm(`Weet je zeker dat je "${name}" wilt verwijderen?`)) {
        deleteProduct(id);
    }
}
</script>

<template>
    <section>
        <h2>Productoverzicht</h2>
        <p>
            {{ productCount }} producten
            <span v-if="lowStockCount > 0" role="status">
                (waarvan {{ lowStockCount }} onder het minimum; te bestellen voor:
                {{ formatCurrency(totalOrderCost) }})</span>.
        </p>

        <table>
            <caption>
                Alle producten
            </caption>
            <thead>
                <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Prijs per stuk</th>
                    <th scope="col">Aanwezig aantal</th>
                    <th scope="col">Min. aantal</th>
                    <th scope="col">Acties</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td>{{ product.name }}</td>
                    <td>{{ formatCurrency(product.price) }}</td>
                    <td>
                        <input type="number" min="0" step="1" :value="product.actualAmount"
                            :aria-label="`Aanwezig aantal voor ${product.name}`"
                            @change="updateActualAmount(product.id, $event)" />
                    </td>
                    <td>{{ product.minimumAmount }}</td>
                    <td>
                        <RouterLink :to="{ name: 'edit-product', params: { id: product.id } }">
                            Bewerken
                        </RouterLink>
                        <button type="button" @click="removeProduct(product.id, product.name)">
                            Verwijderen
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <p v-if="products.length === 0">Er zijn nog geen producten in de inventaris.</p>
    </section>
</template>
