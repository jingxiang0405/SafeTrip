import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const BASE_URL = Constants.expoConfig?.extra?.BACKEND_URL;

export const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to add the auth token to requests
api.interceptors.request.use(async (config) => {
    try {
        const authData = await AsyncStorage.getItem('auth-key');
        if (authData) {
            const { token } = JSON.parse(authData);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    } catch (error) {
        return Promise.reject(error);
    }
});

// Add response interceptor to handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear auth data and redirect to login
                    AsyncStorage.removeItem('auth-key');
                    // We can't use router.replace here because this is outside React context
                    // The auth context will handle redirection when it detects token is cleared
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    }
);
