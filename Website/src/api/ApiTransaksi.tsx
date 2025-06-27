import useAxios from ".";
import { getToken } from "./ApiPembeli";

export const fetchOrderHistory = async () => {
    const response = await useAxios.get("/order-history", {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
    return response.data;
};

export const fetchOrderHistoryById = async (id: number) => {
    const response = await useAxios.get(`/order-history/${id}`, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
        },
    });
    return response.data;
}

export const fetchOrderDetailsById = async (id: number) => {
    const response = await useAxios.get(`/order-details/${id}`, {
        headers: {
            "Authorization": `Bearer ${getToken()}`
        }
    });
    return response.data;
};

