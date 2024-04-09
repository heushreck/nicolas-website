---
title: About
layout: home
description: A bit about me
head:
  - - meta
    - property: 'og:description'
      content: A bit about me
  - - meta
    - property: 'og:title'
      content: About | Nicolas Neudeck
  - - meta
    - property: 'og:image'
      content: https://i.postimg.cc/5NbVWXWX/android-chrome-512x512.png
  - - meta
    - property: 'og:url'
      content: https://nicolasneudeck.com/about
  - - meta
    - property: keywords
      content: 'About, AI, Engineer, Nicolas, Neudeck, CV, Lebenslauf'
  - - meta
    - name: 'twitter:card'
      content: summary
  - - meta
    - property: 'og:type'
      content: website
  - - meta
    - name: 'twitter:title'
      content: About | Nicolas Neudeck
  - - meta
    - name: 'twitter:description'
      content: A bit about me
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
      content: https://nicolasneudeck.com/about
  - - meta
    - name: google-site-verification
      content: y2TPQtEwoTHbX6abRZljBc_41I2dP1hcQqWvlsMvSG0
---
<script setup>
import Hero from '../components/Hero.vue'
import AboutView from '../components/AboutView.vue'
const title = "About Me"
const subtitle = "My name is Nicolas, I am a Data and AI Enthusiast from Munich, Germany."

</script>
# About
<Hero :title="title" :subtitle="subtitle" style="margin-bottom: 3rem;" />
<AboutView />
