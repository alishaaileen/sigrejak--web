import axios from 'axios'

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

export async function editData(endpoint, id, data) {
    let url = `${API_URL}${endpoint}/${id}`

    try {
        let response = await axios.patch(url, data)

        return response
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