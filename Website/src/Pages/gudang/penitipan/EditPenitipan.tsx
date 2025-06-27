import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { fetchPegawai, fetchPenitip, updateOnlyPenitipan } from "../../../api/ApiPenitipan";

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

interface EditPenitipanProps {
    dataPenitipan: {
        id_penitipan: number;
        id_pegawai: number;
        tanggal_masuk: Date | string;
        id_penitip: number;
    };
    onClose: () => void;
    id_penitipan: number;
    id_pegawai: number;
    show: boolean;
    onSuccessEdit: () => void;
}

interface FormErrors {
    id_penitip?: string;
    id_pegawai?: string;
    tanggal_masuk?: string;
}

const EditPenitipan = ({ dataPenitipan, onClose, show, onSuccessEdit }: EditPenitipanProps) => {
    const [data, setData] = useState(dataPenitipan);
    const [isPending, setIsPending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pegawai, setPegawai] = useState<Pegawai[]>([]);
    const [penitip, setPenitip] = useState<Penitip[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [penitipRes, pegawaiRes] = await Promise.all([fetchPenitip(), fetchPegawai()]);
            setPenitip(penitipRes.penitip);
            setPegawai(pegawaiRes.data);
        } catch (err) {
            console.error(err);
            toast.error("Gagal memuat data penitip atau pegawai");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};
        if (!data.id_penitip) newErrors.id_penitip = "Nama penitip wajib dipilih";
        if (!data.id_pegawai) newErrors.id_pegawai = "Nama QC wajib dipilih";
        if (!data.tanggal_masuk) newErrors.tanggal_masuk = "Tanggal masuk wajib diisi";
        else if (isNaN(new Date(data.tanggal_masuk).getTime()))
            newErrors.tanggal_masuk = "Tanggal masuk tidak valid";
        return newErrors;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
        setErrors({ ...errors, [name]: undefined }); 
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error("Harap isi semua kolom dengan benar");
            return;
        }
        setShowConfirmModal(true);
    };

    const submitData = async () => {
        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append("id_pegawai", data.id_pegawai.toString());
            formData.append("id_penitip", data.id_penitip.toString());
            formData.append(
                "tanggal_masuk",
                new Date(data.tanggal_masuk).toISOString()
            );

            const response = await updateOnlyPenitipan(formData, data.id_penitipan);
            toast.success(response.message || "Data penitipan berhasil diperbarui", {
                position: "top-right",
                autoClose: 3000,
            });
            onSuccessEdit();
            handleClose();
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Gagal memperbarui data penitipan", {
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

    return (
        <>
            <Modal show={show} dismissible size="md" popup onClose={handleClose} aria-labelledby="edit-penitipan-title">
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
                                <h3 id="edit-penitipan-title" className="text-xl font-medium text-gray-900 dark:text-white">
                                    Edit Penitipan
                                </h3>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <Label htmlFor="id_penitip" className="mb-2 block">
                                            Nama Penitip
                                        </Label>
                                        <select
                                            id="id_penitip"
                                            name="id_penitip"
                                            value={data.id_penitip || ""}
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
                                                data.tanggal_masuk && !isNaN(new Date(data.tanggal_masuk).getTime())
                                                    ? (() => {
                                                        const d = new Date(data.tanggal_masuk);
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
                                            value={data.id_pegawai || ""}
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
                                </div>

                                <div className="flex gap-4 mt-6">
                                    <button
                                        type="button"
                                        className="flex-1 rounded-lg bg-gray-400 p-2 text-white hover:bg-gray-500 transition-colors"
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
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

export default EditPenitipan;