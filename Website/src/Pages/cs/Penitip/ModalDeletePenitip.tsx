import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { DeleteOrganisasi, DeletePenitip } from "../../../api/ApiAdmin";
import { toast } from "react-toastify";

interface ModalDeletePenitipProps {
    onClose: () => void;
    idPenitip: number;
    show: boolean;
    onSuccessDelete: () => void;
}
const ModalDeletePenitip = ({
    onClose,
    idPenitip,
    show,
    onSuccessDelete
}: ModalDeletePenitipProps) => {
    const handleClose = () => {
        onClose();
    };

    const submitData = (event: any, idPenitip: number) => {
        event.preventDefault();
        DeletePenitip(idPenitip)
            .then((response) => {
                handleClose();
                toast.success(response.message);
                onSuccessDelete();
            })
            .catch((err) => {
                console.log(err);
                toast.dark(err.message);
            });
    };
    return (
        <>
            <Modal show={show} size="md" onClose={handleClose} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to delete this Penitip?
                        </h3>
                        <form onSubmit={(e) => submitData(e, idPenitip)}>
                            <div className="flex justify-center gap-4">
                                <Button color="failure" type="submit" className="bg-red-600 cursor-pointer text-white hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                    {"Yes, I'm sure"}
                                </Button>
                                <Button onClick={handleClose} className="bg-[#1F510F] hover:bg-[#1B480D] ">
                                    No, cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ModalDeletePenitip;
