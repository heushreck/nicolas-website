<template>
  <div class="custom-hero">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">Nicolas Neudeck</h1>
    <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
    <h1 class="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-2xl lg:text-4xl"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">AI</span> Engineer</h1>
  </div>
  <div class="max-w-screen-lg flex flex-col justify-between items-center mx-auto p-4">
    <div>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
    </div>
    <!-- My Current Interests -->
    <h2 class="mb-4 mt-10 text-2xl font-bold text-gray-900 dark:text-white">My Current Interests</h2>
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
    <h2 class="mb-4 mt-10 text-2xl font-bold text-gray-900 dark:text-white">Newest Insights & Stories</h2>
    <div class="flex flex-row gap-4 mb-4">
      <BlogCard v-for="blogentry in latestBlogEntries" :id="blogentry.id" :title="blogentry.title" :image="blogentry.image" :shortDescription="blogentry.shortDescription" :date="blogentry.date" />
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