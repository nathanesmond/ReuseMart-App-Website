import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { deleteRequestDonasi } from "../../api/ApiOrganisasi";
import { toast } from "react-toastify";
import RequestDonasi from "./RequestDonasi";

interface ModalDeleteRequestDonasiProps {
    onClose: () => void;
    idRequest: number;
    show: boolean;
    onSuccessDelete: () => void;
}

const ModalDeleteRequestDonasi = ({
    onClose,
    idRequest,
    show,
    onSuccessDelete
}: ModalDeleteRequestDonasiProps) => {
    const handleClose = () => onClose();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        deleteRequestDonasi(idRequest)

            .then((res) => {
                console.log("Deleting request with ID:", idRequest);

                toast.success("Request deleted successfully!");
                onSuccessDelete();
                handleClose();
            })
            .catch((err) => {
                console.log("Deleting request with ID:", idRequest);

                toast.error("Failed to delete request.");
                console.error(err);
            });
    };

    return (
        <Modal show={show} size="md" onClose={handleClose} popup>
            <ModalHeader />
            <ModalBody>
                <div className="text-center">
                    <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400" />
                    <h3 className="mb-5 text-lg font-normal text-gray-500">
                        Are you sure you want to delete this donation request?
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center gap-4">
                            <Button type="submit" color="failure" className="bg-red-600 hover:bg-red-700 text-white">
                                Yes, I'm sure
                            </Button>
                            <Button onClick={handleClose} className="bg-[#1F510F] hover:bg-[#1B480D] text-white">
                                No, cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ModalDeleteRequestDonasi;
