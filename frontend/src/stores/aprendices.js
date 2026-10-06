import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../axios'

export const useAprendicesStore = defineStore('aprendices', () => {
  const aprendices = ref([])
  const loading = ref(false)

  async function fetchAprendices(status = null) {
    loading.value = true
    try {
      const params = status !== null ? { status } : {}
      const { data } = await api.get('/aprendices', { params })
      aprendices.value = data
    } finally {
      loading.value = false
    }
  }

  async function createAprendiz(aprendiz) {
    await api.post('/aprendices/register', aprendiz)
    await fetchAprendices()
  }

  async function updateAprendiz(id, aprendiz) {
    await api.put(`/aprendices/update/${id}`, aprendiz)
    await fetchAprendices()
  }

  async function activarAprendiz(id) {
    await api.put(`/aprendices/active/${id}`)
    await fetchAprendices()
  }

  async function inactivarAprendiz(id) {
    await api.put(`/aprendices/inactive/${id}`)
    await fetchAprendices()
  }

  return { aprendices, loading, fetchAprendices, createAprendiz, updateAprendiz, activarAprendiz, inactivarAprendiz }
})
