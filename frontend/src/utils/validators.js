/**
 * Validadores reutilizables para los formularios.
 *
 * Quasar espera en `:rules` un arreglo de funciones que reciben el valor y
 * devuelven `true` si es valido, o un string con el mensaje de error.
 *
 * `required` y `validEmail` son "fabricas": devuelven esa funcion, para poder
 * pasar un mensaje personalizado (por ejemplo en el login). Se usan asi:
 *
 *   :rules="[required()]"
 *   :rules="[required('El correo es requerido')]"
 */

// Rechaza vacio, null/undefined y strings con solo espacios.
export const required = (msg = 'Este campo es requerido') => (val) =>
  (typeof val === 'string' ? val.trim().length > 0 : !!val) || msg

// Valida formato de email (sin tildes). No falla si el campo esta vacio,
// porque eso ya lo cubre `required`.
export const validEmail = (msg = 'Email no válido') => (val) =>
  !val || /.+@.+\..+/.test(String(val).trim()) || msg
