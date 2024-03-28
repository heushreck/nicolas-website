<template>
  <header>
    <div class="wrapper">
      <NavBar />
    </div>
  </header>

  <article>
    <router-view />
  </article>

  <Footer />
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>
