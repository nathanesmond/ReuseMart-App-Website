import useAxios from ".";

const getToken = () => {
    const token = sessionStorage.getItem("token") || null;
    return token;
}

const fetchPembeli = async () => {
    try {
        const response = await useAxios.get("/fetchPembeli", {
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
};  

const getAlamatUtama = async () =>{
    try{
        const response = await useAxios.get("/alamatUtama", {
            headers : {
                "Content-Type" : "application/json",
                "Authorization" : `Bearer ${getToken()}`,
            }
        });
        return response.data;
    }catch(error : any){
        throw error.response.data;
    }
}

export { fetchPembeli, getToken, getAlamatUtama };
