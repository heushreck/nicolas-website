import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '../views/BlogView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'Nicolas Neudeck',
      },
    },
    {
      path: '/blog',
      name: 'blog',
      component: () => BlogView,
      meta: {
        title: 'Nicolas Neudeck - Blog',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'Nicolas Neudeck - About',
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: {
        title: 'Nicolas Neudeck - Privacy',
      },
    },
    { 
      path: '/blog/:blogEntryId',
      component: () => import('../views/BlogEntryView.vue'),
      name: 'blogEntry',
      meta: {
        title: 'Nicolas Neudeck - Blog',
      },
    },
    { 
      path: '/blog/search/:searchQuery',
      component: () => import('../views/BlogSearchView.vue'),
      name: 'blogSearch',
      meta: {
        title: 'Nicolas Neudeck - Search',
      },
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta?.title ?? 'Nicolas Neudeck'
  next()
})

export default router
