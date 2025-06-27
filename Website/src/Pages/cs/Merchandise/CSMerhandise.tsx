import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SyncLoader } from "react-spinners";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoPersonCircleOutline } from "react-icons/io5";
import Header from "../../../Components2/Header";
import SidebarNavCS from "../../../Components2/SideBarNavCS";
import { fetchPenukaranPoin } from "../../../api/ApiMerchandise";
import ModalEditConfirmationMerchandise from "./ModalEditMerchandise";

declare global {
    interface Window {
        filterAmbil?: string;
    }
}

type PenukaranPoin = {
    id_penukaranpoin: number;
    id_merchandise: number;
    id_pembeli: number;
    tanggal_penukaran: string;
    status_verifikasi: string;
    tanggal_ambil: string;
    pen_poin_pembeli?: {
        nama: string;
    };
    pen_poin_merchandise?: {
        nama_merchandise: string;
    };
};

const CSMerchandise = () => {
    const [filterAmbil, setFilterAmbil] = useState<string>(window.filterAmbil || "all");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<PenukaranPoin[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPenukaranPoin, setSelectedPenukaranPoin] = useState<PenukaranPoin | null>(null);

    const FetchPenukaranPoint = () => {
        setIsLoading(true);
        fetchPenukaranPoin()
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
        FetchPenukaranPoint();
    }, []);

    const handleEditClick = (data: PenukaranPoin) => {
        setSelectedPenukaranPoin(data);
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setSelectedPenukaranPoin(null);
    };

    const filteredData = data.filter((item) => {
        const matchesSearch =
            item.id_penukaranpoin.toString().includes(searchTerm) ||
            item.tanggal_penukaran?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.tanggal_ambil?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.status_verifikasi?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.pen_poin_pembeli?.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.pen_poin_merchandise?.nama_merchandise.toLowerCase().includes(searchTerm.toLowerCase());
        if (searchTerm === "") {
        }

        const matchesFilter =
            filterAmbil === "all"
            ? true
            : filterAmbil === "belum"
            ? !item.tanggal_ambil
            : filterAmbil === "sudah"
            ? !!item.tanggal_ambil
            : true;

        return matchesSearch && matchesFilter;
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
        "ID",
        "Pembeli",
        "Merchandise",
        "Penukaran",
        "Pengambilan",
        "Status",
        "Action",
    ];

    return (
        <>
            <Header />
            <div className="flex max-lg:flex-wrap p-5 gap-5 lg:flex-nowrap lg:p-20 lg:gap-10">
                <SidebarNavCS />
                {isLoading ? (
                    <div className="justify-center items-center text-center">
                        <SyncLoader color="#F5CB58" size={10} className="mx-auto" />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                ) : (
                    <div className="bg-white w-full lg:w-full border border-gray-300 text-start gap-y-4 shadow-md mt-5">
                        <div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                            <p>
                                <strong>Merchandise Verification</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-1/2">
                                <div className="relative flex-1">
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
                                <div>
                                    <select
                                        className="h-10 bg-[#F0F0F0] rounded-4xl px-4 py-2 focus:outline-none"
                                        value={
                                            (searchTerm === "" && !window.filterAmbil) ? "all" : window.filterAmbil || "all"
                                        }
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            window.filterAmbil = value === "all" ? "" : value;
                                            setSearchTerm("");
                                            setCurrentPage(1);
                                            setFilterAmbil(value);
                                        }}
                                    >
                                        <option value="all">Semua</option>
                                        <option value="belum">Belum Diambil</option>
                                        <option value="sudah">Sudah Diambil</option>
                                    </select>
                                </div>
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
                                    {currentData.map((penukaranpoin: any, index) => {
                                        const isLast = index === currentData.length;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-blue-gray-50";
                                        return (
                                            <tr key={penukaranpoin.id_penukaranpoin}>
                                                <td className={classes}>
                                                    <p className="font-normal">{penukaranpoin.id_penukaranpoin}</p>
                                                </td>
                                                <td className={classes}>
                                                    <p className="font-normal">{penukaranpoin.pen_poin_pembeli.nama}</p>
                                                </td>
                                                <td className={classes}>
                                                    <p className="font-normal">{penukaranpoin.pen_poin_merchandise.nama_merchandise}</p>
                                                </td>
                                                <td className={classes}>
                                                    <p className="font-normal">{penukaranpoin.tanggal_penukaran}</p>
                                                </td>
                                                <td className={classes}>
                                                    <p className="font-normal">{penukaranpoin.tanggal_ambil ?? "-"}</p>
                                                </td>
                                                <td className={classes}>
                                                    <p className="font-normal">{penukaranpoin.status_verifikasi}</p>
                                                </td>
                                                <td className={classes}>
                                                    {penukaranpoin.status_verifikasi === "Pending" ? (
                                                        <button
                                                            className="font-medium bg-[#F3B200] rounded-3xl text-white w-30 cursor-pointer flex text-center items-center justify-center gap-1 p-1"
                                                            onClick={() => handleEditClick(penukaranpoin)}
                                                        >
                                                            <IoPersonCircleOutline size={20} /> Edit
                                                        </button>
                                                    ) : penukaranpoin.status_verifikasi === "Approved" && !penukaranpoin.tanggal_ambil ? (
                                                        <button
                                                            className="font-medium bg-[#F3B200] rounded-3xl text-white w-30 cursor-pointer flex text-center items-center justify-center gap-1 p-1"
                                                            onClick={() => handleEditClick(penukaranpoin)}
                                                        >
                                                            <IoPersonCircleOutline size={20} /> Edit
                                                        </button>
                                                    ) : penukaranpoin.status_verifikasi === "Declined" ? (
                                                        <p className="font-normal italic text-gray-400">Ditolak</p>
                                                    ) : (
                                                        <p className="font-normal italic text-gray-400">Diambil</p>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex items-center justify-between px-4 py-4">
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

                            <div className="text-sm text-gray-700">
                                {`${indexOfFirstData + 1}-${Math.min(
                                    indexOfLastData,
                                    data.length
                                )} of ${data.length}`}
                            </div>

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

            {selectedPenukaranPoin && (
                <ModalEditConfirmationMerchandise
                    dataPenukaranPoin={{
                        id_penukaranpoin: selectedPenukaranPoin.id_penukaranpoin,
                        status_verifikasi: selectedPenukaranPoin.status_verifikasi,
                        tanggal_ambil: selectedPenukaranPoin.tanggal_ambil,
                    }}
                    idPenukaranPoin={selectedPenukaranPoin.id_penukaranpoin}
                    show={showEditModal}
                    onClose={handleCloseModal}
                    onSuccessEdit={FetchPenukaranPoint}
                />
            )}
        </>
    );
};

export default CSMerchandise;