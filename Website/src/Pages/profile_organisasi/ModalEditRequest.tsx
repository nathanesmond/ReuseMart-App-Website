import { useState } from "react";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import {
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
} from "flowbite-react";

import { updateRequestDonasi } from "../../api/ApiOrganisasi";
import RequestDonasi from "./RequestDonasi";

type ModalEditRequestDonasiProps = {
    show: boolean;
    dataOrganisasi: RequestDonasi;
    idRequest: number;
    onClose: () => void;
    onSuccessEdit: () => void;
};

const ModalEditRequestDonasi = ({
    dataOrganisasi,
    onClose,
    show,
    onSuccessEdit,
}: ModalEditRequestDonasiProps) => {
    const [deskripsi, setDeskripsi] = useState(dataOrganisasi.deskripsi);
    const [isPending, setIsPending] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsPending(true);

        try {
            const payload = { deskripsi };
            const response = await updateRequestDonasi(dataOrganisasi.id_request, payload);

            toast.success(response.message || "Request updated successfully");
            onSuccessEdit();
            handleClose();
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || "Failed to update request");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <Modal show={show} dismissible size="md" popup onClose={handleClose}>
            <ModalHeader />
            <ModalBody>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Edit Request Donasi
                        </h3>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                            </div>
                            <TextInput
                                id="deskripsi"
                                name="deskripsi"
                                value={deskripsi}
                                onChange={(e) => setDeskripsi(e.target.value)}
                                required
                            />
                        </div>


                        <div className="w-full rounded-2xl bg-green-700 p-2 text-center text-white cursor-pointer">
                            <button type="submit" className="w-full">
                                {isPending ? (
                                    <SyncLoader color="#F5CB58" size={10} />
                                ) : (
                                    <strong>Edit</strong>
                                )}
                            </button>
                        </div>
                        <div
                            className="w-full rounded-2xl bg-[#B33739] p-2 text-center text-white cursor-pointer"
                            onClick={handleClose}
                        >
                            <button className="w-full cursor-pointer">
                                {" "}
                                <strong>Cancel</strong>
                            </button>
                        </div>

                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default ModalEditRequestDonasi;
