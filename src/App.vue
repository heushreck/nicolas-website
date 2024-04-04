<template>
  <header>
    <div class="wrapper">
      <NavBar />
    </div>
  </header>

  <main>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component"></component>
      </transition>
    </router-view>
  </main>

  <Footer />
</template>

<script setup>
import NavBar from './components/NavBar.vue';
import Footer from './components/FooterBar.vue';
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>