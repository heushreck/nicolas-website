<template>
    <div class="custom-hero">
        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{{ blogEntry.title }}</h1>
        <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
        <h1 class="mb-4 text-lg text-gray-900 dark:text-white md:text-sm lg:text-xl">{{ blogEntry.date }}</h1>
    </div>
    <div class="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
        <div v-html="markdownToHtml" class="markdown"></div>
        <div class="mt-4">
            <RouterLink v-for="tag in blogEntry.tags" :to="`/blog/search/${tag}`" :key="tag" :class="`text-xs font-medium me-2 px-2.5 py-0.5 rounded ${randomColor()}`">{{ tag }}</RouterLink>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import blogEntries from '../data/blogentries.json';
import { marked } from 'marked';
import { RouterLink } from 'vue-router';
const blogentries = blogEntries;
const route = useRoute()
const blogEntryId = route.params.blogEntryId;
const blogEntry = blogentries.find(blogentry => blogentry.id === blogEntryId);
document.title = blogEntry.title;

const markdownToHtml = computed(() => {
    return blogEntry.text;
});

const randomColor = () => {
    const colors = [
        'bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400',
        'bg-gray-100 text-gray-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-400 border border-gray-500',
        'bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400',
        'bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400',
        'bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-yellow-300 border border-yellow-300',
        'bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-indigo-400 border border-indigo-400',
        'bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-purple-400 border border-purple-400',
        'bg-pink-100 text-pink-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-pink-400 border border-pink-400'];
    return colors[Math.floor(Math.random() * colors.length)];
}

</script>
