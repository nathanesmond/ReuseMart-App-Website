import axios from "axios";
import useAxios from ".";
import { getToken } from "./ApiPembeli";



// Get all request donasi
export const fetchRequestDonasi = async () => {
    try {
        const response = await useAxios.get("/request_donasi", {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Get single request by ID
export const showRequestDonasiById = async () => {
    try {
        const response = await useAxios.get(`/request_donasi/show`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Create new request donasi
export const addRequestDonasi = async (data: any) => {
    try {
        const response = await useAxios.post("/request_donasi", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Update existing request donasi
export const updateRequestDonasi = async (id: number, data: any) => {
    try {
        const response = await useAxios.put(`/request_donasi/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Alokasi update
export const alokasiRequestDonasi = async (id: number, data: any) => {
    try {
        const response = await useAxios.put(`/request_donasi/${id}/alokasi`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Delete request donasi
export const deleteRequestDonasi = async (id: number) => {
    try {
        const response = await useAxios.delete(`/request_donasi/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Search request donasi
export const searchRequestDonasi = async (keyword: string) => {
    try {
        const response = await useAxios.get(`/request_donasi/search?keyword=${keyword}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Filter by date
export const filterRequestDonasiByDate = async (start: string, end: string) => {
    try {
        const response = await useAxios.get(`/request_donasi/filterByDate?start=${start}&end=${end}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Filter by status
export const filterRequestDonasiByStatus = async (status: boolean) => {
    try {
        const response = await useAxios.get(`/request_donasi/filterByStatus?status=${status}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

// Get history by organisasi
export const getHistoryByOrganisasi = async (idOrganisasi: number) => {
    try {
        const response = await useAxios.get(`/request_donasi/organisasi/${idOrganisasi}/history`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};
