<template>
    <div class="custom-hero flex flex-col items-center">
        <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Search</h1>
        <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
        <div class="flex flex-row mb-4 items-center">
            <h1 class="text-md text-gray-700 dark:text-white md:text-sm lg:text-lg">Blog articles tagged with </h1>
            <div class="ms-2 bg-emerald-100 text-emerald-800 text-sm font-medium px-2.5 py-0.5 rounded border border-emerald-400">{{ searchQuery }}</div>
        </div>
    </div>
    <div class="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4 column mb-4">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <BlogCard v-for="blogentry in filteredBlogEntries" :key="blogentry.id" :id="blogentry.id" :title="blogentry.title" :image="blogentry.image" :shortDescription="blogentry.shortDescription" :date="blogentry.date" />
        </div>
    </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import blogEntries from '../data/blog_entries/blogentries.json'
import BlogCard from '../components/BlogCard.vue'
const route = useRoute()
const searchQuery = route.params.searchQuery.toLowerCase()
// get the blog entry with the a tag that matches the blogEntryId
// make everything lowercase to make the search case insensitive
const filteredBlogEntries = blogEntries.filter(blogEntry => 
    blogEntry.tags.map(tag => tag.toLowerCase()).includes(searchQuery.toLowerCase())
)
</script>