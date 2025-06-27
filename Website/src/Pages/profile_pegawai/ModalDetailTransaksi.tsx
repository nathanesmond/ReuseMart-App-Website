import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { ambilBarangPenitip, FetchBarangPenitipById } from "../../api/ApiPenitip";
import { SyncLoader } from "react-spinners";
import Frieren from "../../assets/images/Frieren.jpg";
import { extendBarangPenitip } from "../../api/ApiPenitip";
import { FetchTransaksiGudangById } from "../../api/ApiGudang";
type Barang = {
    id_barang: number;
    id_penitipan: number;
    id_kategori: string;
    id_hunter: string;
    nama_barang: string;
    deskripsi: string;
    foto: File | string;
    berat: number;
    isGaransi: boolean;
    akhir_garansi: string;
    status_perpanjangan: number;
    harga: number;
    tanggal_akhir: string;
    batas_ambil: string;
    status_barang: string;
    tanggal_ambil: string;
};
const ModalDetailTransaksi = ({ idPembelian, show, onClose }: any) => {
    const [dataHistory, setDataHistory] = useState<Barang[]>([]);

    const fetchTransaksiGudang = async () => {
        try {
            const response = await FetchTransaksiGudangById(idPembelian);
            console.log(response);


            setDataHistory(response.data); // assuming this is an array of Barang
            console.log("Foto path:", response.foto);
            console.log("Response data:", response.data);


        } catch (error: any) {
            console.error("Gagal mengambil data history", error);
        }
    };


    useEffect(() => {
        fetchTransaksiGudang();
    }, []);





    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <Modal show={show} onClose={handleClose} dismissible size="7xl"> {/* Perbesar modal */}
                <ModalHeader>Titipan Detail</ModalHeader>
                <ModalBody>
                    <div className="overflow-x-auto">
                        <table className="table-auto w-full text-center border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2">Photo</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Sold Date</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataHistory.length === 0 ? (
                                    (
                                        <tr>
                                            <td colSpan={6} className="py-10 text-gray-500">
                                                Loading...
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    dataHistory.map((item: any, index: number) => (
                                        <tr key={index} className="border-t border-gray-200">
                                            <td className="px-4 py-2">
                                                <img
                                                    src={typeof item.foto === "string"
                                                        ? `http://localhost:8000/storage/${item.foto}`
                                                        : item.foto instanceof File
                                                            ? URL.createObjectURL(item.foto)
                                                            : Frieren}
                                                    alt={item.nama_barang}
                                                    className="w-20 h-20 object-cover mx-auto rounded"
                                                />
                                            </td>
                                            <td className="px-4 py-2">{item.nama_barang}</td>
                                            <td className="px-4 py-2">Rp{item.harga.toLocaleString()}</td>
                                            <td className="px-4 py-2">{item.tanggal_lunas}</td>
                                            <td className="px-4 py-2">{item.status_barang}</td>

                                        </tr>
                                    ))
                                )}

                            </tbody>
                        </table>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button color="gray" onClick={handleClose}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>

        </>
    );
};

export default ModalDetailTransaksi;
