import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Label, Modal, ModalBody, ModalHeader, TextInput, Textarea } from "flowbite-react";
import { fetchPegawai, fetchPenitip, updatePenitipan } from "../../../api/ApiPenitipan";
import { FetchKategori } from "../../../api/ApiBarang";

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

interface ModalEditPenitipanProps {
    dataPenitipan: {
        id_barang: number;
        id_penitipan: number;
        id_kategori: string;
        id_hunter: string;
        nama: string;
        deskripsi: string;
        foto: File | null;
        berat: number;
        isGaransi: boolean;
        akhir_garansi: Date | string;
        status_perpanjangan: boolean;
        harga: number;
        tanggal_akhir: Date;
        batas_ambil: Date;
        status_barang: string;
        tanggal_ambil: Date | string;
        id_pegawai: number;
        durasi_penitipan: number;
        tanggal_masuk: Date | string;
    };
    onClose: () => void;
    id_penitipan: number;
    id_pegawai: number;
    show: boolean;
    onSuccessEdit: () => void;
}

interface FormErrors {
    id_kategori?: string;
    nama?: string;
    deskripsi?: string;
    berat?: string;
    harga?: string;
    status_barang?: string;
    akhir_garansi?: string;
    tanggal_ambil?: string;
    id_hunter?: string;
}

const ModalEditPenitipan = ({ dataPenitipan, onClose, show, onSuccessEdit }: ModalEditPenitipanProps) => {
    const [data, setData] = useState(dataPenitipan);
    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [pegawai, setPegawai] = useState<Pegawai[]>([]);
    const [penitip, setPenitip] = useState<Penitip[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

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
            toast.error("Gagal memuat data", { position: "top-right", autoClose: 3000 });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.id_kategori) newErrors.id_kategori = "Kategori wajib dipilih";
        if (!data.nama) newErrors.nama = "Nama barang wajib diisi";
        if (!data.deskripsi) newErrors.deskripsi = "Deskripsi wajib diisi";
        if (!data.berat || data.berat <= 0) newErrors.berat = "Berat harus lebih dari 0";
        if (!data.harga || data.harga <= 0) newErrors.harga = "Harga harus lebih dari 0";
        if (!data.status_barang) newErrors.status_barang = "Status barang wajib diisi";
        if (data.tanggal_ambil && isNaN(new Date(data.tanggal_ambil).getTime()))
            newErrors.tanggal_ambil = "Tanggal ambil tidak valid";
        return newErrors;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = event.target;
        const newValue = type === "checkbox" ? (event.target as HTMLInputElement).checked : value;
        setData({ ...data, [name]: newValue });
        setErrors({ ...errors, [name]: undefined }); 
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setData({ ...data, foto: file });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Harap isi semua kolom dengan benar", { position: "top-right", autoClose: 3000 });
            return;
        }
        setShowConfirmModal(true);
    };

    const submitData = async () => {
        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append("id_kategori", data.id_kategori.toString());
            formData.append("nama", data.nama.toString());
            formData.append("deskripsi", data.deskripsi.toString());
            formData.append("berat", data.berat.toString());
            formData.append("isGaransi", data.isGaransi ? "1" : "0");
            formData.append("akhir_garansi", new Date(data.akhir_garansi).toISOString().split("T")[0]);
            formData.append("status_perpanjangan", data.status_perpanjangan ? "1" : "0");
            formData.append("harga", data.harga.toString());
            formData.append("status_barang", data.status_barang.toString());
            if(data.id_hunter){
                formData.append("id_hunter", data.id_hunter.toString());
            }
            if (data.tanggal_ambil && !isNaN(new Date(data.tanggal_ambil).getTime())) {
                formData.append("tanggal_ambil", new Date(data.tanggal_ambil).toISOString().split("T")[0]);
            }
            if (data.foto) {
                formData.append("foto", data.foto);
            }

            const response = await updatePenitipan(formData, data.id_barang);
            toast.success(response.message || "Data barang berhasil diperbarui", {
                position: "top-right",
                autoClose: 3000,
            });
            onSuccessEdit();
            handleClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Gagal memperbarui data barang", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setIsPending(false);
            setShowConfirmModal(false);
        }
    };

    const handleClose = () => {
        setErrors({});
        setShowConfirmModal(false);
        onClose();
    };

    const getNamaKategori = (id: string) =>
        kategori.find((item) => String(item.id_kategori).toLowerCase() === String(id).toLowerCase())?.nama ?? "Unknown";

    return (
        <>
            <Modal show={show} dismissible size="lg" popup onClose={handleClose} aria-labelledby="edit-barang-title">
                <ModalHeader />
                <ModalBody>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <SyncLoader color="#F5CB58" size={8} />
                            <p className="mt-2 text-gray-600">Memuat data...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="space-y-6">
                                <h3 id="edit-barang-title" className="text-xl font-medium text-gray-900 dark:text-white">
                                    Edit Barang Titipan
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="id_kategori" className="mb-2 block">
                                            Kategori
                                        </Label>
                                        <select
                                            id="id_kategori"
                                            name="id_kategori"
                                            value={data.id_kategori || ""}
                                            onChange={handleChange}
                                            className={`w-full rounded-lg border ${errors.id_kategori ? "border-red-500" : "border-gray-300"} p-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                            aria-invalid={!!errors.id_kategori}
                                            aria-describedby={errors.id_kategori ? "id_kategori-error" : undefined}
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {kategori.map((item) => (
                                                <option key={item.id_kategori} value={item.id_kategori}>
                                                    {getNamaKategori(item.id_kategori)}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.id_kategori && (
                                            <p id="id_kategori-error" className="mt-1 text-sm text-red-500">
                                                {errors.id_kategori}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="nama" className="mb-2 block">
                                            Nama Barang
                                        </Label>
                                        <TextInput
                                            id="nama"
                                            name="nama"
                                            value={data.nama}
                                            onChange={handleChange}
                                            color={errors.nama ? "failure" : "gray"}
                                            aria-invalid={!!errors.nama}
                                            aria-describedby={errors.nama ? "nama-error" : undefined}
                                        />
                                        {errors.nama && (
                                            <p id="nama-error" className="mt-1 text-sm text-red-500">
                                                {errors.nama}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="deskripsi" className="mb-2 block">
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="deskripsi"
                                            name="deskripsi"
                                            value={data.deskripsi}
                                            onChange={handleChange}
                                            rows={4}
                                            className={errors.deskripsi ? "border-red-500" : ""}
                                            aria-invalid={!!errors.deskripsi}
                                            aria-describedby={errors.deskripsi ? "deskripsi-error" : undefined}
                                        />
                                        {errors.deskripsi && (
                                            <p id="deskripsi-error" className="mt-1 text-sm text-red-500">
                                                {errors.deskripsi}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="berat" className="mb-2 block">
                                            Berat (kg)
                                        </Label>
                                        <TextInput
                                            id="berat"
                                            name="berat"
                                            type="number"
                                            value={data.berat}
                                            onChange={handleChange}
                                            color={errors.berat ? "failure" : "gray"}
                                            aria-invalid={!!errors.berat}
                                            aria-describedby={errors.berat ? "berat-error" : undefined}
                                        />
                                        {errors.berat && (
                                            <p id="berat-error" className="mt-1 text-sm text-red-500">
                                                {errors.berat}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="harga" className="mb-2 block">
                                            Harga
                                        </Label>
                                        <TextInput
                                            id="harga"
                                            name="harga"
                                            type="number"
                                            value={data.harga}
                                            onChange={handleChange}
                                            color={errors.harga ? "failure" : "gray"}
                                            aria-invalid={!!errors.harga}
                                            aria-describedby={errors.harga ? "harga-error" : undefined}
                                        />
                                        {errors.harga && (
                                            <p id="harga-error" className="mt-1 text-sm text-red-500">
                                                {errors.harga}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            id="isGaransi"
                                            name="isGaransi"
                                            type="checkbox"
                                            checked={data.isGaransi}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="isGaransi" className="mb-0">
                                            Ada Garansi?
                                        </Label>
                                    </div>

                                    {data.isGaransi && (
                                        <div>
                                            <Label htmlFor="akhir_garansi" className="mb-2 block">
                                                Akhir Garansi
                                            </Label>
                                            <TextInput
                                                id="akhir_garansi"
                                                name="akhir_garansi"
                                                type="date"
                                                value={
                                                    data.akhir_garansi && !isNaN(new Date(data.akhir_garansi).getTime())
                                                        ? new Date(data.akhir_garansi).toISOString().split("T")[0]
                                                        : ""
                                                }
                                                onChange={handleChange}
                                                color={errors.akhir_garansi ? "failure" : "gray"}
                                                aria-invalid={!!errors.akhir_garansi}
                                                aria-describedby={errors.akhir_garansi ? "akhir_garansi-error" : undefined}
                                            />
                                            {errors.akhir_garansi && (
                                                <p id="akhir_garansi-error" className="mt-1 text-sm text-red-500">
                                                    {errors.akhir_garansi}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className={`flex items-center gap-2 ${dataPenitipan.status_perpanjangan ? "opacity-60" : ""}`}>
                                        <input
                                            id="status_perpanjangan"
                                            name="status_perpanjangan"
                                            type="checkbox"
                                            checked={data.status_perpanjangan}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                            disabled={!!dataPenitipan.status_perpanjangan}
                                            readOnly={!!dataPenitipan.status_perpanjangan}
                                        />
                                        <Label htmlFor="status_perpanjangan" className="mb-0">
                                            Status Perpanjangan
                                            {dataPenitipan.status_perpanjangan ? " (Sudah Aktif)" : ""}
                                        </Label>
                                    </div>

                                    <div>
                                        <Label htmlFor="status_barang" className="mb-2 block">
                                            Status Barang
                                        </Label>
                                        <TextInput
                                            id="status_barang"
                                            name="status_barang"
                                            value={data.status_barang}
                                            onChange={handleChange}
                                            color={errors.status_barang ? "failure" : "gray"}
                                            aria-invalid={!!errors.status_barang}
                                            aria-describedby={errors.status_barang ? "status_barang-error" : undefined}
                                        />
                                        {errors.status_barang && (
                                            <p id="status_barang-error" className="mt-1 text-sm text-red-500">
                                                {errors.status_barang}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="tanggal_ambil" className="mb-2 block">
                                            Tanggal Ambil
                                        </Label>
                                        <TextInput
                                            id="tanggal_ambil"
                                            name="tanggal_ambil"
                                            type="date"
                                            value={
                                                data.tanggal_ambil && !isNaN(new Date(data.tanggal_ambil).getTime())
                                                    ? new Date(data.tanggal_ambil).toISOString().split("T")[0]
                                                    : ""
                                            }
                                            onChange={handleChange}
                                            color={errors.tanggal_ambil ? "failure" : "gray"}
                                            aria-invalid={!!errors.tanggal_ambil}
                                            aria-describedby={errors.tanggal_ambil ? "tanggal_ambil-error" : undefined}
                                        />
                                        {errors.tanggal_ambil && (
                                            <p id="tanggal_ambil-error" className="mt-1 text-sm text-red-500">
                                                {errors.tanggal_ambil}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="id_hunter" className="mb-2 block">
                                            Nama Hunter
                                        </Label>
                                        <select
                                            id="id_hunter"
                                            name="id_hunter"
                                            value={data.id_hunter || ""}
                                            onChange={handleChange}
                                            className={`w-full rounded-lg border  p-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        >
                                            <option value="">Pilih Hunter</option>
                                            {pegawai
                                                .filter((item) => item.id_role === 4)
                                                .map((item) => (
                                                    <option key={item.id_pegawai} value={item.id_pegawai}>
                                                        {item.nama}
                                                    </option>
                                                ))}
                                        </select>
                                    </div>

                                    <div>
                                        <Label htmlFor="foto" className="mb-2 block">
                                            Foto Barang
                                        </Label>
                                        <input
                                            type="file"
                                            id="foto"
                                            name="foto"
                                            onChange={handleFileChange}
                                            className="w-full text-sm"
                                            accept="image/*"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        className="flex-1 rounded-lg bg-gray-400 p-2 text-white hover:bg-gray-500 transition-colors disabled:bg-gray-300"
                                        onClick={handleClose}
                                        disabled={isPending}
                                        aria-label="Cancel"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 transition-colors disabled:bg-green-300"
                                        aria-label="Submit changes"
                                    >
                                        {isPending ? <SyncLoader size={6} color="#fff" /> : "Edit"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </ModalBody>
            </Modal>

            <Modal show={showConfirmModal} size="sm" popup onClose={() => setShowConfirmModal(false)} aria-labelledby="confirm-modal-title">
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <h3 id="confirm-modal-title" className="mb-5 text-lg font-normal text-gray-700 dark:text-gray-300">
                            Yakin ingin menyimpan perubahan?
                        </h3>
                        <div className="flex justify-center gap-4 mt-4">
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:bg-red-300"
                                onClick={() => setShowConfirmModal(false)}
                                disabled={isPending}
                                aria-label="Cancel confirmation"
                            >
                                Batal
                            </button>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                                onClick={submitData}
                                disabled={isPending}
                                aria-label="Confirm save"
                            >
                                {isPending ? <SyncLoader size={6} color="#fff" /> : "Ya, simpan"}
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ModalEditPenitipan;