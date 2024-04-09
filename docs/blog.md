---
title: Blog
layout: home
description: My Blog about AI Engineering.
head:
  - - meta
    - property: 'og:description'
      content: My Blog about AI Engineering.
  - - meta
    - property: 'og:title'
      content: Blog | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: https://i.postimg.cc/5NbVWXWX/android-chrome-512x512.png
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com/blog
  - - meta
    - property: keywords
      content: 'AI, Engineer, Nicolas, Neudeck, Blog, Stories'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: Blog | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: My Personal Blog about AI Engineering.
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
      content: https://nicolasneudeck.com/blog
  - - meta
    - name: google-site-verification
      content: y2TPQtEwoTHbX6abRZljBc_41I2dP1hcQqWvlsMvSG0
---
<script setup>
import Hero from '../components/Hero.vue'
import BlogView from '../components/BlogView.vue'
const title = "Blog"
const subtitle = "Some interesting stuff I came across..."

</script>
# Blog
<Hero :title="title" :subtitle="subtitle" style="margin-bottom: 3rem;" />
<BlogView />