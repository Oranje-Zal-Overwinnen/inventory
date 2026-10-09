<script setup lang="ts">
import { computed } from "vue";
import { RouterLink } from "vue-router";
import { useInventoryStore } from "@/stores/inventory";

const { lowStockProducts, lowStockCount, totalOrderCost } = useInventoryStore();

function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
}

const totalItemsToOrder = computed(() =>
    lowStockProducts.value.reduce(
        (total, product) => total + (product.minimumAmount - product.actualAmount),
        0,
    ),
);
</script>

<template>
    <section>
        <h2>Bestellijst</h2>
        <p>Deze producten zitten onder het minimum aantal en moeten worden besteld.</p>

        <template v-if="lowStockCount > 0">
            <p>
                Totaal te bestellen: <strong>{{ totalItemsToOrder }} stuks</strong> voor een
                totaalbedrag van <strong>{{ formatCurrency(totalOrderCost) }}</strong>.
            </p>

            <table>
                <caption>
                    Producten waarvan het aanwezige aantal onder het minimum ligt
                </caption>
                <thead>
                    <tr>
                        <th scope="col">Productnaam</th>
                        <th scope="col">Prijs per stuk</th>
                        <th scope="col">Aanwezig</th>
                        <th scope="col">Minimum</th>
                        <th scope="col">Tekort (te bestellen)</th>
                        <th scope="col">Totaal per regel</th>
                        <th scope="col">Acties</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in lowStockProducts" :key="product.id">
                        <td>{{ product.name }}</td>
                        <td>{{ formatCurrency(product.price) }}</td>
                        <td>{{ product.actualAmount }}</td>
                        <td>{{ product.minimumAmount }}</td>
                        <td>{{ product.minimumAmount - product.actualAmount }}</td>
                        <td>
                            {{
                                formatCurrency(
                                    (product.minimumAmount - product.actualAmount) * product.price,
                                )
                            }}
                        </td>
                        <td>
                            <RouterLink :to="{ name: 'edit-product', params: { id: product.id } }">
                                Bewerken
                            </RouterLink>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <th scope="row" colspan="4">Totaal</th>
                        <td>{{ totalItemsToOrder }} stuks</td>
                        <td>{{ formatCurrency(totalOrderCost) }}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>
        </template>

        <p v-else>Er zijn momenteel geen producten onder het minimum aantal.</p>

        <p>
            <RouterLink :to="{ name: 'overview' }">Terug naar het overzicht</RouterLink>
        </p>
    </section>
</template>
