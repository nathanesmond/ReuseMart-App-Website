import useAxios from ".";
import { getToken } from "./ApiPembeli";

const FetchPenitipByLogin = async () => {
    try {
        const response = await useAxios.get("/fetchPenitipByLogin", {
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

const FetchHistoryTransaksi = async () => {
    try {
        const response = await useAxios.get("/fetchHistoryTransaksi", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });

        return response.data;


    } catch (error: any) {
        throw error.response.data;
    }
}

const FetchHistoryTransaksiById = async (id_barang: number) => {
    try {
        const response = await useAxios.get(`/fetchHistoryTransaksiById/${id_barang}`, {
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

export const FetchBarangByPenitip = async () => {
    try {
        const response = await useAxios.get(`/fetchBarangbyPenitip`, {
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
export const FetchPenitipanExtended = async () => {
    try {
        const response = await useAxios.get(`/fetchPenitipanExtend`, {
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

export const extendBarangPenitipLagi = async (id_barang: number) => {
    try {
        const response = await useAxios.post(`/extendBarangPenitipLagi`,
            { id_barang }, // send ID in body
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                },
            }
        );

        return response.data;

    } catch (error: any) {
        throw error.response.data;
    }
};

export const FetchBarangPenitipById = async (idBarang: number) => {
    try {
        const response = await useAxios.get(`/fetchBarangPenitipById/${idBarang}`, {
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


export const FetchBarangPenitipByIdExtend = async (idBarang: number) => {
    try {
        const response = await useAxios.get(`/fetchBarangPenitipByIdExtend/${idBarang}`, {
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


export const extendBarangPenitip = async (id_barang: number) => {
    try {
        const response = await useAxios.post(`/extendBarangPenitip`,
            { id_barang }, // send ID in body
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                },
            }
        );

        return response.data;

    } catch (error: any) {
        throw error.response.data;
    }
};

export const ambilBarangPenitip = async (id_barang: number) => {
    try {
        const response = await useAxios.post(`/ambilBarangPenitip`,
            { id_barang }, // send ID in body
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${getToken()}`,
                },
            }
        );

        return response.data;

    } catch (error: any) {
        throw error.response.data;
    }
}


export { FetchPenitipByLogin, FetchHistoryTransaksi, FetchHistoryTransaksiById };
