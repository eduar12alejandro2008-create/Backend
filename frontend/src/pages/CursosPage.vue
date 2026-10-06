<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Cursos</div>
        <div class="text-caption text-grey-6">Gestión de cursos del sistema</div>
      </div>
      <q-space />
      <q-btn color="primary" icon="add" label="Nuevo Curso" @click="openDialog()" unelevated rounded />
    </div>

    <q-card flat>
      <q-card-section class="q-pa-none">
        <q-table
          :rows="store.cursos"
          :columns="columns"
          :loading="store.loading"
          row-key="_id"
          :pagination="{ rowsPerPage: 10 }"
          flat
        >
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
                @click="activar(props.row)"
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
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">{{ editando ? 'Editar Curso' : 'Nuevo Curso' }}</div>
        </q-card-section>
        <q-card-section class="q-pt-lg">
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input v-model="form.codigo" label="Código" outlined dense :rules="[val => !!val || 'Requerido']">
              <template v-slot:prepend>
                <q-icon name="tag" color="primary" />
              </template>
            </q-input>
            <q-input v-model="form.nombre" label="Nombre" outlined dense :rules="[val => !!val || 'Requerido']">
              <template v-slot:prepend>
                <q-icon name="school" color="primary" />
              </template>
            </q-input>
            <q-input v-model.number="form.duracion" type="number" label="Duración (horas)" outlined dense :rules="[val => val > 0 || 'Debe ser mayor a 0']">
              <template v-slot:prepend>
                <q-icon name="schedule" color="primary" />
              </template>
            </q-input>
          </q-form>
        </q-card-section>
        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" @click="dialogOpen = false" rounded />
          <q-btn color="primary" label="Guardar" @click="onSubmit" :loading="saving" unelevated rounded />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useCursosStore } from '../stores/cursos'

const $q = useQuasar()
const store = useCursosStore()

const columns = [
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'duracion', label: 'Duración (hrs)', field: 'duracion', align: 'center' },
  { name: 'status', label: 'Estado', field: 'status', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
]

const dialogOpen = ref(false)
const saving = ref(false)
const editando = ref(false)
const editId = ref(null)

const form = reactive({
  codigo: '',
  nombre: '',
  duracion: null
})

function openDialog(curso = null) {
  if (curso) {
    editando.value = true
    editId.value = curso._id
    form.codigo = curso.codigo
    form.nombre = curso.nombre
    form.duracion = curso.duracion
  } else {
    editando.value = false
    editId.value = null
    form.codigo = ''
    form.nombre = ''
    form.duracion = null
  }
  dialogOpen.value = true
}

async function onSubmit() {
  saving.value = true
  try {
    if (editando.value) {
      await store.updateCurso(editId.value, { ...form })
      $q.notify({ type: 'positive', message: 'Curso actualizado correctamente', icon: 'check_circle' })
    } else {
      await store.createCurso({ ...form })
      $q.notify({ type: 'positive', message: 'Curso creado correctamente', icon: 'check_circle' })
    }
    dialogOpen.value = false
  } catch (error) {
    $q.notify({ type: 'negative', message: error.response?.data?.msg || 'Error', icon: 'error' })
  } finally {
    saving.value = false
  }
}

function confirmarInactivar(curso) {
  $q.dialog({
    title: 'Confirmar',
    message: `¿Desactivar el curso "${curso.nombre}"?`,
    cancel: true,
    persistent: true,
    ok: { label: 'Desactivar', color: 'negative', unelevated: true },
    cancel: { label: 'Cancelar', flat: true }
  }).onOk(async () => {
    await store.inactivarCurso(curso._id)
    $q.notify({ type: 'positive', message: 'Curso desactivado', icon: 'check_circle' })
  })
}

async function activar(curso) {
  await store.activarCurso(curso._id)
  $q.notify({ type: 'positive', message: 'Curso activado', icon: 'check_circle' })
}

onMounted(() => store.fetchCursos())
</script>
