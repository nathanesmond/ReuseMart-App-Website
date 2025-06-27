import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Frieren from "../../../assets/images/Frieren.jpg";
import { useNavigate } from "react-router-dom";
import { FetchAlamat } from "../../../api/ApiAlamat";
import { AddAlamat } from "../../../api/ApiAlamat";
import { faSearch, faHouse } from "@fortawesome/free-solid-svg-icons";
import { IoPersonCircleOutline } from "react-icons/io5";
import { MdChevronLeft, MdChevronRight, MdDelete } from "react-icons/md";
import { PiTarget } from "react-icons/pi";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import ModalEditAlamat from "./ModalAlamat/ModalEditAlamat";
import ModalDeleteAlamat from "./ModalAlamat/ModalDeleteAlamat";
import { SetUtama } from "../../../api/ApiAlamat";
import { Link } from "react-router-dom";

type Alamat = {
	id_alamat: number;
	nama_jalan: string;
	nama_alamat: string;
	nama_kota: string;
	kode_pos: number;
	isUtama: boolean;
};

type AlamatForm = {
	nama_jalan: string;
	nama_alamat: string;
	nama_kota: string;
	kode_pos: number;
};

const TABLE_HEAD = ["Name", "Street", "City", "Zipcode", "Action"];

const Edit_profile = () => {
	const [data, setData] = useState<Alamat[]>([]);

	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingAddAddress, setIsLoadingAddAddress] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataPerPage, setDataPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [loadingSetUtamaId, setLoadingSetUtamaId] = useState<number | null>(
		null
	);

	const [showModal, setShowModal] = useState(false);
	const [selectedAlamat, setSelectedAlamat] = useState<Alamat | null>(null);
	const [showModalDelete, setShowModalDelete] = useState(false);

	const handleEditClick = (data: Alamat) => {
		setSelectedAlamat(data);
		setShowModal(true);
	};

	const handleDeleteClick = (data: Alamat) => {
		setSelectedAlamat(data);
		setShowModalDelete(true);
	};

	const [formData, setFormData] = useState<AlamatForm>({
		nama_jalan: "",
		nama_kota: "",
		nama_alamat: "",
		kode_pos: 0,
	});

	const handleChange = (event: any) => {
		setFormData({ ...formData, [event.target.name]: event.target.value });
	};
	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};
	const SetAlamatUtama = (id: number) => {
		setLoadingSetUtamaId(id);
		SetUtama(id)
			.then((response) => {
				toast.success(response.message);
				fetchAlamat();
			})
			.catch((error: any) => {
				toast.error(error.message);
				console.error("Error setting address:", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	const addAddress = (event: any) => {
		event.preventDefault();
		setIsLoadingAddAddress(true);
		AddAlamat(formData)
			.then((response) => {
				toast.success(response.message);
				fetchAlamat();
				setFormData({
					nama_jalan: "",
					nama_kota: "",
					nama_alamat: "",
					kode_pos: 0,
				});
			})
			.catch((error: any) => {
				toast.success(error.message);
				console.error("Error adding address:", error);
			})
			.finally(() => {
				setIsLoadingAddAddress(false);
			});
	};

	const fetchAlamat = () => {
		setIsLoading(true);
		FetchAlamat()
			.then((response) => {
				setData(response.alamat);
			})
			.catch((error: any) => {
				console.error("Error fetching address:", error);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	useEffect(() => {
		fetchAlamat();
	}, []);


	const filteredData = data.filter(
		(alamat) =>
			alamat.nama_jalan.toLowerCase().includes(searchTerm.toLowerCase()) ||
			alamat.nama_kota.toLowerCase().includes(searchTerm.toLowerCase()) ||
			alamat.kode_pos
				.toLocaleString()
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			alamat.nama_alamat.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const indexOfLastData = currentPage * dataPerPage;
	const indexOfFirstData = indexOfLastData - dataPerPage;
	const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
	const totalPages = Math.ceil(filteredData.length / dataPerPage);

	return (
		<>
			<div className="h-full px-10 py-5">
				<div className="mt-5 max-sm:mt-0">
					<ol className="inline-flex items-center space-x-1 md:space-x-3">
						<li className="inline-flex items-center">
							<a
								href="/"
								className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-300"
							>
								<FontAwesomeIcon
									className="text-gray-500 text-sm"
									icon={faHouse}
								/>
							</a>
						</li>
						<li>
							<div className="flex items-center">
								<svg
									className="w-6 h-6 text-gray-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
										clip-rule="evenodd"
									></path>
								</svg>
								<Link
									to="/profile"
									className="ml-1 text-sm font-medium text-gray-500 md:ml-2"
								>
									Account
								</Link>
							</div>
						</li>
						<li>
							<div className="flex items-center">
								<svg
									className="w-6 h-6 text-gray-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fill-rule="evenodd"
										d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
										clip-rule="evenodd"
									></path>
								</svg>
								<span className="ml-1 text-sm font-medium text-[#00B207] md:ml-2">
									Profile
								</span>
							</div>
						</li>
					</ol>
				</div>
				<div className="w-full bg-white  border-1 py-1  border-gray-300 text-start gap-y-4 mt-10">
					<div className="">
						<div className="border-b-1 border-gray-300 w-full">
							<p className=" p-2 px-4">
								<strong>ACCOUNT SETTINGS</strong>
							</p>
						</div>
						<div className="flex flex-row flex-initial justify-between">
							<div className="flex flex-col flex-1/3 gap-2 p-4">
								<label htmlFor="first-name">
									<strong>First Name</strong>
								</label>
								<input
									type="text"
									id="first-name"
									className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
								/>

								<label htmlFor="last-name">
									<strong>Last Name</strong>
								</label>
								<div className="relative">
									<input
										type="text"
										id="last-name"
										className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
										placeholder=""
									/>
								</div>

								<label htmlFor="email">
									<strong>Email</strong>
								</label>
								<div className="relative">
									<input
										type="text"
										id="email"
										className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
										placeholder=""
									/>
								</div>

								<button className="bg-[#1F510F] text-white p-3 mt-4 w-1/6 rounded-3xl">
									<strong>Save Changes</strong>
								</button>
							</div>
							<div className="flex flex-col items-center justify-center  align-middle p-15">
								<img src={Frieren} alt="" className="h-50 w-50 rounded-full" />
								<div className="text-center mt-4">
									<label
										htmlFor="upload-image"
										className="cursor-pointer text-[#00B207] border-4 border-[#00B207] p-3 inline-block rounded-lg"
									>
										<strong>Choose Image</strong>
									</label>
									<input
										id="upload-image"
										type="file"
										className="hidden"
										onChange={(e) => {}}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="w-full bg-white  border-1 py-1  border-gray-300 text-start gap-y-4 mt-10">
					<div className="">
						<div className="border-b-1 border-gray-300 w-full">
							<p className=" p-2 px-4">
								<strong>ADD ADDRESS</strong>
							</p>
						</div>
						<form onSubmit={addAddress}>
							<div className="flex flex-row flex-initial justify-between">
								<div className="flex flex-col flex-1/3 gap-2 p-4">
									<label htmlFor="nama_alamat">
										<strong>Address Name</strong>
									</label>
									<input
										type="text"
										id="nama_alamat"
										name="nama_alamat"
										className="border-1 border-gray-300 rounded-lg p-2 w-1/2 pr-10"
										onChange={handleChange}
										value={formData.nama_alamat}
									/>
									<div className="flex flex-row gap-2 justify-between max-w-3/4">
										<div>
											<label htmlFor="nama_kota">
												<strong>City</strong>
											</label>

											<input
												type="text"
												id="nama_kota"
												name="nama_kota"
												className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
												placeholder=""
												onChange={handleChange}
												value={formData.nama_kota}
											/>
										</div>

										<div>
											<label htmlFor="nama_jalan">
												<strong>Street</strong>
											</label>

											<input
												type="text"
												id="nama_jalan"
												name="nama_jalan"
												className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
												placeholder=""
												onChange={handleChange}
												value={formData.nama_jalan}
											/>
										</div>

										<div>
											<label htmlFor="kode_pos">
												<strong>Zipcode</strong>
											</label>

											<input
												type="text"
												id="kode_pos"
												name="kode_pos"
												className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
												placeholder=""
												onChange={handleChange}
												value={formData.kode_pos}
											/>
										</div>
									</div>

									<button
										className="bg-[#1F510F] text-white p-3 mt-4 w-1/6 rounded-3xl cursor-pointer"
										type="submit"
										onClick={addAddress}
									>
										{isLoadingAddAddress ? (
											<SyncLoader color="#ffffff" size={10} />
										) : (
											<strong>Add Address</strong>
										)}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div className="bg-white w-full lg:w-full border border-gray-300 text-start gap-y-4 shadow-md mt-5">
					<div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
						<p>
							<strong>ADDRESS</strong>
						</p>
						<div className="relative w-full sm:w-1/2">
							<FontAwesomeIcon
								icon={faSearch}
								className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
							/>
							<input
								type="text"
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value);
									setCurrentPage(1);
								}}
								className="w-full h-10 bg-[#F0F0F0] rounded-4xl pl-10 pr-4 py-2 focus:outline-none"
								placeholder="Search..."
							/>
						</div>
					</div>

					<div className="overflow-x-auto">
						<table className="w-full min-w-max table-auto text-left">
							<thead className="bg-[#2A3042] text-white text-center">
								<tr>
									{TABLE_HEAD.map((head) => (
										<th
											key={head}
											className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
										>
											<p className="font-normal leading-none opacity-70">
												<strong>{head}</strong>
											</p>
										</th>
									))}
								</tr>
							</thead>
							<tbody className="text-center border">
								{currentData.map((alamat: any, index) => {
									const isLast = index === currentData.length;
									const classes = isLast
										? "p-4"
										: "p-4 border-b border-blue-gray-50";
									return (
										<tr key={alamat.id_alamat}>
											<td className={classes}>
												<p className="font-normal">{alamat.nama_alamat}</p>
											</td>
											<td className={classes}>
												<p className="font-normal">{alamat.nama_jalan}</p>
											</td>
											<td className={classes}>
												<p className="font-normal">{alamat.nama_kota}</p>
											</td>
											<td className={classes}>
												<p className="font-normal">{alamat.kode_pos}</p>
											</td>
											<td className={classes}>
												<div className="flex flex-row justify-center space-x-2">
													<button
														className="font-medium  bg-[#F3B200] rounded-3xl text-white w-30  cursor-pointer flex text-center items-center justify-center gap-1 p-1 "
														onClick={() => handleEditClick(alamat)}
													>
														<IoPersonCircleOutline size={20} /> Edit
													</button>

													<button
														className="font-medium bg-red-500 text-white rounded-3xl w-30 flex cursor-pointer text-center items-center justify-center gap-1 p-1"
														onClick={() => handleDeleteClick(alamat)}
													>
														<MdDelete size={20} /> Delete
													</button>

													<button
														className={`font-medium ${
															alamat.isUtama ? "hidden" : ""
														} bg-green-500 text-white rounded-3xl w-30 flex cursor-pointer text-center items-center justify-center gap-1 p-1`}
														onClick={() => SetAlamatUtama(alamat.id_alamat)}
													>
														{loadingSetUtamaId === alamat.id_alamat ? (
															<SyncLoader color="#ffffff" size={8} />
														) : (
															<>
																<PiTarget size={20} /> Set
															</>
														)}
													</button>
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
				<div className="flex items-center justify-between px-4 py-4">
					{/* Rows per page */}
					<div className="flex items-center space-x-2">
						<span className="text-sm text-gray-700">Rows per page:</span>
						<select
							value={dataPerPage}
							onChange={(e) => {
								setCurrentPage(1);
								setDataPerPage(parseInt(e.target.value));
							}}
							className="text-sm border border-gray-300 rounded px-2 py-1"
						>
							{[5, 10, 20, 50].map((size) => (
								<option key={size} value={size}>
									{size}
								</option>
							))}
						</select>
					</div>

					{/* Info */}
					<div className="text-sm text-gray-700">
						{`${indexOfFirstData + 1}-${Math.min(
							indexOfLastData,
							data.length
						)} of ${data.length}`}
					</div>

					{/* Navigation arrows */}
					<div className="flex items-center space-x-2">
						<button
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
							className="text-gray-600 hover:text-black disabled:text-gray-300 cursor-pointer"
						>
							<MdChevronLeft size={40} />
						</button>
						<button
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
							className="text-gray-600 hover:text-black disabled:text-gray-300 cursor-pointer"
						>
							<MdChevronRight size={40} />
						</button>
					</div>
				</div>
			</div>

			{showModal && selectedAlamat && (
				<ModalEditAlamat
					show={showModal}
					dataAlamat={selectedAlamat}
					idAlamat={selectedAlamat.id_alamat}
					onClose={() => setShowModal(false)}
					onSuccessEdit={fetchAlamat}
				/>
			)}

			{showModalDelete && selectedAlamat && (
				<ModalDeleteAlamat
					show={showModalDelete}
					idAlamat={selectedAlamat.id_alamat}
					onClose={() => setShowModalDelete(false)}
					onSuccessDelete={fetchAlamat}
				/>
			)}
		</>
	);
};

export default Edit_profile;
