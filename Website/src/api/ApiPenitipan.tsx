import axios from "axios";
import useAxios from ".";
import { getToken } from "./ApiPembeli";

export const showAllBarang = async () => {
    try {
        const response = await useAxios.get("/showAllBarang", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }
    catch (error: any) {
        throw error.response.data;
    }
}

export const FetchPenitipan = async () => {
    try {
        const response = await useAxios.get("/fetchPenitipan", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

export const FetchPenitipanById = async (id: number) => {
    try {
        const response = await useAxios.get(`/showPenitipan/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

export const FetchPenitipanByBarang = async (id: number) => {
    try {
        const response = await useAxios.get(`/showBarangPenitipan/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const FetchPenitipanByPenitip = async (id: number) => {
    try {
        const response = await useAxios.get(`/showPenitipPenitipan/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const FetchPenitipanByPegawai = async (id: number) => {
    try {
        const response = await useAxios.get(`/showPegawaiPenitipan/${id}`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const addPenitipan = async (data: FormData) => {
    try {
        const response = await useAxios.post("/addPenitipan", data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }
    catch (error: any) {
        throw error.response.data;
    }
}

export const updatePenitipan = async (data: FormData, id: number) => {
    try {
        const response = await useAxios.post(`/updatePenitipan/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }
    catch (error: any) {
        throw error.response.data;
    }
}

export const fetchPenitip = async () => {
    try {
        const response = await useAxios.get("/fetchPenitipPenitipan", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }
    catch (error: any) {
        throw error.response.data;
    }
}

export const fetchPegawai = async () => {
    try {
        const response = await useAxios.get("/fetchPegawaiPenitipan", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }
    catch (error: any) {
        throw error.response.data;
    }
}

export const updateOnlyPenitipan = async (data: FormData, id: number) => {
    try {
        const response = await useAxios.post(`/updateOnlyPenitipan/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;  
    }
    catch (error: any) {
        throw error.response.data;
    }
}

export const addBarang = async (data: FormData, id: number) => {
    try {
        const response = await useAxios.post(`/storeBarang/${id}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;  
    }
    catch (error: any) {
        throw error.response.data;
    }
}

