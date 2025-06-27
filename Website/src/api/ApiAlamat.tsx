import useAxios from ".";
import { getToken } from "./ApiPembeli";

type alamatData = {
    nama_kota : string;
    nama_alamat: string;
    nama_jalan:string;
    kode_pos: number;
}

const FetchAlamat = async () => {
    try{
        const response = await useAxios.get("/fetchAlamat",{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        return response.data;
    }catch(error : any){
        throw error.response.data;
    }

}

const AddAlamat = async (data : alamatData) => {
    try{
        const response = await useAxios.post("/addAlamat", data,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        return response.data;
    }catch(error : any){
        throw error.response.data;
    }
}

const UpdateAlamat = async (data : alamatData, idAlamat : number) => {
    try{
        const response = await useAxios.post(`/editAlamat/${idAlamat}`, data,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        return response.data;
    }catch(error : any){
        throw error.response.data;
    }
}

const DeleteAlamat = async (idAlamat : number) => {
    try{
        const response = await useAxios.delete(`/deleteAlamat/${idAlamat}`,{
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        return response.data;
    }catch(error : any){
        throw error.response.data;
    }
}

const SetUtama = async (idAlamat : number) =>{
    try{
        const response = await useAxios.post(`/setUtama/${idAlamat}`, {}, {
            headers :{
                "Content-Type": "application/json",
                "Authorization": `Bearer ${getToken()}`,
            }
        });
        return response.data;
    }catch ( error:any){
        throw error.response.data;
    }
}



export {FetchAlamat, AddAlamat, UpdateAlamat, DeleteAlamat, SetUtama};