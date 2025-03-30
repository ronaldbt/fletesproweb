// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import HomeView from '../views/HomeView.vue'
import GraciasView from '../views/GraciasView.vue'
import NoDisponibleView from '../views/NoDisponibleView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/gracias',
    name: 'Gracias',
    component: GraciasView
  },
  {
    path: '/no-disponible',
    name: 'NoDisponible',
    component: NoDisponibleView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
