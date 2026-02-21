// src/renderer/router/index.ts

import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import VideoDetailView from '@/views/VideoDetailView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/video/:id',
    name: 'video',
    component: VideoDetailView,
  },
  {
    path: '/search',
    name: 'search',
    component: HomeView, // Placeholder
  },
  {
    path: '/history',
    name: 'history',
    component: HomeView, // Placeholder
  },
  {
    path: '/space/:id',
    name: 'space',
    component: HomeView, // Placeholder
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
