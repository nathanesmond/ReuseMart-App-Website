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
import { confirmAlert } from "react-confirm-alert";
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
    wallet: number;
};

const ModalDetailTitipan = ({ idBarang, show, onClose }: any) => {
    const [data, setData] = useState<Barang | null>(null);

    const fetchBarangTitipanById = async () => {
        try {
            FetchBarangPenitipById(idBarang)
                .then((response) => {
                    console.log(response);
                    setData(response.data[0]);
                })
                .catch((error: any) => {
                    console.error("Gagal mengambil data history", error);
                });
        } catch (error: any) {
            throw error.response.data;
        }
    };

    const handleExtend = async (id_barang: number) => {
        confirmAlert({
            title: 'Konfirmasi',
            message: 'Apakah Anda yakin ingin melakukan Extend Penitipan?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: async () => {
                        try {
                            const response = await extendBarangPenitip(id_barang);
                            confirmAlert({
                                title: 'Sukses',
                                message: "Berhasil melakukan Extend Penitipan",
                                buttons: [{ label: 'OK' }]
                            });

                            fetchBarangTitipanById();

                        } catch (error: any) {

                        }
                    }
                },
                {
                    label: 'Tidak',
                    onClick: () => { /* Tidak melakukan apa-apa */ }
                }
            ]
        });
    };

    const handleAmbil = async (id_barang: number) => {
        confirmAlert({
            title: 'Konfirmasi',
            message: 'Apakah Anda yakin ingin mengambil Barang ini?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: async () => {
                        try {
                            const response = await ambilBarangPenitip(id_barang);
                            confirmAlert({
                                title: 'Sukses',
                                message: "Barang dalam masa pengambilan",
                                buttons: [{ label: 'OK' }]
                            });

                            fetchBarangTitipanById();

                        } catch (error: any) {
                            confirmAlert({
                                title: 'Gagal',
                                message: "Gagal mengambil Barang",
                                buttons: [{ label: 'OK' }]
                            });
                        }
                    }
                },
                {
                    label: 'Tidak',
                    onClick: () => { }
                }
            ]
        });
    };

    useEffect(() => {
        fetchBarangTitipanById();
    }, []);

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <Modal show={show} onClose={handleClose} dismissible>
                <ModalHeader>Titipan Detail</ModalHeader>
                <ModalBody>
                    {data === null ? (
                        <>
                            <div className="flex justify-center">
                                <SyncLoader size={10} color="#F5CB58" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="flex max-sm:flex-wrap gap-6">
                                <div className="w-1/2">
                                    <img
                                        src={
                                            typeof data.foto === "string"
                                                ? `http://localhost:8000/storage/${data.foto}`
                                                : URL.createObjectURL(data.foto)
                                        }

                                        className="object-cover w-full h-full"
                                        alt=""
                                        onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
                                    />
                                </div>

                                <div>
                                    <p className="text-3xl font-semibold text-black">
                                        Apakah Anda yakin ingin memperpanjang masa penitipan barang dengan harga {data.harga} dan pemotongan saldo {data.harga * 0.05}?
                                    </p>
                                    <div className="flex gap-4 mt-2">


                                    </div>
                                    <p className="text-2xl font-bold text-green-600 mt-2">
                                        Harga Barang: Rp {data.harga}
                                    </p>
                                    <hr className="my-2 border-t  w-[95%] border-gray-300" />
                                    <p className="text-md font-semibold ">Saldo :</p>
                                    <p className="text-sm font-normal text-gray-500 break-words whitespace-normal">
                                        Rp {data.wallet}
                                    </p>


                                </div>
                            </div>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    {data && (
                        <div className="flex gap-4">
                            <div className="flex gap-4">
                                <Button color="green" onClick={() => handleExtend(data.id_barang)}>
                                    Extend
                                </Button>

                            </div>



                        </div>
                    )}
                </ModalFooter>

            </Modal>
        </>
    );
};

export default ModalDetailTitipan;
