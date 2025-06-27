import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Label, Modal, ModalBody, ModalHeader, TextInput, Textarea } from "flowbite-react";
import { fetchPegawai, addPenitipan, addBarang, fetchPenitip } from "../../../api/ApiPenitipan";
import { FetchKategori } from "../../../api/ApiBarang";

interface Kategori {
    id_kategori: string;
    nama: string;
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

interface ModalAddPenitipanProps {
    onClose: () => void;
    show: boolean;
    onSuccessAdd: () => void;
    requestData: {
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
        tanggal_akhir: Date | string;
        batas_ambil: Date | string;
        status_barang: string;
        tanggal_ambil: Date | string;
        id_pegawai: number;
        tanggal_masuk: Date | string;
        id_penitip: number;
    };
}

interface FormData {
    id_kategori: string;
    id_hunter: string;
    nama: string;
    deskripsi: string;
    foto: File | null;
    berat: number;
    isGaransi: boolean;
    akhir_garansi: string;
    status_perpanjangan: boolean;
    harga: number;
    status_barang: string;
    tanggal_ambil: string;
    id_pegawai: number;
    id_penitip: number;
    tanggal_masuk: string;
}

interface FormErrors {
    id_kategori?: string;
    id_hunter?: string;
    nama?: string;
    deskripsi?: string;
    berat?: string;
    harga?: string;
    status_barang?: string;
    id_pegawai?: string;
    id_penitip?: string;
    tanggal_masuk?: string;
    akhir_garansi?: string;
    tanggal_ambil?: string;
    foto?: string;
}

const ModalAddPenitipan: React.FC<ModalAddPenitipanProps> = ({ show, onClose, onSuccessAdd, requestData }) => {
    const [items, setItems] = useState<FormData[]>([]);
    const [currentItem, setCurrentItem] = useState<FormData>({
        id_kategori: "",
        id_hunter: "",
        nama: "",
        deskripsi: "",
        foto: null,
        berat: 0,
        isGaransi: false,
        akhir_garansi: "",
        status_perpanjangan: false,
        harga: 0,
        status_barang: "",
        tanggal_ambil: "",
        id_pegawai: requestData.id_pegawai || 0,
        id_penitip: requestData.id_penitip || 0,
        tanggal_masuk: requestData.tanggal_masuk
            ? new Date(requestData.tanggal_masuk).toISOString().split("T")[0]
            : "",
    });
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [pegawai, setPegawai] = useState<Pegawai[]>([]);
    const [penitip, setPenitip] = useState<Penitip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(show);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isFirstItem, setIsFirstItem] = useState(true);

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

    useEffect(() => {
        setShowAddModal(show);
        if (show) {
            setIsFirstItem(true);
            setItems([]);
            setCurrentItem({
                id_kategori: "",
                id_hunter: "",
                nama: "",
                deskripsi: "",
                foto: null,
                berat: 0,
                isGaransi: false,
                akhir_garansi: "",
                status_perpanjangan: false,
                harga: 0,
                status_barang: "",
                tanggal_ambil: "",
                id_pegawai: requestData.id_pegawai || 0,
                id_penitip: requestData.id_penitip || 0,
                tanggal_masuk: requestData.tanggal_masuk
                    ? new Date(requestData.tanggal_masuk).toISOString().split("T")[0]
                    : "",
            });
        }
    }, [show, requestData]);

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!currentItem.id_kategori) newErrors.id_kategori = "Kategori wajib dipilih";
        if (!currentItem.nama) newErrors.nama = "Nama barang wajib diisi";
        if (!currentItem.deskripsi) newErrors.deskripsi = "Deskripsi wajib diisi";
        if (!currentItem.berat || currentItem.berat <= 0) newErrors.berat = "Berat harus lebih dari 0";
        if (!currentItem.harga || currentItem.harga <= 0) newErrors.harga = "Harga harus lebih dari 0";
        if (!currentItem.status_barang) newErrors.status_barang = "Status barang wajib dipilih";
        if (isFirstItem) {
            if (!currentItem.id_pegawai) newErrors.id_pegawai = "Nama QC wajib dipilih";
            if (!currentItem.id_penitip) newErrors.id_penitip = "Nama penitip wajib dipilih";
            if (!currentItem.tanggal_masuk) newErrors.tanggal_masuk = "Tanggal masuk wajib diisi";
            if (currentItem.tanggal_masuk && isNaN(new Date(currentItem.tanggal_masuk).getTime()))
                newErrors.tanggal_masuk = "Tanggal masuk tidak valid";
        }
        if (!currentItem.foto) newErrors.foto = "Foto barang wajib diisi";
        if (currentItem.isGaransi && (!currentItem.akhir_garansi || isNaN(new Date(currentItem.akhir_garansi).getTime())))
            newErrors.akhir_garansi = "Tanggal akhir garansi tidak valid";
        if (currentItem.isGaransi && currentItem.akhir_garansi && new Date(currentItem.akhir_garansi) <= new Date())
            newErrors.akhir_garansi = "Tanggal akhir garansi harus di masa depan";
        if (currentItem.tanggal_ambil && isNaN(new Date(currentItem.tanggal_ambil).getTime()))
            newErrors.tanggal_ambil = "Tanggal ambil tidak valid";
        return newErrors;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setCurrentItem({ ...currentItem, [name]: newValue });
        setErrors({ ...errors, [name]: undefined });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setCurrentItem({ ...currentItem, foto: file });
        setErrors({ ...errors, foto: undefined });
    };

    const handleAddItem = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            if (validationErrors.foto) {
                toast.error("Foto barang wajib diisi", { position: "top-right", autoClose: 3000 });
            } else {
                toast.error("Harap isi semua kolom dengan benar", { position: "top-right", autoClose: 3000 });
            }
            return;
        }

        setItems([...items, currentItem]);
        setCurrentItem({
            ...currentItem,
            id_kategori: "",
            id_hunter: "",
            nama: "",
            deskripsi: "",
            foto: null,
            berat: 0,
            isGaransi: false,
            akhir_garansi: "",
            status_perpanjangan: false,
            harga: 0,
            status_barang: "",
            tanggal_ambil: "",
        });
        setErrors({});
        setIsFirstItem(false);
        setShowAddModal(true);
    };

    const handleProceedToConfirm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            if (validationErrors.foto) {
                toast.error("Foto barang wajib diisi", { position: "top-right", autoClose: 3000 });
            } else {
                toast.error("Harap isi semua kolom dengan benar", { position: "top-right", autoClose: 3000 });
            }
            return;
        }

        setItems([...items, currentItem]);
        setShowAddModal(false);
        setShowConfirmModal(true);
    };

    const submitData = async () => {
        if (items.length === 0) {
            toast.error("Tidak ada barang untuk disimpan", { position: "top-right", autoClose: 3000 });
            return;
        }

        setIsPending(true);
        try {
            const firstItem = items[0];
            const formDataPenitipan = new FormData();
            formDataPenitipan.append(
                "tanggal_masuk",
                new Date(firstItem.tanggal_masuk).toISOString()
            );
            formDataPenitipan.append("id_penitip", String(firstItem.id_penitip));
            formDataPenitipan.append("id_pegawai", String(firstItem.id_pegawai));
            formDataPenitipan.append("id_kategori", firstItem.id_kategori);
            formDataPenitipan.append("id_hunter", firstItem.id_hunter || "");
            formDataPenitipan.append("nama", firstItem.nama);
            formDataPenitipan.append("deskripsi", firstItem.deskripsi);
            formDataPenitipan.append("berat", String(firstItem.berat));
            formDataPenitipan.append("harga", String(firstItem.harga));
            formDataPenitipan.append("isGaransi", firstItem.isGaransi ? "1" : "0");
            if (firstItem.isGaransi && firstItem.akhir_garansi) {
                formDataPenitipan.append("akhir_garansi", firstItem.akhir_garansi);
            }
            formDataPenitipan.append("status_perpanjangan", firstItem.status_perpanjangan ? "1" : "0");
            formDataPenitipan.append("status_barang", firstItem.status_barang);
            if (firstItem.tanggal_ambil) {
                console.log(`Sending tanggal_ambil for item ${firstItem.nama}:`, firstItem.tanggal_ambil);
                formDataPenitipan.append("tanggal_ambil", firstItem.tanggal_ambil);
            } else {
                console.log(`tanggal_ambil is empty for item ${firstItem.nama}, not sending`);
            }
            if (firstItem.foto) {
                formDataPenitipan.append("foto", firstItem.foto);
            }

            const penitipanRes = await addPenitipan(formDataPenitipan);
            console.log("addPenitipan response:", penitipanRes); 
            const id_penitipan = penitipanRes.data?.penitipan?.id_penitipan;

            if (!id_penitipan) {
                throw new Error("Failed to retrieve id_penitipan from addPenitipan response");
            }

            for (let i = 1; i < items.length; i++) {
                const item = items[i];
                const formDataBarang = new FormData();
                formDataBarang.append("id_kategori", item.id_kategori);
                formDataBarang.append("id_hunter", item.id_hunter || "");
                formDataBarang.append("nama", item.nama);
                formDataBarang.append("deskripsi", item.deskripsi);
                formDataBarang.append("berat", String(item.berat));
                formDataBarang.append("harga", String(item.harga));
                formDataBarang.append("isGaransi", item.isGaransi ? "1" : "0");
                if (item.isGaransi && item.akhir_garansi) {
                    formDataBarang.append("akhir_garansi", item.akhir_garansi);
                }
                formDataBarang.append("status_perpanjangan", item.status_perpanjangan ? "1" : "0");
                formDataBarang.append("status_barang", item.status_barang);
                if (item.tanggal_ambil) {
                    console.log(`Sending tanggal_ambil for item ${item.nama}:`, item.tanggal_ambil);
                    formDataBarang.append("tanggal_ambil", item.tanggal_ambil);
                } else {
                    console.log(`tanggal_ambil is empty for item ${item.nama}, not sending`);
                }
                if (item.foto) {
                    formDataBarang.append("foto", item.foto);
                }

                await addBarang(formDataBarang, id_penitipan);
            }

            toast.success(penitipanRes.message || "Berhasil menambahkan penitipan", {
                position: "top-right",
                autoClose: 3000,
            });
            onSuccessAdd();
            handleClose();
        } catch (err: any) {
            console.error("Submit error:", err);
            toast.error(err.message || "Gagal menambahkan penitipan", {
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
        setShowAddModal(false);
        setItems([]);
        setCurrentItem({
            id_kategori: "",
            id_hunter: "",
            nama: "",
            deskripsi: "",
            foto: null,
            berat: 0,
            isGaransi: false,
            akhir_garansi: "",
            status_perpanjangan: false,
            harga: 0,
            status_barang: "",
            tanggal_ambil: "",
            id_pegawai: 0,
            id_penitip: 0,
            tanggal_masuk: "",
        });
        setIsFirstItem(true);
        onClose();
    };

    return (
        <>
            <Modal
                show={showAddModal}
                onClose={handleClose}
                size="lg"
                popup
                dismissible
                aria-labelledby="add-penitipan-title"
            >
                <ModalHeader />
                <ModalBody>
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10">
                            <SyncLoader color="#F5CB58" size={8} />
                            <p className="mt-2 text-gray-600">Memuat data...</p>
                        </div>
                    ) : (
                        <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
                            <div className="space-y-6">
                                <h3 id="add-penitipan-title" className="text-xl font-semibold text-gray-900 dark:text-white">
                                    Tambah Barang Titipan {items.length + 1}
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    {isFirstItem && (
                                        <>
                                            <div>
                                                <Label htmlFor="id_penitip" className="mb-2 block">
                                                    Nama Penitip
                                                </Label>
                                                <select
                                                    id="id_penitip"
                                                    name="id_penitip"
                                                    value={currentItem.id_penitip || ""}
                                                    onChange={handleChange}
                                                    className={`w-full rounded-lg border ${errors.id_penitip ? "border-red-500" : "border-gray-300"} p-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                                    aria-invalid={!!errors.id_penitip}
                                                    aria-describedby={errors.id_penitip ? "id_penitip-error" : undefined}
                                                >
                                                    <option value="">Pilih Penitip</option>
                                                    {penitip.map((item) => (
                                                        <option key={item.id_penitip} value={item.id_penitip}>
                                                            {item.nama}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.id_penitip && (
                                                    <p id="id_penitip-error" className="mt-1 text-sm text-red-500">
                                                        {errors.id_penitip}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="tanggal_masuk" className="mb-2 block">
                                                    Tanggal Masuk
                                                </Label>
                                                <TextInput
                                                    id="tanggal_masuk"
                                                    name="tanggal_masuk"
                                                    type="datetime-local"
                                                    value={
                                                        currentItem.tanggal_masuk && !isNaN(new Date(currentItem.tanggal_masuk).getTime())
                                                            ? (() => {
                                                                const d = new Date(currentItem.tanggal_masuk);
                                                                const pad = (n: number) => n.toString().padStart(2, "0");
                                                                return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                                                            })()
                                                            : ""
                                                    }
                                                    onChange={handleChange}
                                                    color={errors.tanggal_masuk ? "failure" : "gray"}
                                                    aria-invalid={!!errors.tanggal_masuk}
                                                    aria-describedby={errors.tanggal_masuk ? "tanggal_masuk-error" : undefined}
                                                />
                                                {errors.tanggal_masuk && (
                                                    <p id="tanggal_masuk-error" className="mt-1 text-sm text-red-500">
                                                        {errors.tanggal_masuk}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="id_pegawai" className="mb-2 block">
                                                    Nama QC
                                                </Label>
                                                <select
                                                    id="id_pegawai"
                                                    name="id_pegawai"
                                                    value={currentItem.id_pegawai || ""}
                                                    onChange={handleChange}
                                                    className={`w-full rounded-lg border ${errors.id_pegawai ? "border-red-500" : "border-gray-300"} p-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                                    aria-invalid={!!errors.id_pegawai}
                                                    aria-describedby={errors.id_pegawai ? "id_pegawai-error" : undefined}
                                                >
                                                    <option value="">Pilih QC</option>
                                                    {pegawai
                                                        .filter((item) => item.id_role === 5)
                                                        .map((item) => (
                                                            <option key={item.id_pegawai} value={item.id_pegawai}>
                                                                {item.nama}
                                                            </option>
                                                        ))}
                                                </select>
                                                {errors.id_pegawai && (
                                                    <p id="id_pegawai-error" className="mt-1 text-sm text-red-500">
                                                        {errors.id_pegawai}
                                                    </p>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <Label htmlFor="id_kategori" className="mb-2 block">
                                            Kategori
                                        </Label>
                                        <select
                                            id="id_kategori"
                                            name="id_kategori"
                                            value={currentItem.id_kategori}
                                            onChange={handleChange}
                                            className={`w-full rounded-lg border ${errors.id_kategori ? "border-red-500" : "border-gray-300"} p-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                            aria-invalid={!!errors.id_kategori}
                                            aria-describedby={errors.id_kategori ? "id_kategori-error" : undefined}
                                        >
                                            <option value="">Pilih Kategori</option>
                                            {kategori.map((item) => (
                                                <option key={item.id_kategori} value={item.id_kategori}>
                                                    {item.nama}
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
                                            value={currentItem.nama}
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
                                            value={currentItem.deskripsi}
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
                                            value={currentItem.berat}
                                            onChange={handleChange}
                                            min={0}
                                            step="any"
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
                                            value={currentItem.harga}
                                            onChange={handleChange}
                                            min={0}
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
                                            checked={currentItem.isGaransi}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="isGaransi" className="mb-0">
                                            Ada Garansi?
                                        </Label>
                                    </div>

                                    {currentItem.isGaransi && (
                                        <div>
                                            <Label htmlFor="akhir_garansi" className="mb-2 block">
                                                Akhir Garansi
                                            </Label>
                                            <TextInput
                                                id="akhir_garansi"
                                                name="akhir_garansi"
                                                type="date"
                                                value={currentItem.akhir_garansi}
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

                                    <div className="flex items-center gap-2">
                                        <input
                                            id="status_perpanjangan"
                                            name="status_perpanjangan"
                                            type="checkbox"
                                            checked={currentItem.status_perpanjangan}
                                            onChange={handleChange}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="status_perpanjangan" className="mb-0">
                                            Status Perpanjangan
                                        </Label>
                                    </div>

                                    <div>
                                        <Label htmlFor="status_barang" className="mb-2 block">
                                            Status Barang
                                        </Label>
                                        <select
                                            id="status_barang"
                                            name="status_barang"
                                            value={currentItem.status_barang}
                                            onChange={handleChange}
                                            className={`w-full rounded-lg border ${errors.status_barang ? "border-red-500" : "border-gray-300"} p-2 focus:outline-none focus:ring-2 focus:ring-green-500`}
                                            aria-invalid={!!errors.status_barang}
                                            aria-describedby={errors.status_barang ? "status_barang-error" : undefined}
                                        >
                                            <option value="">Pilih Status Barang</option>
                                            <option value="tersedia">Tersedia</option>
                                            <option value="diambil">Diambil</option>
                                            <option value="terjual">Terjual</option>
                                            <option value="didonasikan">Didonasikan</option>
                                        </select>
                                        {errors.status_barang && (
                                            <p id="status_barang-error" className="mt-1 text-sm text-red-500">
                                                {errors.status_barang}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="tanggal_ambil" className="mb-2 block">
                                            Tanggal Ambil (opsional)
                                        </Label>
                                        <TextInput
                                            id="tanggal_ambil"
                                            name="tanggal_ambil"
                                            type="date"
                                            value={currentItem.tanggal_ambil}
                                            onChange={handleChange}
                                            color={errors.tanggal_ambil ? "failure" : "gray"}
                                            placeholder="Kosongkan jika tidak ada"
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
                                            Nama Hunter (opsional)
                                        </Label>
                                        <select
                                            id="id_hunter"
                                            name="id_hunter"
                                            value={currentItem.id_hunter}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full text-sm"
                                            aria-invalid={!!errors.foto}
                                            aria-describedby={errors.foto ? "foto-error" : undefined}
                                        />
                                        {errors.foto && (
                                            <p id="foto-error" className="mt-1 text-sm text-red-500">
                                                {errors.foto}
                                            </p>
                                        )}
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
                                        type="button"
                                        className="flex-1 rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                                        onClick={handleAddItem}
                                        disabled={isPending}
                                        aria-label="Add another item"
                                    >
                                        {isPending ? <SyncLoader size={6} color="#fff" /> : "Tambah Barang Lain"}
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 rounded-lg bg-green-600 p-2 text-white hover:bg-green-700 transition-colors disabled:bg-green-300"
                                        onClick={handleProceedToConfirm}
                                        disabled={isPending}
                                        aria-label="Proceed to confirm"
                                    >
                                        {isPending ? <SyncLoader size={6} color="#fff" /> : "Selesai & Konfirmasi"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </ModalBody>
            </Modal>

            <Modal
                show={showConfirmModal}
                size="lg"
                popup
                onClose={() => setShowConfirmModal(false)}
                aria-labelledby="confirm-modal-title"
            >
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <h3 id="confirm-modal-title" className="mb-5 text-lg font-normal text-gray-700 dark:text-gray-300">
                            Konfirmasi Penambahan Penitipan
                        </h3>
                        <div className="mb-4">
                            <p className="text-gray-600">Anda akan menambahkan {items.length} barang dalam satu penitipan:</p>
                            <p className="mt-2 text-gray-600">
                                Penitip : {" "}
                                {(() => {
                                    const p = penitip.find((pt) => pt.id_penitip === Number(items[0]?.id_penitip));
                                    return p ? p.nama : items[0]?.id_penitip || "-";
                                })()}
                                <br />
                                QC : {" "}
                                {(() => {
                                    const q = pegawai.find((pg) => pg.id_pegawai === Number(items[0]?.id_pegawai));
                                    return q ? q.nama : items[0]?.id_pegawai || "-";
                                })()}
                                <br />
                                Tanggal Masuk : {" "}
                                {items[0]?.tanggal_masuk
                                    ? (() => {
                                        const d = new Date(items[0].tanggal_masuk);
                                        const pad = (n: number) => n.toString().padStart(2, "0");
                                        return `${pad(d.getDate())}:${pad(d.getMonth() + 1)}:${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
                                    })()
                                    : "-"}
                            </p>
                            <ul className="list-disc list-inside mt-2 text-left max-h-64 overflow-y-auto">
                                {items.map((item, index) => (
                                    <li key={index} className="text-gray-700">
                                        {item.nama} - Rp{item.harga}
                                    </li>
                                ))}
                            </ul>
                        </div>
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
                                {isPending ? <SyncLoader size={6} color="#fff" /> : "Konfirmasi Simpan"}
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ModalAddPenitipan;