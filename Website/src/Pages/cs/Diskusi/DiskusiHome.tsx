import { useEffect, useState } from "react";
import { SyncLoader } from "react-spinners";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

import { IoPersonCircleOutline } from "react-icons/io5";
import Header from "../../../Components2/Header";
import SideBarNavCS from "../../../Components2/SideBarNavCS";
import { FetchDiskusiCS } from "../../../api/ApiDiskusi";
import ModalDetailDiskusi from "./ModalDetailDiskusi";



type Diskusi = {
	id_barang: number;
	id_diskusi: number;
	pesan: string;
	nama_pembeli: string;
	tanggal_diskusi: string;
	foto_pembeli: string;

};


const Diskusi = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<Diskusi[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataPerPage, setDataPerPage] = useState(10);
	const [showModal, setShowModal] = useState(false);
	const [tempIdBarang, setTempIdBarang] = useState(0);



	const fetchDiskusiCS = () => {
		setIsLoading(true);
		FetchDiskusiCS()
			.then((response) => {
				setData(response.diskusi);
				console.log(response)
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};


	useEffect(() => {
		fetchDiskusiCS();
	}, []);

	const handleClick = (idBarang: number) => {
		setShowModal(true);
		setTempIdBarang(idBarang);

	}




	const indexOfLastData = currentPage * dataPerPage;
	const indexOfFirstData = indexOfLastData - dataPerPage;
	const currentData = data.slice(indexOfFirstData, indexOfLastData);
	const totalPages = Math.ceil(data.length / dataPerPage);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const TABLE_HEAD = [
		"Profile Photo",
		"Name",
		"Pesan",
		"Date",
		"Action",
	];

	return (	
		<>
			<Header />
			<div className="flex max-lg:flex-wrap p-5 gap-5 lg:flex-nowrap lg:p-20 lg:gap-10 ">

				<SideBarNavCS></SideBarNavCS>

				{isLoading ? (
					<div className="justify-center items-center text-center ">
						<SyncLoader color="#F5CB58" size={10} className="mx-auto justify-self-center items-center" />
						<h6 className="mt-2 mb-0">Loading...</h6>
					</div>
				) : (
					<div className="bg-white w-full lg:w-full border border-gray-300 text-start gap-y-4 shadow-md mt-5">
						<div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
							<p>
								<strong>Discussion</strong>
							</p>

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
									{currentData.map((diskusi: any, index) => {
										const isLast = index === currentData.length;
										const classes = isLast
											? "p-4"
											: "p-4 border-b border-blue-gray-50";
										return (
											<tr key={diskusi.id_diskusi}>
												<td className={classes}>
													<img
														className="rounded-[50px] w-12 h-12 bg-gray-500 justify-self-center"
														src={diskusi.foto_pembeli}
														alt=""
													/>
												</td>
												<td className={classes}>
													<p className="font-normal">{diskusi.nama_pembeli}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">{diskusi.pesan}</p>
												</td>
												<td className={classes}>
													<p className="font-normal">{new Date(diskusi.tanggal_diskusi).toLocaleString("id-ID", {
														weekday: "long",
														year: "numeric",
														month: "long",
														day: "numeric",
														hour: "2-digit",
														minute: "2-digit",
													})}</p>
												</td>
												<td className={classes}>
													<div className="flex flex-row justify-evenly gap-2">
														<button
															className="font-medium  bg-cyan-500 rounded-3xl text-white w-30  cursor-pointer flex text-center items-center justify-center gap-1 p-1 "
															onClick={() => handleClick(diskusi.id_barang)}
														>
															<IoPersonCircleOutline size={20} /> View
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
			{showModal && (
				<ModalDetailDiskusi
					show={showModal}
					idBarang={tempIdBarang}
					onClose={() => setShowModal(false)}

				/>
			)}
		</>

	);
};

export default Diskusi;