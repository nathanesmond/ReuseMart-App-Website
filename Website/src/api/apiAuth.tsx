import { data } from "react-router-dom";
import useAxios from ".";
import { getToken } from "./ApiPembeli";

interface RegisterData {
    nama: string;
    email: string;
    password: string;
    telepon: string;
    foto?: string;
}

const RegisterPembeli = async (data: RegisterData) => {
    try {
        const response = await useAxios.post('/registerPembeli', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data;
    }
};

const RegisterOrganisasi = async (data: FormData) => {
    try {
        const response = await useAxios.post('/registerOrganisasi', data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data;
    }
};

const LoginApi = async (data: { email: string, password: string }) => {
    try {
        const response = await useAxios.post('/login', data, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log(response.data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data;
    }
}

const Logout = async () => {
    try {
        const response = await useAxios.post('/logout', {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`
            },
        });
        console.log(response.data);

        return response.data;
    } catch (error: any) {
        throw error.response?.data;
    }
}

const getUserRole = (): string | null => {
    return localStorage.getItem("role");
};



export { RegisterPembeli, RegisterOrganisasi, LoginApi, Logout, getUserRole };
