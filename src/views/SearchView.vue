<template>
    <div class="custom-hero">
        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{{ blogEntryId }}.</h1>
        <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const blogEntryId = route.params.searchQuery;
</script>