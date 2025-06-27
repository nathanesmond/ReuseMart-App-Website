import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SyncLoader } from "react-spinners";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import ModalEditDonasi from "./ModalEditDonasi";
import ModalViewDonasi from "./ModalViewDonasi";
import ModalAddDonasi from "./ModalAddDonasi";
import { IoAdd } from "react-icons/io5";
import { fetchDetailDonasi, fetchRequestDonasi, showOrganisasi } from "../../../api/ApiOwner";
import SidebarNavOwner from "../../../Components2/SideBarNavOwner";
import { Edit} from "lucide-react";
import { FaEye } from "react-icons/fa6";

type DetailDonasi = {
    id_detaildonasi: number;
	id_request: number;
	id_pegawai: number;
	id_barang: number;
	tanggal_donasi: Date; 
	nama_penerima: string;
	reward_sosial: number;
};

type RequestDonasi = {
    id_request: number;
    id_organisasi: number;
    tanggal_request: string;
    deskripsi: string;
    status_terpenuhi: boolean;
};

type Organisasi = {
	id_organisasi: number;
	nama: string;
	alamat: string;
	telp: string;
	email: string;
	password: string;
	foto: File;
};

type Barang = {
    id_barang: number;
    id_penitipan: number;
    id_kategori: string;
    id_hunter: string;
    nama: string;
    deskripsi: string;
    foto: string;
    berat: number;
    isGaransi: boolean;
    akhir_garansi: string;
    status_perpanjangan: string;
    harga: number;
    tanggal_akhir: string;
    batas_ambil: string;
    status_barang: string;
    tanggal_ambil: string;
};

const OwnerDonasi = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState<DetailDonasi[]>([]);
    const [requestData, setRequestData] = useState<RequestDonasi[]>([]);
	const [organisasi, setOrganisasi] = useState<Organisasi[]>([]);
	const [barang, setBarang] = useState<Barang[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataPerPage, setDataPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedDonasi, setSelectedDonasi] = useState<DetailDonasi | null>(null);
	const [showModalAdd, setShowModalAdd] = useState(false);
	const [showModalView, setShowModalView] = useState(false);


    const fetchRequest = () => {
        setIsLoading(true);
        fetchRequestDonasi()
            .then((response) => {
                setRequestData(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }

    const ShowOrganisasi = () => {
        setIsLoading(true);
        showOrganisasi()
            .then((response) => {
                setOrganisasi(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

	const FetchDetailDonasi = () => {
		setIsLoading(true);
		fetchDetailDonasi()
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
        ShowOrganisasi();
		fetchRequest();
		FetchDetailDonasi();
	}, []);

    const getNamaOrganisasi = (id_organisasi: number) => {
		const org = organisasi.find((org) => org.id_organisasi === id_organisasi);
		return org ? org.nama : "Unknown";
    };

	const getyesOrNo = (status: boolean) => {
		return status ? "Terpenuhi" : "Tidak Terpenuhi";
	}

	const filteredData = requestData.filter(
        (org) =>
            org.id_organisasi.toString().includes(searchTerm.toLowerCase()) ||
			getNamaOrganisasi(org.id_organisasi).toLowerCase().includes(searchTerm.toLowerCase()) ||
			org.tanggal_request.toString().includes(searchTerm.toLowerCase()) ||
			org.deskripsi.toString().includes(searchTerm.toLowerCase()) ||
			getyesOrNo(org.status_terpenuhi).toLowerCase().includes(searchTerm.toLowerCase())
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
		"Organization Name",
		"Request Date",
		"Description",
		"Status",
		"Action",
	];

	return (
		<>
			<div className="flex max-lg:flex-wrap p-5 gap-5 lg:flex-nowrap lg:p-20 w-[90%]">
				<SidebarNavOwner></SidebarNavOwner>

				{isLoading ? (
					<div className="justify-center items-center text-center">
						<SyncLoader color="#F5CB58" size={10} className="mx-auto" />
						<h6 className="mt-2 mb-0">Loading...</h6>
					</div>
				) : (
					<div className="bg-white w-full lg:w-full border border-gray-300 text-start gap-y-4 shadow-md mt-5">
						<div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
							<p>
								<strong>DETAIL DONATION</strong>
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
							<table className="w-10 min-w-max table-auto text-left">
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
											: "p-4 border-b border-blue-gray-50 ";
										return (
											<tr key={org.id_request}>
												<td className={classes}>
													<p className="font-normal text-sm">{getNamaOrganisasi(org.id_organisasi)}</p>
												</td>
												<td className={classes}>
													<p className="font-normal text-sm">{org.tanggal_request}</p>
												</td>
												<td className={classes} >
													<p className="font-normal text-left flex-wrap text-sm">{org.deskripsi}</p>
												</td>
												<td className={classes} >
													<p className="font-normal text-sm ">{getyesOrNo(org.status_terpenuhi)}</p>
												</td>
												<td className={classes}>
													<div className="flex flex-row justify-evenly gap-2">
														<button
														className="font-medium bg-[#F3B200] rounded-3xl text-white w-20  cursor-pointer flex text-center items-center justify-center gap-1 p-1"
														onClick={() => {
															const detail = data.find((item) => item.id_request === org.id_request);
													
															setSelectedDonasi({
																id_detaildonasi: detail ? detail.id_detaildonasi : 0, 
																id_request: org.id_request,
																id_pegawai: detail ? detail.id_pegawai : 0,
																id_barang: detail ? detail.id_barang : org.id_barang, 
																tanggal_donasi: detail ? new Date(detail.tanggal_donasi) : new Date(),
																nama_penerima: detail ? detail.nama_penerima : "",
																reward_sosial: detail ? detail.reward_sosial : 0,
															});
															setShowModal(true);
														}}
														>
														<Edit size={15}/> <p className="text-sm">Edit</p>
														</button>

														<button className="font-medium bg-blue-500 text-white rounded-3xl w-20 flex cursor-pointer text-center items-center justify-center gap-1 p-1"
														onClick={() => {
															const detail = data.find((item) => item.id_request === org.id_request);
													
															setSelectedDonasi({
																id_detaildonasi: detail ? detail.id_detaildonasi : 0, 
																id_request: org.id_request,
																id_pegawai: detail ? detail.id_pegawai : 0,
																id_barang: detail ? detail.id_barang : org.id_barang, 
																tanggal_donasi: detail ? new Date(detail.tanggal_donasi) : new Date(),
																nama_penerima: detail ? detail.nama_penerima : "",
																reward_sosial: detail ? detail.reward_sosial : 0,
															});
															setShowModalView(true);
														}}>
														<FaEye size={15} /> <p className="text-sm">View</p>
														</button>

														{!org.status_terpenuhi && (
														<button
															className="font-medium bg-green-500 text-white rounded-3xl px-4 py-2"
															onClick={() => {
																setSelectedDonasi({
																	id_detaildonasi: 0,
																	id_request: org.id_request,
																	id_pegawai: 0,
																	id_barang: 0,
																	tanggal_donasi: new Date(),
																	nama_penerima: "",
																	reward_sosial: 0,
																});
																setShowModalAdd(true);
															}}
														>
														<IoAdd size={15} />
														<p className="text-sm">Add</p>
														</button>
														)}
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
								{`${indexOfFirstData + 1}-${Math.min(indexOfLastData, filteredData.length)} of ${filteredData.length}`}
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
				{showModal && selectedDonasi && (
					<ModalEditDonasi
						show={showModal}
						dataDetailDonasi={selectedDonasi}
						id_detaildonasi={selectedDonasi.id_detaildonasi}
						onClose={() => setShowModal(false)}
						onSuccessEdit={FetchDetailDonasi}
					/>
				)}
				{showModalAdd && selectedDonasi && (
					<ModalAddDonasi
						show={showModalAdd}
						onClose={() => setShowModalAdd(false)}
						onSuccessAdd={FetchDetailDonasi}
						requestData={selectedDonasi}
					/>
				)}
				{showModalView && selectedDonasi && (
					<ModalViewDonasi
						show={showModalView}
						dataDetailDonasi={selectedDonasi}
						id_detaildonasi={selectedDonasi.id_detaildonasi}
						onClose={() => setShowModalView(false)}
						onSuccessEdit={fetchRequest}
					/>
				)}
			</div>
		</>

	);
};

export default OwnerDonasi;