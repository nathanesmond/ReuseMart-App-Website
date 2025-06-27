import { useEffect, useState } from "react";
import { FetchDataPegawai, FetcHDataPembelian, FetchTransaksiGudangById, updateTanggalPengiriman } from "../../api/ApiGudang"; // Make sure path is correct
import { Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";
import { Button } from "../../components/ui/button";
import { FetchBarangPenitipById } from "../../api/ApiPenitip";
import { confirmAlert } from "react-confirm-alert";

type Pembelian = {
    id_barang: number;
    id_penitipan: number;
    id_kategori: string;
    id_hunter: string;
    nama_barang: string;
    deskripsi: string;
    foto: string;
    berat: number;
    isGaransi: boolean;
    akhir_garansi: string;
    status_perpanjangan: number;
    harga: number;
    tanggal_akhir: string;
    batas_ambil: string;
    status_barang: string;
    tanggal_ambil: string;
    metode_pengiriman: string;
};
const ModalAssignDate = ({ idPembelian, show, onClose }: any) => {
    const [dataPembelian, setDataPembelian] = useState<Pembelian | null>(null);
    const [pegawaiList, setPegawaiList] = useState<{ id_pegawai: number, nama: string }[]>([]);

    const [tanggalPengiriman, setTanggalPengiriman] = useState("");
    const [idPegawai, setIdPegawai] = useState("");


    const fetchDataPembelian = async () => {
        try {
            const response = await FetcHDataPembelian(idPembelian);
            setDataPembelian(response.data);
            console.log("Data Pembelian:", response.data);
        } catch (error: any) {
            console.error("Gagal mengambil data history", error);
        }
    };
    const fetchDataPegawai = async () => {
        try {
            const response = await FetchDataPegawai();
            setPegawaiList(response.data); // ← This sets the dropdown list
            console.log("Pegawai list:", response.data);
        } catch (error: any) {
            console.error("Error fetching pegawai list:", error);
        }
    };

    useEffect(() => {
        if (idPembelian && show) {
            fetchDataPembelian();
            fetchDataPegawai();
        }
    }, [idPembelian, show]);

    const handleSubmit = async () => {
        const payload: any = {};
        if (tanggalPengiriman) payload.tanggal_pengiriman = tanggalPengiriman;
        if (idPegawai) payload.id_pegawai = parseInt(idPegawai);


        confirmAlert({
            title: 'Konfirmasi',
            message: 'Apakah Anda yakin ingin melakukan Assign Date?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: async () => {
                        try {
                            const response = await updateTanggalPengiriman(idPembelian, payload);
                            confirmAlert({
                                title: 'Sukses',
                                message: "Date Berahasil Diassign",
                                buttons: [{ label: 'OK' }]
                            });
                        } catch (error: any) {
                            confirmAlert({
                                title: 'Gagal',
                                message: error.message || "Gagal menyelesaikan transaksi",
                                buttons: [{ label: 'OK' }]
                            });
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

    return (
        <Modal show={show} onClose={onClose} dismissible size="7xl">
            <ModalHeader>Assign Pengiriman</ModalHeader>
            <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block font-semibold">Tanggal Pengiriman</label>
                        <input
                            type="date"
                            className="border border-gray-300 rounded-md px-3 py-2 w-full"
                            value={tanggalPengiriman}
                            onChange={(e) => setTanggalPengiriman(e.target.value)}
                        />
                    </div>
                    {dataPembelian?.metode_pengiriman?.toLowerCase() === 'diantar' && (
                        <div>
                            <label className="block font-semibold">Pegawai</label>
                            <select
                                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                                value={idPegawai}
                                onChange={(e) => setIdPegawai(e.target.value)}
                            >
                                <option value="">Pilih Pegawai</option>
                                {pegawaiList.map((pegawai) => (
                                    <option key={pegawai.id_pegawai} value={pegawai.id_pegawai}>
                                        {pegawai.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

            </ModalBody>
            <ModalFooter>
                <Button onClick={handleSubmit}>Assign</Button>
                <Button color="gray" onClick={onClose}>Close</Button>
            </ModalFooter>
        </Modal>
    );
};


export default ModalAssignDate;