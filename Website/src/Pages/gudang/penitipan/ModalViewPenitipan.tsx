import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { FetchKategori } from "../../../api/ApiBarang";
import { fetchPegawai, fetchPenitip } from "../../../api/ApiPenitipan";

interface Kategori {
    id_kategori: string;
    nama: string;
}

interface Penitip {
    id_penitip: number;
    nama: string;
    wallet: string;
    telepon: string;
    email: string;
    password: string;
    foto_ktp: File;
    no_ktp: number;
    badges: string;
    total_rating: number;
    poin: number;
}

interface Pegawai {
    id_organisasi: number;
    id_pegawai: number;
    id_role: number;
    nama: string;
    email: string;
    password: string;
    tanggal_masuk: Date;
    tanggal_lahir: Date;
    wallet: number;
}

interface ModalViewPenitipanProps {
    dataPenitipan: {
        id_barang: number;
        id_penitipan: number;
        id_kategori: string;
        id_hunter: string;
        nama: string;
        deskripsi: string;
        foto: File | string | null;
        berat: number;
        isGaransi: boolean;
        akhir_garansi: Date | string;
        status_perpanjangan: boolean;
        harga: number;
        tanggal_akhir: Date | string;
        batas_ambil: Date | string;
        status_barang: string;
        tanggal_ambil: Date | string;
        id_pegawai: number;
        durasi_penitipan: number;
        tanggal_masuk: Date | string;
        id_penitip: number;
    };
    onClose: () => void;
    id_penitipan: number;
    show: boolean;
    onSuccessEdit: () => void;
}

const ModalViewPenitipan: React.FC<ModalViewPenitipanProps> = ({ show, onClose, dataPenitipan }) => {
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [pegawai, setPegawai] = useState<Pegawai[]>([]);
    const [penitip, setPenitip] = useState<Penitip[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [kategoriRes, pegawaiRes, penitipRes] = await Promise.all([
                FetchKategori(),
                fetchPegawai(),
                fetchPenitip(),
            ]);
            setKategori(kategoriRes.data);
            setPegawai(pegawaiRes.data);
            setPenitip(penitipRes.penitip);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getNamaKategori = (id: string) =>
        kategori.find((item) => String(item.id_kategori).toLowerCase() === String(id).toLowerCase())?.nama ?? "Unknown";

    const getNamaPenitip = (id: number) =>
        penitip.find((p) => String(p.id_penitip) === String(id))?.nama ?? "Unknown";

    const getNamaPegawai = (id: string) =>
        pegawai.find((p) => String(p.id_pegawai) === String(id))?.nama ?? "Unknown";

    const formatDate = (date: Date | string | undefined) =>
        date && !isNaN(new Date(date).getTime()) ? new Date(date).toLocaleDateString("id-ID") : "-";

    return (
        <Modal show={show} onClose={onClose} size="lg" popup aria-labelledby="view-penitipan-title">
            <ModalHeader />
            <ModalBody>
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        <SyncLoader color="#F5CB58" size={8} />
                        <p className="mt-2 text-gray-600">Memuat data...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <h3 id="view-penitipan-title" className="text-xl font-semibold text-center text-gray-900 dark:text-white">
                            Detail Barang Titipan
                        </h3>

                        {dataPenitipan.foto ? (
                            <div className="flex justify-center">
                                <img
                                    src={typeof dataPenitipan.foto === "string" ? dataPenitipan.foto : URL.createObjectURL(dataPenitipan.foto)}
                                    alt={dataPenitipan.nama || "Foto Barang"}
                                    className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                                    onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")} // Fallback image
                                />
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                                    Tidak ada foto
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">ID Barang:</span> {dataPenitipan.id_barang}
                            </div>
                            <div>
                                <span className="font-semibold">ID Penitipan:</span> {dataPenitipan.id_penitipan}
                            </div>
                            <div>
                                <span className="font-semibold">Nama Penitip:</span> {getNamaPenitip(dataPenitipan.id_penitip)}
                            </div>
                            <div>
                                <span className="font-semibold">Tanggal Masuk:</span>{" "}
                                {dataPenitipan.tanggal_masuk && !isNaN(new Date(dataPenitipan.tanggal_masuk).getTime())
                                    ? new Date(dataPenitipan.tanggal_masuk).toLocaleString("id-ID", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })
                                    : "-"}
                            </div>
                            <div>
                                <span className="font-semibold">Nama Barang:</span> {dataPenitipan.nama || "-"}
                            </div>
                            <div>
                                <span className="font-semibold">Kategori:</span> {getNamaKategori(dataPenitipan.id_kategori)}
                            </div>
                            <div>
                                <span className="font-semibold">Harga:</span> Rp{dataPenitipan.harga.toLocaleString("id-ID") || "-"}
                            </div>
                            <div>
                                <span className="font-semibold">Berat:</span> {dataPenitipan.berat ? `${dataPenitipan.berat} kg` : "-"}
                            </div>
                            <div>
                                <span className="font-semibold">Garansi:</span> {dataPenitipan.isGaransi ? "Ya" : "Tidak"}
                            </div>
                            {dataPenitipan.isGaransi && dataPenitipan.akhir_garansi ? (
                                <div>
                                    <span className="font-semibold">Akhir Garansi:</span> {formatDate(dataPenitipan.akhir_garansi)}
                                </div>
                            ) : null}
                            <div>
                                <span className="font-semibold">Perpanjangan:</span> {dataPenitipan.status_perpanjangan ? "Ya" : "Tidak"}
                            </div>
                            <div>
                                <span className="font-semibold">Status Barang:</span> {dataPenitipan.status_barang || "-"}
                            </div>
                            <div>
                                <span className="font-semibold">Tanggal Ambil:</span> {formatDate(dataPenitipan.tanggal_ambil)}
                            </div>
                            <div>
                                <span className="font-semibold">Tanggal Akhir:</span> {formatDate(dataPenitipan.tanggal_akhir)}
                            </div>
                            <div>
                                <span className="font-semibold">Batas Ambil:</span> {formatDate(dataPenitipan.batas_ambil)}
                            </div>
                            <div>
                                <span className="font-semibold">Hunter:</span> {getNamaPegawai(dataPenitipan.id_hunter)}
                            </div>
                            <div>
                                <span className="font-semibold">Pegawai:</span> {getNamaPegawai(dataPenitipan.id_pegawai.toString())}
                            </div>
                            <div>
                                <span className="font-semibold">Durasi Penitipan:</span>{" "}
                                {dataPenitipan.durasi_penitipan ? `${dataPenitipan.durasi_penitipan} hari` : "-"}
                            </div>
                        </div>

                        <div>
                            <p className="font-semibold mb-1">Deskripsi:</p>
                            <p className="text-sm text-gray-700 break-words">
                                {dataPenitipan.deskripsi || "Tidak ada deskripsi"}
                            </p>
                        </div>

                        <div className="flex justify-end">
                            <button
                                className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                )}
            </ModalBody>
        </Modal>
    );
};

export default ModalViewPenitipan;