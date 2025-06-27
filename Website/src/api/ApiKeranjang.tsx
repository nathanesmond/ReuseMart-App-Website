import useAxios from ".";
import {useRef} from "react";
import { getToken } from "./ApiPembeli";
import { abort } from "process";


const AddKeranjang = async (id_barang: number) => {
    try {
        const response = await useAxios.post(`/addToKeranjang/${id_barang}`, {}, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });

        
        if (response.data.status === "error") {
            throw new Error(response.data.message);
        }

        return response.data;
    } catch (error: any) {
    
        throw error.response?.data?.message || error.message || "Unknown error";
    }
}

const FetchKeranjangByPembeli = async (signal?: AbortSignal) => {
    try {
        const response = await useAxios.get('/fetchKeranjang', {
            signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });

        return response.data;
    } catch (error: any) {
        
        throw error;
    }
};

const DeleteKeranjang = async (id_barang: number) => {
    try{
        const response = await useAxios.delete(`/deleteKeranjang/${id_barang}`, {
            headers : {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        })

        return response.data;
    }catch(error: any){
        throw error;
    }
}
export {AddKeranjang, FetchKeranjangByPembeli, DeleteKeranjang};