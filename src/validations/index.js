// Required
export const required = (v) => !!v || `Wajib diisi`

// Email
export const email = (v) => /.+@.+\..+/.test(v) || 'E-mail harus valid'

// Only Accept .ZIP file
export const acceptZipOnly = (v) => {
    if(v.type != "application/zip")
        return 'File harus ZIP'
    
    return true
}