import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload, faSearch } from "@fortawesome/free-solid-svg-icons";
import { SyncLoader } from "react-spinners";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FetchAllPenitip } from "../../../api/ApiOwner";
import SidebarNavOwner from "../../../Components2/SideBarNavOwner";
import { Button } from "flowbite-react";
import { toast } from "react-toastify";

type Penitip = {
    id_penitip: number;
	nama: string;
	email: string;
	telepon: string;
	wallet: number;
};
const BASE_URL = "http://127.0.0.1:8000";

const PenitipLaporan = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [dataPenitip, setDataPenitip] = useState<Penitip[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataPerPage, setDataPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedYear, setSelectedYear] = useState("");

	useEffect(() => {
		setDownloadLoading(true);
		Promise.all([FetchAllPenitip()])
			.then(([penitipRes]) => {
				setDataPenitip(penitipRes.data);
				setDownloadLoading(false);
				console.log(penitipRes.data);
			})
			.catch((err) => {
				console.error(err);
				setDownloadLoading(false);
			});
	}, []);

	const filteredData = dataPenitip.filter((penitip) => {
		return (
			penitip.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
			penitip.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
			penitip.telepon.toLowerCase().includes(searchTerm.toLowerCase()) ||
			penitip.wallet.toString().includes(searchTerm.toLowerCase())
		);
	});

	const indexOfLastData = currentPage * dataPerPage;
	const indexOfFirstData = indexOfLastData - dataPerPage;
	const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
	const totalPages = Math.ceil(filteredData.length / dataPerPage);

	const handlePageChange = (newPage: number) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};

	const TABLE_HEAD = ["Nama Penitip", "Email", "Telepon", "Wallet", "Download"];

    const handleDownload = async (id_pembeli: number, nama_pembeli: string) => {
            try {
                if(!selectedMonth || !selectedYear) {
                    toast.error("Silakan pilih bulan dan tahun terlebih dahulu.");
                    return;
                }
                setDownloadLoading(true);
                let endpoint = `/api/laporan/transaksi-penitip/download/${id_pembeli}/${selectedMonth}/${selectedYear}`;
                let fileName = `Laporan_Transaksi_Penitip_${nama_pembeli}`;
    
                const fullUrl = `${BASE_URL}${endpoint}`;
                const response = await fetch(fullUrl, { 
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                        Accept: "application/pdf",
                    },
                });
    
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute(
                    "download",
                    `${fileName}_${new Date().toISOString().split("T")[0]}.pdf`
                );
                document.body.appendChild(link);
                link.click();
                link.remove();
                toast.success("PDF berhasil diunduh!");
            } catch (error: any) {
                toast.error(error.message || "Gagal mengunduh PDF.");
                console.error("Download error:", error.message);
            } finally {
                setDownloadLoading(false);
            }
        };
        
	return (
		<>
			<div className="flex max-lg:flex-wrap p-5 gap-5 lg:flex-nowrap lg:p-20 lg:gap-10">
				<SidebarNavOwner></SidebarNavOwner>
				{isLoading ? (
					<div className="justify-center items-center text-center w-full">
						<SyncLoader color="#F5CB58" size={10} className="mx-auto" />
						<h6 className="mt-2 mb-0">Loading...</h6>
					</div>
				) : (
					<div className="bg-white w-full border border-gray-300 text-start shadow-md mt-5">
						<div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
							<p className="text-xl font-semibold">List Penitip</p>
							<div className="relative w-full sm:w-1/2">
								<FontAwesomeIcon
									icon={faSearch}
									className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
								/>
								<input
									type="text"
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full h-10 bg-[#F0F0F0] rounded-4xl pl-10 pr-4 py-2 focus:outline-none"
									placeholder="Cari organisasi, tanggal, atau deskripsi..."
								/>
							</div>
							<div className="flex items-center space-x-2">
								<label htmlFor="monthPicker" className="text-sm text-gray-700">
									Bulan & Tahun:
								</label>
								<input
									id="monthPicker"
									type="month"
									className="border border-gray-300 rounded px-2 py-1 text-sm"
									onChange={(e) => {
										const [selectedYear, selectedMonth] =
											e.target.value.split("-");
										// You can now use selectedYear and selectedMonth as needed
										setSelectedMonth(selectedMonth); 
                                        setSelectedYear(selectedYear);
									}}
								/>
							</div>
						</div>

						<div className="overflow-x-auto">
							<table className="w-full table-auto text-left">
								<thead className="bg-[#2A3042] text-white text-center">
									<tr>
										{TABLE_HEAD.map((head) => (
											<th key={head} className="p-4">
												{head}
											</th>
										))}
									</tr>
								</thead>
								<tbody className="text-center">
									{currentData.map((penitip, index) => (
										<tr key={index} className="border-b">
											<td className="p-4">{penitip.nama}</td>
											<td className="p-4">{penitip.email}</td>
											<td className="p-4 text-left">{penitip.telepon}</td>
											<td className="p-4 text-left">
												{penitip.wallet.toLocaleString("id-ID", {
													style: "currency",
													currency: "IDR",
												})}
											</td>
											<td>
												<div className="flex justify-center">
													<Button
														size="sm"
														onClick={() => handleDownload(penitip.id_penitip, penitip.nama)}
														disabled={downloadLoading}
														className="bg-green-500 hover:bg-green-600 text-white items-center flex justify-center"
													>
														{downloadLoading ? (
															<SyncLoader
																size={6}
																color="#ffffff"
																className="ml-1"
															/>
														) : (
															<>
																<FontAwesomeIcon icon={faDownload} />
																<span className="ml-2">Unduh</span>
															</>
														)}
													</Button>
												</div>
											</td>
										</tr>
									))}
									{currentData.length === 0 && (
										<tr>
											<td
												colSpan={3}
												className="text-center py-6 text-gray-500"
											>
												No data found
											</td>
										</tr>
									)}
								</tbody>
							</table>
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
									filteredData.length
								)} of ${filteredData.length}`}
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
		</>
	);
};

export default PenitipLaporan;
