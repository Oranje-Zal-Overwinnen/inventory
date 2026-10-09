<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>

<template>
    <section>
        <h2>Pagina niet gevonden</h2>
        <p>De opgevraagde pagina bestaat niet.</p>
        <p>
            <RouterLink :to="{ name: 'overview' }">Terug naar het overzicht</RouterLink>
        </p>
    </section>
</template>
