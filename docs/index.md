---
# https://vitepress.dev/reference/default-theme-home-page
layout: home
title: AI Engineer
description: My Personal Website about AI Engineering.
head:
  - - meta
    - property: 'og:description'
      content: My Personal Website about AI Engineering.
  - - meta
    - property: 'og:title'
      content: AI Engineer | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: https://i.postimg.cc/5NbVWXWX/android-chrome-512x512.png
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com
  - - meta
    - property: keywords
      content: 'AI, Engineer, Nicolas, Neudeck, Blog, Python'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: AI Engineer | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: My Personal Website about AI Engineering.
  - - meta
    - name: 'twitter:image'
      content: https://i.postimg.cc/5NbVWXWX/android-chrome-512x512.png
  - - meta
    - name: 'twitter:site'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:creator'
      content: '@NeudeckNicolas'
  - - meta
    - name: 'twitter:url'
      content: https://nicolasneudeck.com
  - - meta
    - name: google-site-verification
      content: 9agtSktJYcUTkHEIMiXa-0GX5OAFp-aq-M-sGdHEDm8

---
<script setup>
import BlogCard from '../components/BlogCard.vue'
import Hero from '../components/Hero.vue'
import blogEntries from '../data/blog_entries.json';
const latestBlogEntries = blogEntries.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
const title = "AI Enginner"
const subtitle = "by Nicolas Neudeck"
const prettyDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};
</script>
# AI Engineer
<Hero :title="title" :subtitle="subtitle" style="margin-bottom: 3rem;"/>
As an AI Engineer, my focus is on designing, developing, and maintaining AI models and systems to tackle challenges and enhance decision-making within organizations. I have a deep interest in scalable architecture, DevOps pipelines, efficient programming, code quality, and best practices. On this page, I aim to share insights, tutorials, and some unique discoveries that might not be easily found elsewhere, all of which reflect my journey and learning in the field.
<h2 class="heading">My Current Interests</h2>
<hr class="hr-line">

::: details Automated AWS Deployment
Automate the deployment of resources across multiple accounts and regions using a pipeline, ensuring efficient setup for both development and production environments. This approach supports consistent configurations, integrates with CI/CD processes, and includes rollback capabilities for improved stability.
:::

::: details Typescript
For my current role, I am learning TypeScript—a language widely used for both frontend and backend development. With a background in Python and Java, I find TypeScript straightforward to read and adopt. The main challenges lie in understanding Node.js threading and web server architecture, but overall the transition has been smooth.
:::

<h2 class="heading">Newest Insights & Stories</h2>
<hr class="hr-line">
<div class="featured">
  <BlogCard v-for="blogentry in latestBlogEntries" :key="blogentry.id" :id="blogentry.id" :title="blogentry.title" :image="blogentry.image" :shortDescription="blogentry.shortDescription" :date="prettyDate(blogentry.date)" />
</div>


<style>
  .heading {
    margin-top: 4rem; 
    line-height: 2.25rem;
    font-size: 1.875rem !important;
    font-weight: 400 !important;
  }
  .hr-line {
    margin-top: 1rem;
    margin-bottom: 1rem; 
    margin-bottom: 2rem; 
    border-radius: 0.25rem; 
    border-width: 0; 
    width: 6rem; 
    height: 0.125rem; 
    background-color: #6B7280;
  }
  .featured {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr)); 
    gap: 1rem;
    @media (min-width: 768px) { 
      grid-template-columns: repeat(3, minmax(0, 1fr)); 
    }
  }
</style>