import { useState } from "react";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Label, Modal, ModalBody, ModalHeader, Select } from "flowbite-react";
import { fetchPenukaranPoin, updatePenukaranPoin } from "../../../api/ApiMerchandise";

interface ModalEditConfirmationMerchandiseProps {
    dataPenukaranPoin: {
        id_penukaranpoin: number;
        status_verifikasi: string;
        tanggal_ambil: string;
    };
    onClose: () => void;
    idPenukaranPoin: number;
    show: boolean;
    onSuccessEdit: () => void;
}

const ModalEditConfirmationMerchandise = ({
    dataPenukaranPoin,
    onClose,
    idPenukaranPoin,
    show,
    onSuccessEdit,
}: ModalEditConfirmationMerchandiseProps) => {
    const [data, setData] = useState({
        status_verifikasi: dataPenukaranPoin.status_verifikasi || "",
        tanggal_ambil: dataPenukaranPoin.tanggal_ambil || "",
    });
    const [isPending, setIsPending] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleClose = () => {
        setShowConfirmModal(false);
        fetchPenukaranPoin
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const handleEditSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (data.status_verifikasi === "Pending") {
            toast.error("Status Verifikasi harus dipilih.");
            return;
        }
        if (data.status_verifikasi === "Declined" && data.tanggal_ambil) {
            toast.error("Tanggal Ambil tidak boleh ada jika status verifikasi adalah Declined.");
            return;
        }
        if (data.tanggal_ambil) {
            const tanggalAmbil = new Date(data.tanggal_ambil);
            const today = new Date();
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 1);

            tanggalAmbil.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);
            yesterday.setHours(0, 0, 0, 0);

            if (
                tanggalAmbil.getTime() !== today.getTime() &&
                tanggalAmbil.getTime() !== yesterday.getTime()
            ) {
                toast.error("Tanggal Ambil harus hari ini atau kemarin.");
                return;
            }
        }
        setShowConfirmModal(true);
    };

    const handleConfirmSubmit = async () => {
        setIsPending(true);
        try {
            const formData = new FormData();
            formData.append("status_verifikasi", data.status_verifikasi);
            formData.append("tanggal_ambil", data.tanggal_ambil);

            console.log("Sending update request:", {
                id: idPenukaranPoin,
                status_verifikasi: data.status_verifikasi,
                tanggal_ambil: data.tanggal_ambil,
            }); 
            await updatePenukaranPoin(idPenukaranPoin, formData );
            setIsPending(false);
            toast.success("Penukaran poin updated successfully!");
            onSuccessEdit();
            handleClose();
        } catch (err: any) {
            setIsPending(false);
            console.error("Error updating penukaran poin:", err);
            if (err.response && err.response.status === 422) {
                const errors = err.response.data.errors;
                if (errors) {
                    Object.keys(errors).forEach((field) => {
                        errors[field].forEach((msg: string) => {
                            toast.error(msg);
                        });
                    });
                } else {
                    toast.error("Validation failed. Please check your input.");
                }
            } else {
                toast.error(err.response?.data?.message || "Something went wrong.");
            }
        }
    };

    return (
        <>
            <Modal show={show} dismissible size="md" popup onClose={handleClose}>
                <ModalHeader />
                <ModalBody>
                    <form onSubmit={handleEditSubmit}>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Edit Penukaran Poin
                            </h3>
                            <div>
                                {data.status_verifikasi === "Pending" && (
                                <><div className="mb-2 block">
                                        <Label htmlFor="status_verifikasi">Status Verifikasi</Label>
                                    </div><Select
                                        id="status_verifikasi"
                                        name="status_verifikasi"
                                        value={data.status_verifikasi}
                                        onChange={handleChange}
                                    >
                                            <option value="Pending">Pilih satu</option>
                                            <option value="Approved">Approved</option>
                                            <option value="Declined">Declined</option>
                                        </Select></>
                                )}
                            </div>
                            <div>
                                {data.status_verifikasi === "Approved" && (
                                <>
                                <div className="mb-2 block">
                                    <Label htmlFor="tanggal_ambil">Tanggal Ambil</Label>
                                </div>
                                <input
                                    id="tanggal_ambil"
                                    name="tanggal_ambil"
                                    type="date"
                                    value={data.tanggal_ambil}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded px-2 py-1"
                                /></>
                                )}
                            </div>
                            <div className="w-full rounded-2xl bg-[#1F510F] p-2 text-center text-white cursor-pointer">
                                <button type="submit" className="w-full cursor-pointer">
                                    {isPending ? (
                                        <SyncLoader color="#F5CB58" size={10} />
                                    ) : (
                                        <strong>Save</strong>
                                    )}
                                </button>
                            </div>
                            <div
                                className="w-full rounded-2xl bg-[#B33739] p-2 text-center text-white cursor-pointer"
                                onClick={handleClose}
                            >
                                <button className="w-full cursor-pointer">
                                    <strong>Cancel</strong>
                                </button>
                            </div>
                        </div>
                    </form>
                </ModalBody>
            </Modal>

            <Modal show={showConfirmModal} dismissible size="md" popup onClose={handleClose}>
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Confirm Changes
                        </h3>
                        <p>
                            Are you sure you want to update?
                        </p>
                        <div className="w-full rounded-2xl bg-[#1F510F] p-2 text-center text-white cursor-pointer">
                            <button
                                onClick={handleConfirmSubmit}
                                className="w-full cursor-pointer"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <SyncLoader color="#F5CB58" size={10} />
                                ) : (
                                    <strong>Confirm</strong>
                                )}
                            </button>
                        </div>
                        <div
                            className="w-full rounded-2xl bg-[#B33739] p-2 text-center text-white cursor-pointer"
                            onClick={handleClose}
                        >
                            <button className="w-full cursor-pointer">
                                <strong>Cancel</strong>
                            </button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ModalEditConfirmationMerchandise;