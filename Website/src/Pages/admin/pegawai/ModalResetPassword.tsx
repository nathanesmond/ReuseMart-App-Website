import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { ResetPassword } from "../../../api/ApiAdmin";
import { toast } from "react-toastify";

interface ModalResetPegawaiProps {
	onClose: () => void;
	idPegawai: number;
	show: boolean;
    onSuccessDelete: () => void;
}
const ModalResetPegawai = ({
	onClose,
	idPegawai,
	show,
    onSuccessDelete
}: ModalResetPegawaiProps) => {
	const handleClose = () => {
		onClose();
	};
	const reset = (idPegawai: number) => {
		
		ResetPassword(idPegawai)
            .then((response) => {
                toast.success("Password reset successfully");
                onSuccessDelete();
                handleClose();
            })
            .catch((err) => {
                toast.error(err.response);
            });
	};
	return (
		<>
			<Modal show={show} size="md" onClose={handleClose} popup dismissible>
				<ModalHeader />
				<ModalBody>
					<div className="text-center">
						<HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
						<h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
							Are you sure you want to reset this employee password?
						</h3>
						
							<div className="flex justify-center gap-4">
								<Button  onClick={() => reset(idPegawai)} color="failure" type="submit" className= "bg-red-600 cursor-pointer text-white hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
									{"Yes, I'm sure"}
								</Button>
								<Button  onClick= {handleClose}className="bg-[#1F510F] hover:bg-[#1B480D] ">
									No, cancel
								</Button>
							</div>
						
					</div>
				</ModalBody>
			</Modal>
		</>
	);
};

export default ModalResetPegawai;
