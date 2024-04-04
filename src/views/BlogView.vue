<template>
  <div>
    <div class="custom-hero">
      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">My Blog</h1>
      <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
      <h1 class="mb-4 text-lg text-gray-900 dark:text-white md:text-sm lg:text-xl">Some stuff I came across...</h1>
    </div>
    <div class="max-w-screen-lg flex flex-wrap items-center justify-between mx-auto p-4">
      <transition-group
        appear
        @before-enter="beforeEnter"
        @enter="enter"
        tag="div"
        class="grid grid-cols-2 md:grid-cols-3 gap-4"
      >
        <BlogCard v-for="(blogentry, index) in blogentries" :data-index="index" :key="blogentry.id" :id="blogentry.id" :title="blogentry.title" :image="blogentry.image" :shortDescription="blogentry.shortDescription" :date="prettyDate(blogentry.date)" />
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import BlogCard from '../components/BlogCard.vue';
import blogEntries from '../data/blog_entries/blogentries.json';
import gsap from 'gsap';
import { useHead } from '@unhead/vue';

useHead({
  title: 'Blog | Nicolas Neudeck',
  meta: [
    {
      name: 'description',
      content: 'Interesting stuff I cam across...'
    },
    {
      name: 'keywords',
      content: 'Nicolas Neudeck, Blog, Stories, Insights, AI Engineer'
    },
  ],
});


const blogentries = blogEntries;
blogentries.sort((a, b) => new Date(b.date) - new Date(a.date));

const beforeEnter = (el) => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(150px)';
};

const enter = (el, done) => {
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    onComplete: done,
    delay: 0.2 + el.dataset.index * 0.2,
  });
};

const prettyDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

</script>
