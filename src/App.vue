<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <header>
        <h1>Inventarissysteem</h1>
        <nav>
            <ul>
                <li>
                    <RouterLink :to="{ name: 'overview' }">Overzicht</RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'add-product' }">Nieuw Product</RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'order' }">Bestellen</RouterLink>
                </li>
            </ul>
        </nav>
    </header>
    <main>
        <RouterView />
    </main>
</template>
