import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Frieren from "../../assets/images/Frieren.jpg";
import { FetchBarangByPenitip } from "../../api/ApiPenitip";
import SidebarNavPenitip from "../../Components2/SideBarNavPenitip";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel"
import {
    faSearch,
    faHouse,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FetchPenitip } from "../../api/ApiGudang";
type Penitip = {
    id_penitip: number;
    nama: string;
    email: string;
    wallet: string;
};
const ShowPenitip = () => {
    const [showCurrentPassword, setCurrentPassword] = useState(false);
    const [showNewPassword, setNewPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0)
    const [data, setData] = useState<Penitip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [showModal, setShowModal] = useState(false);
    const [tempIdBarang, setTempIdBarang] = useState(0);

    const handleClick = (idBarang: number) => {
        setShowModal(true);
        setTempIdBarang(idBarang);

    }


    const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };
    const filteredData = data.filter((item) => {
        const searchLower = searchTerm.toLowerCase();

        const matchesSearch =
            item.id_penitip.toString().includes(searchLower) ||
            item.nama.toLowerCase().includes(searchLower) ||
            item.wallet.toString().includes(searchLower) ||
            item.email.toLowerCase().includes(searchLower);



        return matchesSearch;
    });

    const chunkedData = chunkArray(filteredData, itemsPerPage);


    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );


    const fetchBarangByPenitip = () => {
        setIsLoading(true);
        FetchPenitip()
            .then((response) => {
                setData(response.data);
                setIsLoading(false);
                console.log(response);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setIsLoading(false);
            });
    }
    useEffect(() => {
        fetchBarangByPenitip();
    }, []); 44

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
                <SidebarNavPenitip />
                <div className="flex flex-col max-w-[1200px] w-full min-h-[500px] mt-5 border-1 border-gray-300 rounded-lg">
                    <p className="text-2xl font-bold ml-8 mt-5">Show Penitip</p>

                    <div className="flex gap-4 items-center mb-4 px-6 mt-5">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 rounded-md px-3 py-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                        />
                        <p className="text-sm text-gray-500 font-semibold">
                            Start Date:
                        </p>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2"
                        />
                        <p className="text-sm text-gray-500 font-semibold">
                            End Date:
                        </p>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2"
                        />
                        <select
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2"
                        >
                            <option value={5}>5 / page</option>
                            <option value={10}>10 / page</option>
                        </select>
                    </div>
                    <Carousel>
                        <CarouselContent>
                            {chunkedData.map((chunk, index) => (
                                <CarouselItem key={index}>
                                    <div className="w-full overflow-x-auto">
                                        <table className="w-full mt-5 mb-5 table-auto">
                                            <thead>
                                                <tr className="bg-[#F2F2F2]">
                                                    <th className="px-4 py-3 text-center">NAMA BARANG</th>
                                                    <th className="px-4 py-3 text-center">TOTAL</th>
                                                    <th className="px-4 py-3 text-center">STATUS</th>
                                                    <th className="px-4 py-3 text-center">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {chunk.map((item, rowIndex) => (
                                                    <tr key={rowIndex} className="border-b">
                                                        <td className="py-3 text-center break-words">{item.nama}</td>

                                                        <td className="px-4 py-3 text-center">Rp {item.wallet}</td>
                                                        <td className="px-4 py-3 text-center">{item.email}</td>
                                                        <td
                                                            className="px-4 py-3 text-center text-[#00B207] hover:underline cursor-pointer"
                                                            onClick={() => handleClick(item.id_penitip)}
                                                        >
                                                            View Details
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="flex justify-center gap-4 mt-4">
                            <CarouselPrevious className="static relative" />
                            <CarouselNext className="static relative" />
                        </div>
                    </Carousel>


                </div>

            </div>


        </div>
    );
};

export default ShowPenitip;

