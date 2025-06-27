import useAxios from ".";
import { getToken } from "./ApiPembeli";

export const fetchRequestDonasi = async () => {
    try {
        const response = await useAxios.get("/fetchRequest", {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export const fetchDetailDonasi = async () => {
    try {
        const response = await useAxios.get("/fetchDetailDonasi", {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export const addDetailDonasi = async (data: any) => {
    try {
        const response = await useAxios.post("/store", data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export const showOrganisasi = async () => {
    try {
        const response = await useAxios.get("/showOrganisasi", {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export const updateDetailDonasi = async (data: any, id: number) => {
    try {
        const response = await useAxios.post(`/updateDonasi/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export const historyOrganisasiDonasi = async (id: number) => {
    try {
        const response = await useAxios.get(`/historyDonasibyOrganisasi/${id}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export const fetchBarangForDonasi = async () => {
    try {
        const response = await useAxios.get("/fetchBarangForDonasi", {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}

export const FetchAllBarang = async () => {
    try {
        const response = await useAxios.get(`/fetchAllBarang`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }

  
}

  export const FetchAllPenitip = async () =>{
    try{
        const response = await useAxios.get(`/getAllPenitip`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${getToken()}`,
            },
        });

        return response.data;
    }catch(error: any) {
        throw error.response?.data || error;
    }
  }


export const fetchLaporanBarangHabis = async () => {
    try {
        const response = await useAxios.get(`/laporanBarangHabis`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}


export const fetchLaporanBarangTerjual = async () => {
    try {
        const response = await useAxios.get(`/laporanBarangTerjual`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
}
