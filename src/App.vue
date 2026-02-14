<template>
  <div class="container py-4">
    <div class="row g-4">
      <div class="col-12">
        <h1 class="h3 mb-0">Bio-Tech - Gestión de Personal Científico</h1>
        <p class="text-muted mb-0">
          Registro interno de personal científico.
        </p>
      </div>

      <!-- FORMULARIO -->
      <div class="col-12 col-lg-5">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="h5 mb-3">Formulario</h2>

            <form @submit.prevent="onSubmit">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input
                  class="form-control"
                  type="text"
                  v-model.trim="nombre"
                  placeholder="Ej: Francisco"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Apellidos</label>
                <input
                  class="form-control"
                  type="text"
                  v-model.trim="apellidos"
                  placeholder="Ej: González Correa"
                />
              </div>

              <div class="mb-2">
                <label class="form-label">RUT</label>
                <input
                  class="form-control"
                  type="text"
                  v-model.trim="rut"
                  placeholder="12345678-9"
                />
                <div v-if="rut && !rutEsValido" class="text-danger small mt-1">
                  RUT inválido. Verifica el formato y dígito verificador.
                </div>
              </div>

              <div class="mb-3 mt-3">
                <label class="form-label">Edad</label>
                <input
                  class="form-control"
                  type="number"
                  min="0"
                  v-model.number="edad"
                  placeholder="Ej: 29"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Cargo</label>
                <select class="form-select" v-model="cargo">
                  <option disabled value="">Selecciona un cargo</option>
                  <option>Investigador Trainee</option>
                  <option>Investigador Junior</option>
                  <option>Investigador Senior</option>
                </select>
              </div>

              <div class="alert alert-secondary py-2 small mb-3">
                <strong>Nombre completo:</strong> {{ nombreCompleto || "----------" }}
              </div>

              <div class="d-flex gap-2">
                <button
                  class="btn btn-primary"
                  type="submit"
                  :disabled="!formularioValido"
                >
                  {{ modoEdicion ? "Guardar Cambios" : "Registrar Científico" }}
                </button>

                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="resetFormulario"
                >
                  Limpiar
                </button>
              </div>

              <div v-if="error" class="alert alert-danger mt-3 mb-0 py-2">
                {{ error }}
              </div>

              <div v-if="ok" class="alert alert-success mt-3 mb-0 py-2">
                {{ ok }}
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- TABLA -->
      <div class="col-12 col-lg-7">
        <div class="card shadow-sm">
          <div class="card-body">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h2 class="h5 mb-0">Listado</h2>
              <div class="text-muted small">
                El promedio de edad es: <strong>{{ promedioEdad }}</strong>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table table-striped align-middle">
                <thead>
                  <tr>
                    <th>RUT</th>
                    <th>Nombre</th>
                    <th>Edad</th>
                    <th>Cargo</th>
                    <th class="text-end">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-if="personas.length === 0">
                    <td colspan="5" class="text-center text-muted py-4">
                      No hay personas registradas.
                    </td>
                  </tr>

                  <tr v-for="p in personas" :key="p.rut">
                    <td class="fw-semibold">{{ p.rut }}</td>
                    <td>{{ p.nombre }} {{ p.apellidos }}</td>
                    <td>{{ p.edad }}</td>
                    <td>
                      <span class="badge text-bg-light border">{{ p.cargo }}</span>
                    </td>
                    <td class="text-end">
                      <div class="btn-group">
                        <button
                          class="btn btn-sm btn-outline-primary"
                          @click="cargarEdicion(p)"
                        >
                          Editar
                        </button>
                        <button
                          class="btn btn-sm btn-outline-danger"
                          @click="onEliminar(p.rut)"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="text-muted small mb-0">
              * El botón de <strong>Registrar Científico</strong> se habilita solo cuando el formulario es válido.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { validarRut } from "./utils/validator";
import {
  personas,
  agregarPersona,
  eliminarPersona,
  actualizarPersona,
} from "./logic/useGestion";

// Campos
const nombre = ref("");
const apellidos = ref("");
const rut = ref("");
const edad = ref(null);
const cargo = ref("");

// Estado de mensajes
const error = ref("");
const ok = ref("");

// Desafío
const modoEdicion = ref(false);
const rutEnEdicion = ref("");

const nombreCompleto = computed(() => {
  const n = nombre.value.trim();
  const a = apellidos.value.trim();
  return [n, a].filter(Boolean).join(" ");
});

// Validación de rut (para mensaje y para formularioValido)
const rutEsValido = computed(() => {
  if (!rut.value) return false;
  return validarRut(rut.value);
});

const formularioValido = computed(() => {
  const n = nombre.value.trim();
  const a = apellidos.value.trim();
  const r = rut.value.trim();
  const c = cargo.value;
  const e = edad.value;

  const edadValida = typeof e === "number" && Number.isFinite(e) && e > 0;
  return Boolean(n && a && r && c && edadValida && rutEsValido.value);
});

const promedioEdad = computed(() => {
  if (personas.value.length === 0) return "-";
  const suma = personas.value.reduce((acc, p) => acc + Number(p.edad || 0), 0);
  const prom = suma / personas.value.length;
  return prom.toFixed(1);
});

function resetMensajes() {
  error.value = "";
  ok.value = "";
}

function resetFormulario() {
  resetMensajes();
  nombre.value = "";
  apellidos.value = "";
  rut.value = "";
  edad.value = null;
  cargo.value = "";
  modoEdicion.value = false;
  rutEnEdicion.value = "";
}

function existeRut(r) {
  return personas.value.some((p) => p.rut === r);
}

function onSubmit() {
  resetMensajes();

  if (!formularioValido.value) {
    error.value = "Completa todos los campos correctamente antes de continuar.";
    return;
  }

  const payload = {
    nombre: nombre.value.trim(),
    apellidos: apellidos.value.trim(),
    rut: rut.value.trim(),
    edad: edad.value,
    cargo: cargo.value,
  };

  if (!modoEdicion.value) {
    if (existeRut(payload.rut)) {
      error.value = "Ya existe una persona registrada con ese RUT.";
      return;
    }
    agregarPersona(payload);
    ok.value = "Persona registrada correctamente.";
    resetFormulario();
    return;
  }

  // Cuando se edita, no se permite cambiar el RUT (ID), solo los demás campos
  const okUpdate = actualizarPersona(rutEnEdicion.value, {
    nombre: payload.nombre,
    apellidos: payload.apellidos,
    edad: payload.edad,
    cargo: payload.cargo,
  });

  if (!okUpdate) {
    error.value = "No se encontró a la persona para actualizar (RUT no existe).";
    return;
  }

  ok.value = "Cambios guardados correctamente.";
  resetFormulario();
}

function onEliminar(r) {
  resetMensajes();

  // Si estabas editando a esa persona, limpias el formulario
  if (modoEdicion.value && rutEnEdicion.value === r) {
    resetFormulario();
  }

  eliminarPersona(r);
  ok.value = "Persona eliminada.";
}

function cargarEdicion(p) {
  resetMensajes();
  modoEdicion.value = true;
  rutEnEdicion.value = p.rut;

  // Cargar datos al formulario
  nombre.value = p.nombre;
  apellidos.value = p.apellidos;
  rut.value = p.rut; // visible, pero no lo usamos para cambiar el ID
  edad.value = p.edad;
  cargo.value = p.cargo;
}
</script>
