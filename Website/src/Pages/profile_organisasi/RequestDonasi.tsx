import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { MdChevronLeft, MdChevronRight, MdDashboard, MdDelete } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline, IoPersonCircleOutline } from "react-icons/io5";
import Frieren from "../../assets/images/Frieren.jpg";
import SidebarNavOrg from "../../Components2/SideBarNavOrg";
import {
    faSearch,
    faHouse,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "../../components/ui/textarea";
import { Button } from "../../components/ui/button";
import { FetchOrganisasi } from "../../api/ApiAdmin";
import { SyncLoader } from "react-spinners";
import ModalDeleteRequestDonasi from "./ModalDeleteRequest";
import { addRequestDonasi, fetchRequestDonasi } from "../../api/ApiOrganisasi";
import { showRequestDonasiById } from "../../api/ApiOrganisasi";
import ModalEditRequest from "./ModalEditRequest";
import { toast } from "react-toastify";

type RequestDonasi = {
    id_request: number;
    id_organisasi: number;
    tanggal_request: string;
    deskripsi: string;
    status_terpenuhi: boolean;
};

const RequestDonasi = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<RequestDonasi[]>([]);
    const [donasiList, setDonasiList] = useState<RequestDonasi[]>([]);
    const [newDeskripsi, setNewDeskripsi] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setselectedRequest] = useState<RequestDonasi | null>(null);
    const [showModalDelete, setShowModalDelete] = useState(false);

    const fetchRequestDonasiById = async () => {
        setIsLoading(true);
        showRequestDonasiById()
            .then((data) => {
                setData(data.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchRequestDonasiById();
    }, []);

    const handleEditClick = (data: RequestDonasi) => {
        setselectedRequest(data);
        setShowModal(true);
    };

    const handleDeleteClick = (data: RequestDonasi) => {
        setselectedRequest(data);
        setShowModalDelete(true);
    };

    const handleAddRequest = async () => {
        if (!newDeskripsi.trim()) {
            toast.error("Description cannot be empty.");
            return;
        }

        const payload = {
            deskripsi: newDeskripsi,
            tanggal_request: new Date().toISOString().split("T")[0],
            status_terpenuhi: false,
        };

        try {
            setIsLoading(true);
            await addRequestDonasi(payload);
            setNewDeskripsi("");

            toast.success("Request added successfully!");
            await fetchRequestDonasiById();
        } catch (error) {
            console.error("Add request error:", error);
            toast.error("Failed to add request.");
        } finally {
            setIsLoading(false);
        }
    };


    const filteredData = data.filter(
        (req) =>
            req.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.id_request.toString().includes(searchTerm.toLowerCase())
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
        "ID",
        "Request",
        "Action"

    ];
    return (
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
                            <a
                                href="/marketplace"
                                className="ml-1 text-sm font-medium text-gray-500 md:ml-2"
                            >
                                Account
                            </a>
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
            <div className="flex flex-row gap-4">
                <SidebarNavOrg></SidebarNavOrg>
                <div className="flex flex-col w-full h-full mt-5">
                    <p className="text-2xl font-bold">Add Request Donation</p>
                    <div className="grid w-full gap-1.5 mt-2">
                        <Textarea
                            className="h-30 border-green-500"
                            placeholder="Type your request here."
                            id="message"
                            value={newDeskripsi}
                            onChange={(e) => setNewDeskripsi(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={handleAddRequest}
                        className="max-w-[200px] mt-4 bg-[#1F510F] hover:bg-[#F0F0F0] hover:text-black text-white border-1 border-black rounded-md h-10"
                    >

                        <strong>Add Request</strong>
                    </Button>

                    {isLoading ? (
                        <div className="justify-center items-center text-center">
                            <SyncLoader color="#F5CB58" size={10} className="mx-auto" />
                            <h6 className="mt-2 mb-0">Loading...</h6>
                        </div>
                    ) : (
                        <div className="bg-white w-full lg:w-full border border-gray-300 text-start gap-y-4 shadow-md mt-5">
                            <div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                                <p>
                                    <strong>DONATION REQUESTS</strong>
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
                                        {currentData.map((req: any, index) => {

                                            return (

                                                <tr key={req.id_request}>
                                                    <td className="p-4 border-b border-blue-gray-50 w-[100px]">
                                                        <p className="font-normal">{req.id_request}</p>
                                                    </td>
                                                    <td className="p-4 border-b border-blue-gray-50 w-[500px]">
                                                        <p className="font-normal">{req.deskripsi}</p>
                                                    </td>

                                                    <td className="p-4 border-b border-blue-gray-50 w-[100px]">
                                                        <div className="flex flex-row justify-end gap-2">


                                                            <button
                                                                className="font-medium  bg-[#F3B200] rounded-3xl text-white w-30  cursor-pointer flex text-center items-center justify-center gap-1 p-1 "
                                                                onClick={() => handleEditClick(req)}
                                                            >
                                                                <IoPersonCircleOutline size={20} /> Edit
                                                            </button>

                                                            <button className="font-medium bg-red-500 text-white rounded-3xl w-30 flex cursor-pointer text-center items-center justify-center gap-1 p-1"
                                                                onClick={() => handleDeleteClick(req)}
                                                            >
                                                                <MdDelete size={20} /> Delete
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
                    {showModal && selectedRequest && (
                        <ModalEditRequest
                            show={showModal}
                            dataOrganisasi={selectedRequest}
                            idRequest={selectedRequest.id_organisasi}
                            onClose={() => setShowModal(false)}
                            onSuccessEdit={fetchRequestDonasiById}
                        />
                    )}

                    {showModalDelete && selectedRequest && (
                        <ModalDeleteRequestDonasi
                            show={showModalDelete}
                            idRequest={selectedRequest.id_request}
                            onClose={() => setShowModalDelete(false)}
                            onSuccessDelete={fetchRequestDonasiById}
                        />
                    )}
                </div>

            </div>

        </div>
    );
};

export default RequestDonasi;

function then(arg0: (data: any) => void) {
    throw new Error("Function not implemented.");
}
function setIsPending(arg0: boolean) {
    throw new Error("Function not implemented.");
}

