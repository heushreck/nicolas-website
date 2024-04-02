<template>
  <div class="custom-hero">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">My Blog</h1>
    <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
    <h1 class="mb-4 text-lg text-gray-900 dark:text-white md:text-sm lg:text-xl">Some stuff I came across...</h1>
  </div>
  <div class="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <BlogCard v-for="blogentry in blogentries" :key="blogentry.id" :id="blogentry.id" :title="blogentry.title" :image="blogentry.image" :shortDescription="blogentry.shortDescription" :date="blogentry.date" />
    </div>
  </div>

</template>

<script setup>
import BlogCard from '../components/BlogCard.vue';
import blogEntries from '../data/blog_entries/blogentries.json';
const blogentries = blogEntries;
</script>
