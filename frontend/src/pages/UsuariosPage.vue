<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Usuarios</div>
        <div class="text-caption text-grey-6">Registro de nuevos usuarios del sistema</div>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card flat>
          <q-card-section class="bg-accent text-white">
            <div class="text-h6">Crear Nuevo Usuario</div>
            <div class="text-caption">Complete los campos para registrar un nuevo usuario</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input v-model="form.nombre" label="Nombre completo" outlined dense :rules="[val => !!val || 'Requerido']">
                <template v-slot:prepend>
                  <q-icon name="person" color="accent" />
                </template>
              </q-input>
              <q-input v-model="form.email" type="email" label="Correo electrónico" outlined dense :rules="[val => !!val || 'Requerido']">
                <template v-slot:prepend>
                  <q-icon name="email" color="accent" />
                </template>
              </q-input>
              <q-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                label="Contraseña"
                outlined
                dense
                :rules="[val => !!val || 'Requerido', val => val.length >= 6 || 'Mínimo 6 caracteres']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" color="accent" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer text-grey-6"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>
              <q-select
                v-model="form.rol"
                :options="['ADMIN', 'USER']"
                label="Rol"
                outlined
                dense
                :rules="[val => !!val || 'Requerido']"
              >
                <template v-slot:prepend>
                  <q-icon name="admin_panel_settings" color="accent" />
                </template>
              </q-select>
              <q-btn
                type="submit"
                color="accent"
                label="Crear Usuario"
                class="full-width q-py-sm"
                :loading="saving"
                unelevated
                rounded
                icon="person_add"
              />
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'

const $q = useQuasar()
const auth = useAuthStore()

const saving = ref(false)
const showPassword = ref(false)

const form = reactive({
  nombre: '',
  email: '',
  password: '',
  rol: 'USER'
})

async function onSubmit() {
  saving.value = true
  try {
    await auth.register(form.nombre, form.email, form.password, form.rol)
    $q.notify({ type: 'positive', message: 'Usuario creado correctamente', icon: 'check_circle' })
    form.nombre = ''
    form.email = ''
    form.password = ''
    form.rol = 'USER'
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.msg || 'Error al crear usuario', icon: 'error' })
  } finally {
    saving.value = false
  }
}
</script>
