<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-dark">
      <q-toolbar class="q-px-md">
        <q-btn dense flat round icon="menu" color="white" @click="toggleLeftDrawer" />
        <q-toolbar-title class="text-weight-bold">
          <q-icon name="school" size="sm" class="q-mr-sm" />
          Sistema de Gestión
        </q-toolbar-title>
        <q-space />
        <q-btn-dropdown flat color="white" :label="auth.nombreUsuario" icon="person">
          <q-list class="text-dark">
            <q-item clickable v-close-popup @click="logout">
              <q-item-section avatar>
                <q-icon name="logout" color="negative" />
              </q-item-section>
              <q-item-section>
                <q-item-label>Cerrar Sesión</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above side="left" bordered class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-grey-7 text-weight-bold q-mt-md">
            MENÚ PRINCIPAL
          </q-item-label>
          <q-item clickable to="/" exact class="rounded-borders q-mb-sm" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Dashboard</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable to="/cursos" exact class="rounded-borders q-mb-sm" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="school" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Cursos</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable to="/aprendices" exact class="rounded-borders q-mb-sm" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Aprendices</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable to="/usuarios" exact class="rounded-borders q-mb-sm" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="manage_accounts" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-weight-medium">Usuarios</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="bg-grey-2">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 8px;
}
</style>
