import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../axios'

export const useCursosStore = defineStore('cursos', () => {
  const cursos = ref([])
  const loading = ref(false)

  async function fetchCursos(status = null) {
    loading.value = true
    try {
      const params = status !== null ? { status } : {}
      const { data } = await api.get('/cursos', { params })
      cursos.value = data
    } finally {
      loading.value = false
    }
  }

  async function createCurso(curso) {
    await api.post('/cursos/register', curso)
    await fetchCursos()
  }

  async function updateCurso(id, curso) {
    await api.put(`/cursos/update/${id}`, curso)
    await fetchCursos()
  }

  async function activarCurso(id) {
    await api.put(`/cursos/active/${id}`)
    await fetchCursos()
  }

  async function inactivarCurso(id) {
    await api.put(`/cursos/inactive/${id}`)
    await fetchCursos()
  }

  return { cursos, loading, fetchCursos, createCurso, updateCurso, activarCurso, inactivarCurso }
})
