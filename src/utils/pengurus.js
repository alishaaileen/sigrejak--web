import { editData } from './index'

export const verifySurat = async (url, id, data) => {
	let snackbar = {}

	try {
		let response = await editData(url, id, data)

		if (response.status >= 200 && response.status < 300) {
			snackbar.color = 'success',
			snackbar.text = 'Surat berhasil diverifikasi!'
		} else {
			snackbar.color = 'error',
			snackbar.text = 'Terjadi kesalahan! Mohon coba lagi'
		}
	} catch (error) {
		snackbar.color = 'error',
		snackbar.text = error
	}

	return snackbar
}