import { useState } from "react";

import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import {
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	TextInput,
	FileInput,
} from "flowbite-react";

import { UpdateOrganisasi } from "../../../../api/ApiAdmin";
import { UpdateAlamat } from "../../../../api/ApiAlamat";

interface ModalEditAlamatProps {
	dataAlamat: {
		id_alamat: number;
        nama_alamat: string;
		nama_jalan: string;
		nama_kota: string;
		kode_pos: number;
	};
	onClose: () => void;
	idAlamat: number;
	show: boolean;
	onSuccessEdit: () => void;
}

const ModalEditAlamat = ({
	dataAlamat,
	onClose,
	idAlamat,
	show,
	onSuccessEdit,
}: ModalEditAlamatProps) => {
	const [data, setData] = useState(dataAlamat);
	const [isPending, setIsPending] = useState(false);
	
	const handleClose = () => {
		onClose();
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setData({ ...data, [event.target.name]: event.target.value });
	};

	const submitData = (event: any, idAlamat: number) => {
		event.preventDefault();
		setIsPending(true);

		UpdateAlamat(data, idAlamat)
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
					<form action="submit" onSubmit={(e) => submitData(e, idAlamat)}>
						<div className="space-y-6">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								Edit Address
							</h3>
							

							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama">Edit Address Name</Label>
								</div>
								<TextInput
									id="nama_alamat"
									name="nama_alamat"
									value={data.nama_alamat}
									placeholder=""
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama_alamat">Edit address</Label>
								</div>
								<TextInput
									id="nama_jalan"
									name="nama_jalan"
									type="text"
									value={data.nama_jalan}
									onChange={handleChange}
									required
								/>
							</div>

							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama_kota">Edit City Name</Label>
								</div>
								<TextInput
									id="nama_kota"
									name="nama_kota"
									type="text"
									value={data.nama_kota}
									onChange={handleChange}
									required
								/>
							</div>
                            <div>
								<div className="mb-2 block">
									<Label htmlFor="kode_pos">Edit Zip Code</Label>
								</div>
								<TextInput
									id="kode_pos"
									name="kode_pos"
									type="text"
									value={data.kode_pos}
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

export default ModalEditAlamat;
