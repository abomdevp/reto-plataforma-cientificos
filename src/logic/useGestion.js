import { ref } from "vue";

const personas = ref([
  {
    nombre: "Ana",
    apellidos: "Pérez Soto",
    rut: "12345678-5",
    edad: 32,
    cargo: "Investigador Trainee",
  },
  {
    nombre: "Diego",
    apellidos: "Muñoz Rivas",
    rut: "87654321-K",
    edad: 41,
    cargo: "Investigador Senior",
  },
]);

function agregarPersona(persona) {
  personas.value.push({ ...persona });
}

function eliminarPersona(rut) {
  personas.value = personas.value.filter((p) => p.rut !== rut);
}

function actualizarPersona(rut, nuevosDatos) {
  const idx = personas.value.findIndex((p) => p.rut === rut);
  if (idx === -1) return false;

  personas.value[idx] = {
    ...personas.value[idx],
    ...nuevosDatos,
    rut, // mantenemos el RUT como identificador
  };
  return true;
}

export { personas, agregarPersona, eliminarPersona, actualizarPersona };
