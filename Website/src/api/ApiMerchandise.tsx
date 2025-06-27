import useAxios from ".";
import { getToken } from "./ApiPembeli";

export const fetchPenukaranPoin = async () => {
    try {
        const response = await useAxios.get(`/getPenukaranPoin`, {
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

export const updatePenukaranPoin = async (id: number, data: any) => {
    try {
        const response = await useAxios.post(`/updatePenukaranPoin/${id}`, data, {
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