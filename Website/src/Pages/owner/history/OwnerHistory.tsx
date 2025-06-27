import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SyncLoader } from "react-spinners";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { FetchAllBarang, fetchDetailDonasi, fetchRequestDonasi, showOrganisasi } from "../../../api/ApiOwner";
import SidebarNavOwner from "../../../Components2/SideBarNavOwner";

type DetailDonasi = {
    id_detaildonasi: number;
    id_request: number;
    id_pegawai: number;
    id_barang: number;
    tanggal_donasi: Date;
    nama_penerima: string;
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

const OwnerHistory = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [detailDonasiData, setDetailDonasiData] = useState<DetailDonasi[]>([]);
    const [requestData, setRequestData] = useState<RequestDonasi[]>([]);
    const [organisasiList, setOrganisasiList] = useState<Organisasi[]>([]);
    const [barang, setBarang] = useState<Barang[]>([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [dataPerPage, setDataPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchDetailDonasi(), fetchRequestDonasi(), showOrganisasi(), FetchAllBarang()])
            .then(([donasiRes, requestRes, organisasiRes, barangRes]) => {
                setDetailDonasiData(donasiRes.data);
                setRequestData(requestRes.data);
                setOrganisasiList(organisasiRes.data);
                setBarang(barangRes.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const getNamaOrganisasi = (id_organisasi: number) => {
        const org = organisasiList.find((org) => org.id_organisasi === id_organisasi);
        return org ? org.nama : "Unknown";
    };

    const getDateDonasi = (id_request: number) => {
        const donasi = detailDonasiData.find((donasi) => donasi.id_request === id_request);
        return donasi ? donasi.tanggal_donasi : null;
    };

    const getNamaPenerima = (id_request: number) => {
        const donasi = detailDonasiData.find((donasi) => donasi.id_request === id_request);
        return donasi ? donasi.nama_penerima : "Unknown";
    };

    const relasiBarang = (id_request: number) => {
        const donasi = detailDonasiData.find((donasi) => donasi.id_request === id_request);
        const brng = barang.find((brng) => brng.id_barang === donasi?.id_barang);
        return brng ? brng.nama : "Unknown";
    };

    const filteredData = requestData.filter((request) => {
        const orgName = getNamaOrganisasi(request.id_organisasi).toLowerCase();
        const date = String(getDateDonasi(request.id_request));
        const desc = request.deskripsi.toLowerCase();
        const rec = getNamaPenerima(request.id_request).toLowerCase();
        const barangName = relasiBarang(request.id_request).toLowerCase();
        return (
            orgName.includes(searchTerm.toLowerCase()) ||
            date.includes(searchTerm.toLowerCase()) ||
            desc.includes(searchTerm.toLowerCase()) ||
            rec.includes(searchTerm.toLowerCase()) ||
            barangName.includes(searchTerm.toLowerCase())
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

    const TABLE_HEAD = [
		"Organization Name",
		"Donation Date",
		"Recipient",
        "Item",
		"Description",
	];

    return (
        <>
            <div className="flex max-lg:flex-wrap p-5 gap-5 lg:flex-nowrap lg:p-20 lg:gap-10">
                <SidebarNavOwner ></SidebarNavOwner>
                {isLoading ? (
                    <div className="justify-center items-center text-center w-full">
                        <SyncLoader color="#F5CB58" size={10} className="mx-auto" />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                ) : (
                    <div className="bg-white w-full border border-gray-300 text-start shadow-md mt-5">
                        <div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                            <p className="text-xl font-semibold">Riwayat Donasi Organisasi</p>
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
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full table-auto text-left">
                                <thead className="bg-[#2A3042] text-white text-center">
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th key={head} className="p-4">{head}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {currentData.map((org, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="p-4">{getNamaOrganisasi(org.id_organisasi)}</td>
                                            <td className="p-4">
                                                {String(getDateDonasi(org.id_request))}
                                            </td>
                                            <td className="p-4 text-left">
                                                {getNamaPenerima(org.id_request)}
                                            </td>
                                            <td className="p-4 text-left">
                                                {relasiBarang(org.id_request)}
                                            </td>
                                            <td className="p-4 text-left">{org.deskripsi}</td>
                                        </tr>
                                    ))}
                                    {currentData.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-6 text-gray-500">
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
            </div>
        </>
    );
};

export default OwnerHistory;
