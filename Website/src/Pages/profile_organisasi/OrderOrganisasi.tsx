import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { MdDashboard } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Frieren from "../../assets/images/Frieren.jpg";
import SidebarNavOrg from "../../Components2/SideBarNavOrg";
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

const data = [
    { orderid: '1234567890', orderdate: '2023-10-01', orderstatus: 'Pending', ordertotal: '$100.00', orderlink: 'https://example.com/order/1234567890' },
    { orderid: '1234567890', orderdate: '2023-10-01', orderstatus: 'Pending', ordertotal: '$100.00', orderlink: 'https://example.com/order/1234567890' },
    { orderid: '1234567890', orderdate: '2023-10-01', orderstatus: 'Pending', ordertotal: '$100.00', orderlink: 'https://example.com/order/1234567890' },
    { orderid: '1234567890', orderdate: '2023-10-01', orderstatus: 'Pending', ordertotal: '$100.00', orderlink: 'https://example.com/order/1234567890' },
    { orderid: '1234567890', orderdate: '2023-10-01', orderstatus: 'Pending', ordertotal: '$100.00', orderlink: 'https://example.com/order/1234567890' },
    { orderid: '1234567890', orderdate: '2023-10-01', orderstatus: 'Pending', ordertotal: '$100.00', orderlink: 'https://example.com/order/1234567890' },

]
const OrderOrganisasi = () => {
    const [showCurrentPassword, setCurrentPassword] = useState(false);
    const [showNewPassword, setNewPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0)
    const total = data.length

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : total - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prev) => (prev < total - 1 ? prev + 1 : 0))
    }
    const toggleCurrentPasswordVisibility = () => {
        setCurrentPassword((prev) => !prev);
    };
    const toggleNewPasswordVisibility = () => {
        setNewPassword((prev) => !prev);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPassword((prev) => !prev);
    };
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
                <div className="flex flex-col w-full min-h-[500px] mt-5 border-1 border-gray-300 rounded-lg">
                    <p className="text-2xl font-bold ml-8 mt-5">Order History</p>
                    <Carousel>
                        <CarouselContent>
                            <CarouselItem><table className="w-full  mt-5 mb-5">
                                <tr className="flex justify-center items-center py-6 bg-[#F2F2F2]">
                                    <td className="w-full flex justify-center items-center">ORDER ID</td>
                                    <td className="w-full flex justify-center items-center">ORDER ID</td>
                                    <td className="w-full flex justify-center items-center">ORDER ID</td>
                                    <td className="w-full flex justify-center items-center">ORDER ID</td>
                                    <td className="w-full flex justify-center items-center">ORDER ID</td>
                                </tr>
                                {data.map((item, index) => (
                                    <tr key={index} className="flex justify-center items-center py-6 ">
                                        <td className="w-full flex justify-center items-center">{item.orderid}</td>
                                        <td className="w-full flex justify-center items-center">{item.orderdate}</td>
                                        <td className="w-full flex justify-center items-center">{item.ordertotal}</td>
                                        <td className="w-full flex justify-center items-center">{item.orderstatus}</td>
                                        <td className="w-full flex justify-center items-center"><a href={item.orderlink} className="text-[#00B207]">View Details</a></td>
                                    </tr>))}
                            </table></CarouselItem>
                            <CarouselItem>...</CarouselItem>
                            <CarouselItem>...</CarouselItem>
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

export default OrderOrganisasi;