// my-app/src/api/api.js (ESTRUTURA CORRETA E ÚNICA)

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importe AsyncStorage aqui

// 1. ÚNICA DECLARAÇÃO DA INSTÂNCIA AXIOS
const api = axios.create({
    baseURL: 'http://192.168.1.106:3001/api', 
    headers: {
        'Content-Type': 'application/json',
    }
});

// 2. INTERCEPTADOR (Adiciona o Token antes de toda requisição)
api.interceptors.request.use(async (config) => {
    // Nota: O nome da chave 'financialAppToken' deve ser o mesmo usado no authService.js
    const token = await AsyncStorage.getItem('financialAppToken'); 
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 3. EXPORTAÇÃO ÚNICA
export default api;