import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { DeleteOrganisasi, DeletePenitip } from "../../../api/ApiAdmin";
import { toast } from "react-toastify";
import { DeclinePayment } from "../../../api/ApiTransaksiPembelian";

interface ModalDeclinePaymentProps {
    onClose: () => void;
    nomor_nota: string;
    show: boolean;
    onSuccessDecline: () => void;
}
const ModalDeclinePayment = ({
    onClose,
    nomor_nota,
    show,
    onSuccessDecline
}: ModalDeclinePaymentProps) => {
    const handleClose = () => {
        onClose();
    };

    const submitData = (nomor_nota: string) => {
        DeclinePayment(nomor_nota)
            .then((response) => {
                toast.success(response.message);
                onSuccessDecline();
                handleClose();
            
            })
            .catch((err) => {
                console.log(err);
                toast.dark(err.message);
            });

    };
    return (
        <>
            <Modal show={show} size="md" onClose={handleClose} dismissible popup>
                <ModalHeader />
                <ModalBody>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
                        <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                            Are you sure you want to decline this Payment?
                        </h3>
                    
                            <div className="flex justify-center gap-4">
                                <Button onClick={() => submitData(nomor_nota)}color="failure" type="submit" className="bg-green-600 cursor-pointer text-white hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                    {"Yes, I'm sure"}
                                </Button>
                                <Button onClick={handleClose} className="bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                    No, cancel
                                </Button>
                            </div>
                        
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ModalDeclinePayment;
