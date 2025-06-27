import useAxios from ".";
import { getToken } from "./ApiPembeli";

const FetchBarang = async () => {
    try {
        const response = await useAxios.get("/fetchBarang", {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

const FetchBarangById = async (id_barang: number) => {
    try {
        const response = await useAxios.get(`/showBarang/${id_barang}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const FetchKategori = async () => {
    try {
        const response = await useAxios.get("/fetchKategori", {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const FetchBarangByKategori = async (id_kategori: string) => {
    try {
        const response = await useAxios.get(`/showBarangbyKategori/${id_kategori}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const FetchRelatedProducts = async (id_kategori: string) => {
    try {
        const response = await useAxios.get(`/relatedProducts/${id_kategori}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const FetchSearchBarang = async (searchTerm: string) => {
    try {
        const response = await useAxios.post(`/searchBarang`, {
            query: searchTerm
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

const FetchBarangIsGaransi = async () => {
    try {
        const response = await useAxios.get(`/showBarangIsGaransi`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const FetchBarangIsNotGaransi = async () => {
    try {
        const response = await useAxios.get(`/showBarangIsNotGaransi`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const fetchBarangByPenitip = async (id_barang: number) => {
    try {
        const response = await useAxios.get(`/showNamaPenitip/${id_barang}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

export const fetchBarangByPenitip2 = async (id_penitip: number) => {
    try {
        const response = await useAxios.get(`/barang/penitip/${id_penitip}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken()}`,

            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
}

const getPenitip = async (id_barang: number) => {
    try {
        const response = await useAxios.get(`/getPenitip/${id_barang}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error : any) {
        throw error.response.data  ;
    }
}



export { FetchBarang, FetchKategori, FetchBarangByKategori, FetchBarangById, FetchRelatedProducts, FetchSearchBarang, FetchBarangIsGaransi, FetchBarangIsNotGaransi, fetchBarangByPenitip, getPenitip };

