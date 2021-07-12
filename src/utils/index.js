import axios from 'axios'
import { saveAs } from 'file-saver'

import { API_URL } from '../constants'

export function setAxiosBearerToken() {
    axios.defaults.headers.common[
        "Authorization"
    ] = `Bearer ${localStorage.getItem("appKey")}`;
}

export async function getData(endpoint) {
    let url = `${API_URL}${endpoint}`
    
    try {
        let response = await axios.get(url)

        return response.data.result
    } catch (error) {
        return error
    }
}

export async function getOneData(endpoint) {
    let url = `${API_URL}${endpoint}`
    
    try {
        let response = await axios.get(url)

        return response.data.result[0]
    } catch (error) {
        return error
    }
}

export async function getFile(endpoint) {
    let url = `${API_URL}/files/${endpoint}`

    try {
        let response = await axios.get(url, { responseType: "blob" })

        return response.data
    } catch (error) {
        return error
    }
}

export async function postData(endpoint, data) {
    let url = `${API_URL}${endpoint}`
    
    try {
        let response = await axios.post(url, data)

        return response
    } catch (error) {
        return error
    }
}

export async function deleteData(endpoint, id) {
    let url = `${API_URL}${endpoint}/${id}`

    try {
        let response = await axios.delete(url)

        return response
    } catch (error) {
        return error
    }
}

export async function editData(endpoint, id, data = {}) {
    let url = `${API_URL}${endpoint}/${id}`

    try {
        let response = await axios.patch(url, data)

        return response
    } catch (error) {
        return error
    }
}

export async function getLogSuratByNoSurat(noSurat) {
    let url = `${API_URL}/log-surat/${noSurat}`
    
    try {
        let response = await axios.get(url)

        return response.data.result
    } catch (error) {
        return error
    }
}

export function countAge(tglLahir) {
    let today = new Date(),
    birthDate = new Date(tglLahir),

    age = today.getFullYear() - birthDate.getFullYear(),
    m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age--;
    }
    return age;
}

export function changeDateFormat(dateInput) {
    let year = dateInput.substring(0, 4)
    let month = dateInput.substring(5, 7)
    let date = dateInput.substring(8, 10)

    // console.log(`${date}-${month}-${year}`)

    return `${date}-${month}-${year}`
}

export function convertDateTime(dateTime) {
    let tanggal = changeDateFormat(dateTime.substring(0, 11))
      , waktu = dateTime.substring(11, 16)

    return `${tanggal} • ${waktu}`
}

export const cetakSurat = async (endpoint, id) => {
    let url = `${API_URL}/cetak${endpoint}/${id}`

    try {
		let response = await axios.get(url, {
            responseType: 'blob',
        })

        await saveAs(response.data, 'surat.pdf')

	} catch (error) {
		return error
	}
}