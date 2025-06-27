import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import {
	Label,
	Modal,
	ModalBody,
	ModalHeader,
	TextInput,
} from "flowbite-react";

import { UpdatePegawai } from "../../../api/ApiAdmin";

interface ModalEditPegawaiProps {
	dataPegawai: {
		id_pegawai: number;
		id_role: number;
		nama: string;
		email: string;
		password: string;
		tanggal_masuk: Date;
		tanggal_lahir: Date;
		wallet: number;
	};
	onClose: () => void;
	idPegawai: number;
	show: boolean;
	onSuccessEdit: () => void;
}

const ModalEditPegawai = ({
	dataPegawai,
	onClose,
	idPegawai,
	show,
	onSuccessEdit,
}: ModalEditPegawaiProps) => {
	const [data, setData] = useState({
		...dataPegawai,
		password: "",
		wallet: dataPegawai.wallet ?? 0,
		tanggal_masuk: new Date(dataPegawai.tanggal_masuk),
		tanggal_lahir: new Date(dataPegawai.tanggal_lahir),
	});
	useState(dataPegawai);
	const [isPending, setIsPending] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const handleClose = () => {
		onClose();
	};

	const cekInput = () => {
		const currentDate = new Date();
		const c = currentDate.toISOString().split("T")[0];
		if (data.id_role === 0) {
			toast.error("Role is required");
			return false;
		}
		if (
			data.password &&
			data.password.trim() !== "" &&
			data.password.length < 8
		) {
			toast.error("Password must be at least 8 characters long");
			return false;
		}
		if (data.tanggal_masuk.toISOString().split("T")[0] > c) {
			toast.error("Hire date is required and must be in the past");
			return false;
		}
		if (data.tanggal_lahir.toISOString().split("T")[0] > c) {
			toast.error("Born date is required and must be in the past");
			return false;
		}

		return true;
	};

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;

		if (name === "wallet" || name === "id_role") {
			setData({ ...data, [name]: Number(value) });
		} else if (name === "tanggal_masuk" || name === "tanggal_lahir") {
			setData({ ...data, [name]: new Date(value) });
		} else {
			setData({ ...data, [name]: value });
		}
	};

	const submitData = (event: any, idPegawai: number) => {
		event.preventDefault();
		setIsPending(true);
		if (!cekInput()) {
			setIsPending(false);
			return;
		}

		const formData = new FormData();
		formData.append("id_role", data.id_role.toString());
		formData.append("nama", data.nama);
		formData.append("email", data.email);
		if (
			data.password &&
			data.password.trim() !== "" &&
			data.password.length >= 8
		) {
			formData.append("password", data.password);
		}
		formData.append(
			"tanggal_masuk",
			new Date(data.tanggal_masuk).toISOString().split("T")[0]
		);
		formData.append(
			"tanggal_lahir",
			new Date(data.tanggal_lahir).toISOString().split("T")[0]
		);
		formData.append("wallet", data.wallet.toString());

		UpdatePegawai(formData, idPegawai)
			.then((response) => {
				setIsPending(false);
				toast.success(response.message);
				onSuccessEdit();

				handleClose();
			})
			.catch((err) => {
				console.log(err);
				setIsPending(false);
				const currentDate = new Date();
				const c = currentDate.toISOString().split("T")[0];
				if (data.id_role === 0) {
					toast.error("Role is required");
					return false;
				} else if (data.nama === "") {
					toast.error("Name is required");
					return false;
				} else if (data.password.length < 8) {
					toast.error(
						"Password is required and must be at least 8 characters long"
					);
					return false;
				} else if (
					data.tanggal_lahir.toISOString().split("T")[0] > c ||
					data.tanggal_lahir.toISOString().split("T")[0] == c
				) {
					toast.error("Born date is required and must be in the past");
					return false;
				} else if (
					data.tanggal_masuk.toISOString().split("T")[0] <
					data.tanggal_lahir.toISOString().split("T")[0]
				) {
					toast.error("Born date must be less than hire date");
					return false;
				} else {
					toast.error(err.message);
				}
			});
	};

	return (
		<>
			<Modal show={show} dismissible size="md" popup onClose={handleClose} >
				<ModalHeader />
				<ModalBody>
					<form action="submit" onSubmit={(e) => submitData(e, idPegawai)}>
						<div className="space-y-6">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								Edit Employee
							</h3>
							<div className="mb-2 block">
								<Label htmlFor="id_role">Edit Role</Label>
							</div>
							<div className="flex items-center justify-between gap-1">
								<div
									onClick={() => setData({ ...data, id_role: 2 })}
									className={`px-4 py-2 rounded ${
										data.id_role === 2
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-black"
									}`}
								>
									Owner
								</div>
								<div
									onClick={() => setData({ ...data, id_role: 3 })}
									className={`px-4 py-2 rounded ${
										data.id_role === 3
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-black"
									}`}
								>
									Kurir
								</div>
								<div
									onClick={() => setData({ ...data, id_role: 4 })}
									className={`px-4 py-2 rounded ${
										data.id_role === 4
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-black"
									}`}
								>
									Hunter
								</div>
								<div
									onClick={() => setData({ ...data, id_role: 5 })}
									className={`px-4 py-2 rounded ${
										data.id_role === 5
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-black"
									}`}
								>
									Gudang
								</div>
								<div
									onClick={() => setData({ ...data, id_role: 6 })}
									className={`px-4 py-2 rounded ${
										data.id_role === 6
											? "bg-blue-500 text-white"
											: "bg-gray-200 text-black"
									}`}
								>
									CS
								</div>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama">Edit employee name</Label>
								</div>
								<TextInput
									id="nama"
									name="nama"
									value={data.nama}
									placeholder="name"
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="email">Edit email</Label>
								</div>
								<TextInput
									id="email"
									name="email"
									type="email"
									value={data.email}
									onChange={handleChange}
									required
								/>
							</div>

							<div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password">Edit password</Label>
                                </div>
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        onChange={handleChange}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </button>
                                </div>
                            </div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="tanggal_masuk">Edit hire_date</Label>
								</div>
								<TextInput
									id="tanggal_masuk"
									name="tanggal_masuk"
									type="date"
									value={
										data.tanggal_masuk
											? data.tanggal_masuk.toISOString().split("T")[0]
											: ""
									}
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="tanggal_lahir">Edit born_date</Label>
								</div>
								<TextInput
									id="tanggal_lahir"
									name="tanggal_lahir"
									type="date"
									value={
										data.tanggal_lahir
											? data.tanggal_lahir.toISOString().split("T")[0]
											: ""
									}
									onChange={handleChange}
									required
								/>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="wallet">Edit Wallet</Label>
								</div>
								<TextInput
									id="wallet"
									name="wallet"
									type="number"
									value={data.wallet ?? 0}
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

export default ModalEditPegawai;
