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

import { updateDetailDonasi } from "../../../api/ApiOwner";
import { fetchRequestDonasi, fetchDetailDonasi } from "../../../api/ApiOwner";

interface ModalEditDonasiProps {
	dataDetailDonasi: {
		id_detaildonasi: number;
        id_request: number;
        id_pegawai: number;
        id_barang: number;
        tanggal_donasi: Date;
        nama_penerima: string;
	};
	onClose: () => void;
	id_detaildonasi: number;
	show: boolean;
	onSuccessEdit: () => void;
}

const ModalEditDonasi = ({
	dataDetailDonasi,
	onClose,
	id_detaildonasi,
	show,
	onSuccessEdit,
}: ModalEditDonasiProps) => {
	const [data, setData] = useState(dataDetailDonasi);
	const [isPending, setIsPending] = useState(false);

	const handleClose = () => {
		onClose();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setData({ ...data, [name]: value });
	};

	const submitData = (event: any, id_detaildonasi: number) => {
		event.preventDefault();
		setIsPending(true);

		const formData = new FormData();
        formData.append("tanggal_donasi", data.tanggal_donasi.toString());
        formData.append("nama_penerima", data.nama_penerima.toString());

		updateDetailDonasi(formData, id_detaildonasi)
			.then((response) => {
				setIsPending(false);
				toast.success(response.message);
				onSuccessEdit();
				
				handleClose();
			})
			.catch((err) => {
				console.log(err);
				setIsPending(false);
				toast.dark(err.message);
			});
	};

	return (
		<>
			<Modal show={show} dismissible size="md" popup onClose={handleClose}>
				<ModalHeader />
				<ModalBody>
					<form action="submit" onSubmit={(e) => submitData(e, id_detaildonasi)}>
						<div className="space-y-6">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								Edit Donation
							</h3>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama">Edit Donation Date</Label>
								</div>
								<TextInput
									id="tanggal_donasi"
									name="tanggal_donasi"
									value={
										data.tanggal_donasi instanceof Date
											? data.tanggal_donasi.toISOString().split("T")[0]
											: data.tanggal_donasi
									}
									type="date"
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama_penerima">Edit recipient</Label>
								</div>
								<TextInput
									id="nama_penerima"
									name="nama_penerima"
									type="text"
									value={data.nama_penerima}
									onChange={handleChange}
									required
								/>
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

							<div className="w-full rounded-2xl bg-[#1F510F] p-2 text-center text-white cursor-pointer">
								<button type="submit" className="w-full cursor-pointer">
									{isPending ? (
										<SyncLoader color="#F5CB58" size={10} />
									) : (
										<strong>Edit</strong>
									)}
								</button>
							</div>
						</div>
					</form>
				</ModalBody>
			</Modal>
		</>
	);
};

export default ModalEditDonasi;
