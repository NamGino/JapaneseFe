import axios from 'axios'
import { API_ROOT } from '../utils/constants.js'

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
})

/** user **/
export const createUser = async (userData) => {
    const response = await axios.post(`${API_ROOT}/Users`, userData)
    return response.data
}

/** auth **/
export const loginUser = async (loginData) => {
    const response = await axios.post(`${API_ROOT}/auth/login`, loginData)
    return response.data
}

/** diary **/
export const getDiaryEntry = async (date) => {
    const response = await axios.get(`${API_ROOT}/diary/daily`, {
        params: { date }, // 👈 thêm query
        headers: getAuthHeaders()
    })
    return response.data
}

// export const test = async () => {
//     const response = await axios.post(`${API_ROOT}/diary/test`, {}, {
//         headers: getAuthHeaders()
//     })
//     return response.data
// }

export const upsertDiaryEntry = async (date, payload) => {
    const response = await axios.put(`${API_ROOT}/diary/daily`, payload, {
        params: { date },
        headers: getAuthHeaders()
    })
    return response.data
}

export const addDiaryTask = async (payload) => {
    const response = await axios.post(`${API_ROOT}/diary/tasks`, payload, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const updateDiaryTaskDone = async (taskId, isDone) => {
    const response = await axios.post(`${API_ROOT}/diary/tasks/${taskId}/done`, { isDone }, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const addDiaryVocabulary = async (payload) => {
    const response = await axios.post(`${API_ROOT}/diary/vocabularies`, payload, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const suggestVocabulary = async (jp) => {
    const response = await axios.post(`${API_ROOT}/diary/vocabularies/suggest`, { jp }, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const updateDiaryVocabulary = async (vocabularyId, payload) => {
    const response = await axios.post(`${API_ROOT}/diary/vocabularies/${vocabularyId}/update`, payload, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const deleteDiaryVocabulary = async (vocabularyId) => {
    const response = await axios.delete(`${API_ROOT}/diary/vocabularies/${vocabularyId}/delete`, {
        headers: getAuthHeaders()
    })
    return response.data
}

export const updateDiaryMood = async (date, moodId) => {
    const response = await axios.put(`${API_ROOT}/diary/daily`, { moodId }, {
        params: { date },
        headers: getAuthHeaders()
    })
    return response.data
}

export const getDiaryStats = async () => {
    const response = await axios.get(`${API_ROOT}/diary/stats`, {
        headers: getAuthHeaders()
    })
    return response.data
}