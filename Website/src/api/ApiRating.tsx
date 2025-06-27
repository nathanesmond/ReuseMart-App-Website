import axios from "axios";
import useAxios from ".";
import { getToken } from "./ApiPembeli";

export const getRating = async (id: number) => {
    try {
        const response = await useAxios.get(`/getRating/${id}`, {
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

export const createRating = async (data: any) => {
    try {
        const response = await useAxios.post("/createRating", data, {
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

export const fetchRating = async () => {
    try {
        const response = await useAxios.get("/fetchRating", {
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
