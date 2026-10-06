import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../axios'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(JSON.parse(localStorage.getItem('usuario') || 'null'))
  const token = ref(localStorage.getItem('token') || null)

  const isAuthenticated = computed(() => !!token.value)
  const nombreUsuario = computed(() => usuario.value?.nombre || '')
  const rolUsuario = computed(() => usuario.value?.rol || '')

  async function login(email, password) {
    const { data } = await api.post('/usuarios/login', { email, password })
    token.value = data.token
    usuario.value = data.usuario
    localStorage.setItem('token', data.token)
    localStorage.setItem('usuario', JSON.stringify(data.usuario))
  }

  async function register(nombre, email, password, rol = 'USER') {
    await api.post('/usuarios/register', { nombre, email, password, rol })
  }

  function logout() {
    token.value = null
    usuario.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
  }

  return { usuario, token, isAuthenticated, nombreUsuario, rolUsuario, login, register, logout }
})
