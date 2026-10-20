<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Usuarios</div>
        <div class="text-caption text-grey-6">Gestión de usuarios del sistema</div>
      </div>
      <q-space />
      <q-btn color="accent" icon="person_add" label="Nuevo Usuario" @click="openDialog()" unelevated rounded />
    </div>

    <q-tabs
      v-model="filtro"
      dense
      class="text-grey-7 q-mb-md"
      active-color="primary"
      indicator-color="primary"
      align="left"
      narrow-indicator
    >
      <q-tab name="todos" label="Todos" />
      <q-tab name="admin" label="Administradores" />
      <q-tab name="user" label="Usuarios" />
    </q-tabs>

    <q-card flat>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="filasFiltradas"
          :columns="userColumns"
          row-key="_id"
          :pagination="{ rowsPerPage: 10 }"
          no-data-label="No hay usuarios registrados"
          flat
        >
          <template v-slot:body-cell-rol="props">
            <q-td :props="props">
              <q-chip :color="props.value === 'ADMIN' ? 'primary' : 'secondary'" text-color="white" dense>
                {{ props.value === 'ADMIN' ? 'Admin' : 'Usuario' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip :color="props.value === 0 ? 'positive' : 'negative'" text-color="white" dense>
                {{ props.value === 0 ? 'Activo' : 'Inactivo' }}
              </q-chip>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 420px; border-radius: 12px;">
        <q-card-section class="bg-accent text-white">
          <div class="text-h6">Nuevo Usuario</div>
        </q-card-section>
        <q-card-section class="q-pt-lg">
          <q-form ref="formRef" @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="form.nombre" label="Nombre completo" outlined dense :rules="[required()]">
              <template v-slot:prepend>
                <q-icon name="person" color="accent" />
              </template>
            </q-input>
            <q-input v-model="form.email" type="email" label="Correo electrónico" outlined dense :rules="[required(), validEmail()]">
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
              :rules="[required(), val => val.length >= 6 || 'Mínimo 6 caracteres']"
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
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" @click="dialogOpen = false" rounded />
          <q-btn color="accent" label="Guardar" @click="submitForm" :loading="saving" unelevated rounded />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from '../stores/auth'
import { required, validEmail } from '../utils/validators'

const $q = useQuasar()
const auth = useAuthStore()

const saving = ref(false)
const showPassword = ref(false)
const dialogOpen = ref(false)
const formRef = ref(null)
const filtro = ref('todos')

const form = reactive({
  nombre: '',
  email: '',
  password: '',
  rol: 'USER'
})

const userColumns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left', sortable: true },
  { name: 'rol', label: 'Rol', field: 'rol', align: 'center' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' }
]

const filasFiltradas = computed(() => {
  if (filtro.value === 'admin') return auth.usuarios.filter((u) => u.rol === 'ADMIN')
  if (filtro.value === 'user') return auth.usuarios.filter((u) => u.rol === 'USER')
  return auth.usuarios
})

function openDialog() {
  form.nombre = ''
  form.email = ''
  form.password = ''
  form.rol = 'USER'
  formRef.value?.reset()
  dialogOpen.value = true
}

function submitForm() {
  formRef.value.validate().then((success) => {
    if (success) onSubmit()
  })
}

async function onSubmit() {
  saving.value = true
  try {
    await auth.register(form.nombre, form.email, form.password, form.rol)
    $q.notify({ type: 'positive', message: 'Usuario creado correctamente', icon: 'check_circle' })
    dialogOpen.value = false
    await auth.fetchUsuarios()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.errors?.[0] || error.response?.data?.msg || 'Error al crear usuario',
      icon: 'error'
    })
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  auth.fetchUsuarios()
})
</script>
