// my-app/src/services/authService.js

import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'financialAppToken';

// ----------------------------------------------------
// 1. Função de Login
// ----------------------------------------------------
export const loginUser = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        
        const token = response.data.token;
        
        if (token) {
            // Salva o token localmente
            await AsyncStorage.setItem(TOKEN_KEY, token);
            console.log('Token salvo com sucesso:', token);
            return true;
        }
        return false;

    } catch (error) {
        console.error('Erro no login:', error.response.data);
        throw new Error(error.response.data.message || 'Falha ao conectar à API.');
    }
};

// ----------------------------------------------------
// 2. Função de Logout
// ----------------------------------------------------
export const logoutUser = async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
};

// ----------------------------------------------------
// 3. Função para Obter o Token
// ----------------------------------------------------
export const getToken = async () => {
    return await AsyncStorage.getItem(TOKEN_KEY);
};