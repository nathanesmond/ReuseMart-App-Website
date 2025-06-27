import useAxios from ".";
import { getToken } from "./ApiPembeli";

const CreatePembelian = async (data: {
	metode_pengiriman: string; 
	id_alamat?: number;
	status_pengiriman: string; 
	poin_digunakan: number;
}) => {
    try{
        const response = await useAxios.post("/checkout", data, {
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            },
        });
        return response.data;
    }catch (error) {
        console.error("Error creating order:", error);
        throw error;
    }
};


const GetOngoingPembelian = async (nomor_nota : string) => {
    try{
        const response = await useAxios.get(`/getOngoingPembelian/${nomor_nota}`, {
            headers:{
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        })

        return response.data;
    }catch (error:any){
        console.error("Error fetching ongoing orders:", error.message);
        throw error;
    }
}

const AddBuktiPembayaran = async (data : FormData, nomor_nota : string) =>{
    try{
        const response = await useAxios.post(`/addBuktiPembayaran/${nomor_nota}`, data, {  
            headers:{
                "Accept": "multipart/form-data",
                "Authorization": `Bearer ${getToken()}`,
            }
        })
        return response.data;
    }catch (error:any){
        console.error("Error adding payment proof:", error.message);
        throw error;
    }
}

const GetUnverifiedPayment = async () =>{
    try{
        const response = await useAxios.get("/getUnverifiedPayment", {
            headers:{
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        })

        return response.data;

    }catch (error:any){
        console.log("Error fetching unverified payments:", error.message);
        throw error;
    }
}


const VerifyPayment = async (nomor_nota : string) =>{
    try{
        const response = await useAxios.post(`/verifyPayment/${nomor_nota}`, {}, {
            headers:{
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        })

        return response.data;

    }catch (error:any){
        console.log("Error fetching unverified payments:", error.message);
        throw error;
    }
}

const DeclinePayment = async (nomor_nota : string) =>{
    try{
        const response = await useAxios.post(`/declinePayment/${nomor_nota}`, {}, {
            headers:{
                "Accept": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        })

        return response.data;

    }catch (error:any){
        console.log("Error fetching unverified payments:", error.message);
        throw error;
    }
}

export { CreatePembelian, GetOngoingPembelian, AddBuktiPembayaran, GetUnverifiedPayment, VerifyPayment, DeclinePayment };
