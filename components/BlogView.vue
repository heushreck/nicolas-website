<template>
    <div class="blog-view-container">
        <transition-group
            appear
            @before-enter="beforeEnter"
            @enter="enter"
            tag="div"
            class="group"
        >
            <BlogCard v-for="(blogentry, index) in blogentries" :data-index="index" :key="blogentry.id" :id="blogentry.id" :title="blogentry.title" :image="blogentry.image" :shortDescription="blogentry.shortDescription" :date="prettyDate(blogentry.date)" />
        </transition-group>
    </div>
</template>
  
<script setup>
import BlogCard from './BlogCard.vue';
import blogEntries from '../data/blog_entries.json';
import gsap from 'gsap';

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

<style scoped>
.blog-view-container {
    display: flex; 
    padding: 1rem; 
    flex-wrap: wrap; 
    justify-content: space-between; 
    align-items: center; 
    max-width: 1024px; 
}

.group {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 1rem; 

    @media (min-width: 600px) { 
        grid-template-columns: repeat(2, minmax(0, 1fr)); 
    }

    @media (min-width: 900px) { 
        grid-template-columns: repeat(3, minmax(0, 1fr)); 
    }
}

</style>