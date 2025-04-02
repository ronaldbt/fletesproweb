// ✅ src/router/index.js actualizado
import { createRouter, createWebHistory } from 'vue-router'

// Vistas
import HomeView from '../views/HomeView.vue'
import GraciasView from '../views/GraciasView.vue'
import NoDisponibleView from '../views/NoDisponibleView.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'
import DashboardClienteView from '../views/DashboardCliente.vue'
import DashboardConductorView from '../views/DashboardConductor.vue'

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
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/dashboard-cliente',
    name: 'DashboardCliente',
    component: DashboardClienteView
  },
  {
    path: '/dashboard-conductor',
    name: 'DashboardConductor',
    component: DashboardConductorView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router