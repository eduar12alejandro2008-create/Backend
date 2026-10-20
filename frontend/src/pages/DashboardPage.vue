<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h4 text-weight-bold text-dark">Dashboard</div>
        <div class="text-caption text-grey-6">Resumen general del sistema</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-primary text-white" flat>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="school" size="40px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold">{{ cursosActivos }}</div>
                <div class="text-caption">Cursos Activos</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-secondary text-white" flat>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="people" size="40px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold">{{ aprendicesActivos }}</div>
                <div class="text-caption">Aprendices Activos</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-accent text-white" flat>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="menu_book" size="40px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold">{{ totalCursos }}</div>
                <div class="text-caption">Total Cursos</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="stat-card bg-info text-white" flat>
          <q-card-section>
            <div class="row items-center">
              <q-icon name="groups" size="40px" class="q-mr-md" />
              <div>
                <div class="text-h4 text-weight-bold">{{ totalAprendices }}</div>
                <div class="text-caption">Total Aprendices</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Acciones Rápidas</div>
            <div class="row q-gutter-sm">
              <q-btn color="primary" icon="add" label="Nuevo Curso" to="/cursos" unelevated rounded />
              <q-btn color="secondary" icon="person_add" label="Nuevo Aprendiz" to="/aprendices" unelevated rounded />
              <q-btn color="accent" icon="person_add" label="Nuevo Usuario" to="/usuarios" unelevated rounded />
            </div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-6">
        <q-card flat>
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">Actividad Reciente</div>
            <q-list>
              <q-item v-if="!actividadReciente.length">
                <q-item-section>
                  <q-item-label caption>No hay actividad reciente</q-item-label>
                </q-item-section>
              </q-item>
              <q-item v-for="(item, i) in actividadReciente" :key="i">
                <q-item-section avatar>
                  <q-icon :name="item.icon" :color="item.color" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.texto }}</q-item-label>
                  <q-item-label caption>{{ item.fecha }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../axios'

const cursosActivos = ref(0)
const aprendicesActivos = ref(0)
const totalCursos = ref(0)
const totalAprendices = ref(0)
const actividadReciente = ref([])

onMounted(async () => {
  try {
    const [cursosRes, aprendicesRes, cursosActivosRes, aprendicesActivosRes] = await Promise.all([
      api.get('/cursos'),
      api.get('/aprendices'),
      api.get('/cursos', { params: { status: 0 } }),
      api.get('/aprendices', { params: { status: 0 } })
    ])
    totalCursos.value = cursosRes.data.length
    totalAprendices.value = aprendicesRes.data.length
    cursosActivos.value = cursosActivosRes.data.length
    aprendicesActivos.value = aprendicesActivosRes.data.length

    actividadReciente.value = [
      ...cursosRes.data.map((c) => ({
        icon: 'school',
        color: 'primary',
        texto: `Curso creado: ${c.nombre}`,
        fecha: c.createdAt
      })),
      ...aprendicesRes.data.map((a) => ({
        icon: 'person',
        color: 'secondary',
        texto: `Aprendiz registrado: ${a.nombre}`,
        fecha: a.createdAt
      }))
    ]
      .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
      .slice(0, 5)
      .map((item) => ({
        ...item,
        fecha: new Date(item.fecha).toLocaleDateString('es-CO', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
      }))
  } catch (error) {
    console.error('Error cargando dashboard:', error)
  }
})
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  transition: transform 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
}
</style>
