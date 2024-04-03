<template>
  <div>
    <div class="custom-hero">
      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">AI</span> Engineer</h1>
      <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
      <h1 class="mb-4 text-lg text-gray-900 dark:text-white md:text-sm lg:text-xl">by Nicolas Neudeck</h1>
    </div>
    <div class="max-w-screen-lg flex flex-col justify-between mx-auto p-4 mb-8">
      <div class="text-lg text-justify">
        Welcome to this corner of the web, where I present my passions, projects, and efforts. These virtual walls house not only a selection of my work but also a series of carefully compiled tutorials and creative solutions that I could not easily find elsewhere on the internet. I'm a passionate AI engineer who is constantly motivated by the spirit of cooperation that exists among computer scientists around the world. In my daily activities, I focus on creating scalable architectures for machine learning applications, while also deeply caring about efficiency, adhering to best practices, and maintaining code quality, principles I consider essential for delivering exceptional products.
      </div>
      <!-- My Current Interests -->
      <h2 class="mt-16 text-3xl text-gray-900 dark:text-white">My Current Interests</h2>
      <hr class="w-24 h-0.5 bg-gray-600 border-0 rounded my-4 mb-8">
      <FlowbiteAccordion :open-first-item="false" class="w-full">
        <FwbAccordionPanel v-for="(item, index) in accordionItems" :key="index">
          <FwbAccordionHeader :class="item.headerClass">
            <div class="flex flex-row">
              <div v-html="item.headerIcon"></div>
              <div>{{ item.headerText }}</div>
            </div>
          </FwbAccordionHeader>
          <FwbAccordionContent>
            <div>
              <p v-for="(paragraph, pIndex) in item.content" :key="pIndex" class="mb-2 text-gray-500 dark:text-gray-400">
                {{ paragraph.text }}
              </p>
            </div>
          </FwbAccordionContent>
        </FwbAccordionPanel>
      </FlowbiteAccordion>
      <!-- Latest Blog Posts -->
      <h2 class="mt-16 text-3xl text-gray-900 dark:text-white">Newest Insights & Stories</h2>
      <hr class="w-24 h-0.5 bg-gray-600 border-0 rounded my-4 mb-8">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <BlogCard v-for="blogentry in latestBlogEntries" :key="blogentry.id" :id="blogentry.id" :title="blogentry.title" :image="blogentry.image" :shortDescription="blogentry.shortDescription" :date="blogentry.date" />
      </div>
    </div>
  </div>
</template>

<script setup>
import FlowbiteAccordion from '../components/FwbAccordion/FwbAccordion.vue'
import FwbAccordionPanel from '../components/FwbAccordion/FwbAccordionPanel.vue'
import FwbAccordionHeader from '../components/FwbAccordion/FwbAccordionHeader.vue'
import FwbAccordionContent from '../components/FwbAccordion/FwbAccordionContent.vue'
import accordionItems from '../data/home/interests.json';
import BlogCard from '../components/BlogCard.vue';
import blogEntries from '../data/blog_entries/blogentries.json';
// get latest three blog entries by looking at date
const latestBlogEntries = blogEntries.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
</script>