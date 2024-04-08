<template>
  <div>
    <div class="custom-hero">
      <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"><span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">AI</span> Engineer</h1>
      <hr class="w-48 h-1 mx-auto my-4 bg-gray-600 border-0 rounded md:my-10">
      <h2 class="mb-4 text-lg text-gray-900 dark:text-white md:text-sm lg:text-xl">by Nicolas Neudeck</h2>
    </div>
    <div class="max-w-screen-lg flex flex-col justify-between mx-auto p-4 mb-8">
      <div class="text-lg text-justify">
        As an AI Engineer, my focus is on designing, developing, and maintaining AI models and systems to tackle challenges and enhance decision-making within organizations. I have a deep interest in scalable architecture, DevOps pipelines, efficient programming, code quality, and best practices. On this page, I aim to share insights, tutorials, and some unique discoveries that might not be easily found elsewhere, all of which reflect my journey and learning in the field.
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
// import { useHead, useSeoMeta } from '@unhead/vue'
const latestBlogEntries = blogEntries.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
// useHead({
//   title: 'AI Engineer | Nicolas Neudeck',
//   meta: [
//     {
//       name: 'description',
//       content: 'My Personal Website about AI Engineering.'
//     },
//     {
//       name: 'keywords',
//       content: 'AI, Engineer, Nicolas Neudeck, Machine Learning, Scalable Architectures, Computer Science, Cooperation, Best Practices, Code Quality, Exceptional Products'
//     }
//   ]
// })
// useSeoMeta({
//   title: 'AI Engineer | Nicolas Neudeck',
//   description: 'My Personal Website about AI Engineering.',
//   ogDescription: 'My Personal Website about AI Engineering.',
//   ogTitle: 'AI Engineer | Nicolas Neudeck',
//   ogImage: 'https://i.postimg.cc/XYM5KnK4/DSC2584-50.jpg',
//   ogType: 'website',
//   ogUrl: 'https://nicolasneudeck.com/',
//   twitterCard: 'summary',
//   twitterTitle: 'AI Engineer | Nicolas Neudeck',
//   twitterDescription: 'My Personal Website about AI Engineering.',
//   twitterImage: 'https://i.postimg.cc/XYM5KnK4/DSC2584-50.jpg',
//   twitterSite: '@NeudeckNicolas',
//   twitterCreator: '@NeudeckNicolas',
//   twitterUrl: 'https://nicolasneudeck.com/'
// })
</script>