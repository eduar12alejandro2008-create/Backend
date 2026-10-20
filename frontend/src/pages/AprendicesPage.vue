<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md q-col-gutter-md">
      <div class="col-12 col-md-auto">
        <div class="text-h4 text-weight-bold text-dark">Aprendices</div>
        <div class="text-caption text-grey-6">Gestión de aprendices del sistema</div>
      </div>
      <q-space />
      <div class="col-12 col-sm-6 col-md-3">
        <q-input v-model="filter" dense outlined debounce="300" placeholder="Buscar aprendiz..." clearable>
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
      <div class="col-auto">
        <q-btn color="secondary" icon="add" label="Nuevo Aprendiz" @click="openDialog()" unelevated rounded />
      </div>
    </div>

    <q-card flat>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="store.aprendices"
          :columns="columns"
          :loading="store.loading"
          :filter="filter"
          row-key="_id"
          :pagination="{ rowsPerPage: 10 }"
          no-data-label="No hay aprendices registrados"
          flat
        >
          <template v-slot:body-cell-curso="props">
            <q-td :props="props">
              <q-chip v-if="props.row.curso" color="primary" text-color="white" dense>
                {{ props.row.curso.nombre }}
              </q-chip>
              <span v-else class="text-grey-5">Sin curso</span>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip :color="props.value === 0 ? 'positive' : 'negative'" text-color="white" dense>
                {{ props.value === 0 ? 'Activo' : 'Inactivo' }}
              </q-chip>
            </q-td>
          </template>
          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn flat round icon="edit" color="primary" size="sm" @click="openDialog(props.row)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                v-if="props.row.status === 0"
                flat round
                icon="block"
                color="negative"
                size="sm"
                @click="confirmarInactivar(props.row)"
              >
                <q-tooltip>Desactivar</q-tooltip>
              </q-btn>
              <q-btn
                v-else
                flat round
                icon="check_circle"
                color="positive"
                size="sm"
                @click="confirmarActivar(props.row)"
              >
                <q-tooltip>Activar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Dialog Crear/Editar -->
    <q-dialog v-model="dialogOpen" persistent>
      <q-card style="min-width: 420px; border-radius: 12px;">
        <q-card-section class="bg-secondary text-white">
          <div class="text-h6">{{ editando ? 'Editar Aprendiz' : 'Nuevo Aprendiz' }}</div>
        </q-card-section>
        <q-card-section class="q-pt-lg">
          <q-form ref="formRef" @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="form.documento" label="Documento" outlined dense :rules="[required()]">
              <template v-slot:prepend>
                <q-icon name="badge" color="secondary" />
              </template>
            </q-input>
            <q-input v-model="form.nombre" label="Nombre" outlined dense :rules="[required()]">
              <template v-slot:prepend>
                <q-icon name="person" color="secondary" />
              </template>
            </q-input>
            <q-input v-model="form.email" type="email" label="Email" outlined dense :rules="[required(), validEmail()]">
              <template v-slot:prepend>
                <q-icon name="email" color="secondary" />
              </template>
            </q-input>
            <q-select
              v-model="form.curso"
              :options="cursosOptions"
              option-label="nombre"
              option-value="_id"
              label="Curso"
              outlined
              dense
              emit-value
              map-options
              :rules="[val => !!val || 'Requerido']"
            >
              <template v-slot:prepend>
                <q-icon name="school" color="secondary" />
              </template>
            </q-select>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" @click="dialogOpen = false" rounded />
          <q-btn color="secondary" label="Guardar" @click="submitForm" :loading="saving" unelevated rounded />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useAprendicesStore } from '../stores/aprendices'
import { useCursosStore } from '../stores/cursos'
import { required, validEmail } from '../utils/validators'

const $q = useQuasar()
const store = useAprendicesStore()
const cursosStore = useCursosStore()

const columns = [
  { name: 'documento', label: 'Documento', field: 'documento', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'curso', label: 'Curso', field: 'curso', align: 'left' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const dialogOpen = ref(false)
const saving = ref(false)
const editando = ref(false)
const editId = ref(null)
const formRef = ref(null)
const filter = ref('')

const form = reactive({
  documento: '',
  nombre: '',
  email: '',
  curso: null
})

const cursosOptions = computed(() => cursosStore.cursos)

function openDialog(aprendiz = null) {
  if (aprendiz) {
    editando.value = true
    editId.value = aprendiz._id
    form.documento = aprendiz.documento
    form.nombre = aprendiz.nombre
    form.email = aprendiz.email
    form.curso = aprendiz.curso?._id || aprendiz.curso
  } else {
    editando.value = false
    editId.value = null
    form.documento = ''
    form.nombre = ''
    form.email = ''
    form.curso = null
  }
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
    if (editando.value) {
      await store.updateAprendiz(editId.value, { ...form })
      $q.notify({ type: 'positive', message: 'Aprendiz actualizado correctamente', icon: 'check_circle' })
    } else {
      await store.createAprendiz({ ...form })
      $q.notify({ type: 'positive', message: 'Aprendiz creado correctamente', icon: 'check_circle' })
    }
    dialogOpen.value = false
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.errors?.[0] || error.response?.data?.msg || 'Error',
      icon: 'error'
    })
  } finally {
    saving.value = false
  }
}

function confirmarInactivar(aprendiz) {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Desactivar al aprendiz "${aprendiz.nombre}"?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Desactivar', color: 'negative', unelevated: true },
    cancel: { label: 'Cancelar', flat: true }
  }).onOk(async () => {
    try {
      await store.inactivarAprendiz(aprendiz._id)
      $q.notify({ type: 'positive', message: 'Aprendiz desactivado', icon: 'check_circle' })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.errors?.[0] || error.response?.data?.msg || 'Error',
        icon: 'error'
      })
    }
  })
}

function confirmarActivar(aprendiz) {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Activar al aprendiz "${aprendiz.nombre}"?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Activar', color: 'positive', unelevated: true },
    cancel: { label: 'Cancelar', flat: true }
  }).onOk(async () => {
    try {
      await store.activarAprendiz(aprendiz._id)
      $q.notify({ type: 'positive', message: 'Aprendiz activado', icon: 'check_circle' })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.errors?.[0] || error.response?.data?.msg || 'Error',
        icon: 'error'
      })
    }
  })
}

onMounted(async () => {
  await cursosStore.fetchCursos(0)
  await store.fetchAprendices()
})
</script>
