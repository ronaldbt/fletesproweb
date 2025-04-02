// src/stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    usuario: null
  }),
  actions: {
    setUsuario(usuario) {
      this.usuario = usuario
    },
    logout() {
      this.usuario = null
    }
  }
})
