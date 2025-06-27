import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SyncLoader } from "react-spinners";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { IoPersonCircleOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import Header from "../../../Components2/Header";
import SideBarNavAdmin from "../../../Components2/SideBarNavAdmin";
import { FetchPegawai } from "../../../api/ApiAdmin";
import ModalResetPassword from "./ModalResetPassword";

interface Pegawai {
	id_organisasi: number;
	id_pegawai: number;
	id_role: number;
	nama: string;
	email: string;
	password: string;
	tanggal_masuk: Date;
	tanggal_lahir: Date;
	wallet: number;
}

const ResetPasswordPegawai = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<Pegawai[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataPerPage, setDataPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");

	const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);
	const [showModalDelete, setShowModalDelete] = useState(false);

	const fetchPegawai = () => {
		setIsLoading(true);
		FetchPegawai()
			.then((response) => {
				setData(response.data);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	useEffect(() => {
		fetchPegawai();
	}, []);

	const handleResetClick = (data: Pegawai) => {
		setSelectedPegawai(data);
		setShowModalDelete(true);
	};

	const filteredData = data.filter(
		(org) =>
			org.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
			org.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const indexOfLastData = currentPage * dataPerPage;
	const indexOfFirstData = indexOfLastData - dataPerPage;
	const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
	const totalPages = Math.ceil(filteredData.length / dataPerPage);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const TABLE_HEAD = [
		"Employee ID",
		"Role",
		"Name",
		"Email",
		"Hire Date",
		"Born Date",
		"Wallet",
		"Action",
	];

	return (
		<>
			<Header />
			<div className="flex max-lg:flex-wrap p-5 gap-5 lg:flex-nowrap lg:p-20 lg:gap-10 ">
				<SideBarNavAdmin></SideBarNavAdmin>

				{isLoading ? (
					<div className="justify-center items-center text-center">
						<SyncLoader color="#F5CB58" size={10} className="mx-auto" />
						<h6 className="mt-2 mb-0">Loading...</h6>
					</div>
				) : (
					<div className="bg-white w-full lg:w-full border border-gray-300 text-start gap-y-4 shadow-md mt-5">
						<div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
							<p>
								<strong>EMPLOYEES</strong>
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
								<tbody className="text-center">
									{currentData.map((org: any, index) => {
										const isLast = index === currentData.length;
										const classes = isLast
											? "p-4"
											: "p-4 border-b border-blue-gray-50";
										return (
											<tr key={org.id_pegawai}>
												<td className={classes}>
													<p className="font-normal">{org.id_pegawai}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">{org.id_role}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">{org.nama}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">{org.email}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">{org.tanggal_masuk}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">{org.tanggal_lahir}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">
														{org.wallet !== null && org.wallet !== undefined
															? org.wallet
															: "0"}
													</p>
												</td>
												<td className={classes}>
													<div className="flex flex-row justify-evenly gap-2">
														<button
															className="font-medium  bg-[#F3B200] rounded-3xl text-white w-30  cursor-pointer flex text-center items-center justify-center gap-1 p-1 "
															onClick={() => handleResetClick(org)}
														>
															<IoPersonCircleOutline size={20} /> Reset
														</button>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>

						{/* Pagination */}
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
				)}
			</div>
			{showModalDelete && selectedPegawai && (
				<ModalResetPassword
					show={showModalDelete}
					idPegawai={selectedPegawai.id_pegawai}
					onClose={() => setShowModalDelete(false)}
					onSuccessDelete={fetchPegawai}
				/>
			)}
		</>
	);
};

export default ResetPasswordPegawai;
