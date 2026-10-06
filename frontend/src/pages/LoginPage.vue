<template>
  <div class="window-height flex flex-center bg-gradient">
    <div class="login-container">
      <q-card class="q-pa-xl shadow-8" style="width: 420px; max-width: 92vw; border-radius: 16px;">
        <q-card-section class="text-center q-pt-none">
          <div class="bg-primary text-white rounded-borders q-pa-md q-mb-lg" style="margin-top: -60px; width: 80px; height: 80px; display: inline-flex; align-items: center; justify-content: center;">
            <q-icon name="school" size="48px" />
          </div>
          <div class="text-h5 text-weight-bold text-dark">Bienvenido</div>
          <div class="text-caption text-grey-6">Ingrese sus credenciales para continuar</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="email"
              type="email"
              label="Correo electrónico"
              outlined
              dense
              :rules="[val => !!val || 'El correo es requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="primary" />
              </template>
            </q-input>
            <q-input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              label="Contraseña"
              outlined
              dense
              :rules="[val => !!val || 'La contraseña es requerida']"
            >
              <template v-slot:prepend>
                <q-icon name="lock" color="primary" />
              </template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer text-grey-6"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>
            <q-btn
              type="submit"
              color="primary"
              label="Ingresar"
              class="full-width q-py-sm"
              :loading="loading"
              unelevated
              rounded
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function onSubmit() {
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    $q.notify({ type: 'positive', message: '¡Bienvenido!', icon: 'check_circle' })
    router.push('/')
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.msg || 'Error al iniciar sesión',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}
.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
