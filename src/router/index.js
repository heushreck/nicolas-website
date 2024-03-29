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
        title: 'Blog - Nicolas Neudeck',
      },
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About - Nicolas Neudeck',
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyView.vue'),
      meta: {
        title: 'Privacy - Nicolas Neudeck',
      },
    },
    { 
      path: '/blog/:blogEntryId',
      component: () => import('../views/BlogEntryView.vue'),
      name: 'blogEntry',
      meta: {
        title: 'Blog - Nicolas Neudeck',
      },
    },
    { 
      path: '/search/:searchQuery',
      component: () => import('../views/SearchView.vue'),
      name: 'search',
      meta: {
        title: 'Search - Nicolas Neudeck',
      },
    },
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta?.title ?? 'Nicolas Neudeck'
  next()
})

export default router
