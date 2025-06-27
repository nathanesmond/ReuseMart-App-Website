import axios from "axios";
import useAxios from ".";
import { getToken } from "./ApiPembeli";

const FetchOrganisasi = async () => {
    try {
        const response = await useAxios.get("/fetchOrganisasi", {
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

const UpdateOrganisasi = async (data: FormData, idOrganisasi: number) => {
    try {
        const response = await useAxios.post(`/updateOrganisasi/${idOrganisasi}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

const DeleteOrganisasi = async (idOrganisasi: number) => {
    try {
        const response = await useAxios.delete(`/deleteOrganisasi/${idOrganisasi}`, {
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


const FetchPenitip = async () => {
    try {
        const response = await useAxios.get("/fetchPenitip", {
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

export async function UpdatePenitip(data: FormData, id: number) {
    try {
        const response = await axios.post(
            `http://127.0.0.1:8000/api/updatePenitip/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${getToken()}`,

                },

            }
        );
        return response.data;
    } catch (error: any) {
        console.error("UpdatePenitip error:", error);
        throw error;
    }

}


const DeletePenitip = async (idPenitip: number) => {
    try {
        const response = await useAxios.delete(`/deletePenitip/${idPenitip}`, {
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

export const AddPenitip = (formData: FormData) => {
    return axios
        .post("http://127.0.0.1:8000/api/addPenitip", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken()}`,

            },
        })
        .then((response) => response.data)
        .catch((err) => {
            throw err;
        });
};

const FetchPegawai = async () => {
    try {
        const response = await useAxios.get("/fetchPegawai", {
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

const UpdatePegawai = async (data: FormData, idPegawai: number) => {
    try {
        const response = await useAxios.post(`/updatePegawai/${idPegawai}`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (error: any) {
        throw error.response.data;
    }
};

const DeletePegawai = async (idPegawai: number) => {
    try {
        const response = await useAxios.delete(`/deletePegawai/${idPegawai}`, {
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

const AddPegawai = async (data: FormData) => {
    try {
        const response = await useAxios.post(`/addPegawai`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    } catch (err) {
        throw err;
    }
};

const ResetPassword = async (id: number) => {
    try {
        const response = await useAxios.post(`/resetPassword/${id}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        })
        return response.data;

    } catch (error: any) {
        throw error.response.data;
    }
}

const FetchRole = async () => {
    try {
        const response = await useAxios.get("/fetchRoles", {
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
export { FetchOrganisasi, UpdateOrganisasi, DeleteOrganisasi, FetchPenitip, DeletePenitip, AddPegawai, FetchPegawai, UpdatePegawai, DeletePegawai, ResetPassword, FetchRole };