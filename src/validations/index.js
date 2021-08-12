// Required
export const required = (v) => !!v || `Wajib diisi`

// Email
export const email = (v) => /.+@.+\..+/.test(v) || 'E-mail harus valid'
