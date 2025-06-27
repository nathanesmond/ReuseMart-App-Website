import useAxios from ".";
import { getToken } from "./ApiPembeli";

const FetchDiskusi = async (idBarang: number) => {
	try {
		const response = await useAxios.get(`/fetchDiskusi/${idBarang}`, {
			headers: {
				"Content-Type": "application/json",
			},
		});

		return response.data;
	} catch (error: any) {
		throw error.response.data;
	}
};
const AddDiskusi = async (pesan: string, idBarang: number) => {
	try {
		const response = await useAxios.post(`/addDiskusi/${idBarang}`, pesan, {
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

const FetchDiskusiCS = async () => {
	try {
		const response = await useAxios.get("/fetchDiskusiCS", {
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

export { FetchDiskusi, AddDiskusi, FetchDiskusiCS };
