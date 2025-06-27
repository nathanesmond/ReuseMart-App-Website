import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import Frieren from "../../assets/images/Frieren.jpg";
import { Logout } from "../../api/apiAuth";
import { toast } from "react-toastify";
import { fetchPembeli } from "../../api/ApiPembeli";
import { getAlamatUtama } from "../../api/ApiPembeli";
import SidebarNavOrg from "../../Components2/SideBarNavOrg";
import {
    faSearch,
    faHouse,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

interface Pembeli {
    id_pembeli: number;
    nama: string;
    email: string;
    telepon: string;
    foto: string;
}

interface AlamatUtama {
    nama_alamat: string,
    nama_kota: string,
    kode_pos: Int16Array,
}

const ProfileOrganisasi = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<Pembeli>();
    const [showCurrentPassword, setCurrentPassword] = useState(false);
    const [alamatUtama, setAlamatUtama] = useState<AlamatUtama>();
    const [showNewPassword, setNewPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);

    const fetchProfile = () => {
        fetchPembeli()
            .then((response) => {
                console.log(response);
                setProfile(response);
            })
            .catch((error) => {
                console.error("Error fetching profile:", error);
            });
    };

    const fetchAlamatUtama = () => {

        getAlamatUtama()
            .then((response) => {
                console.log(response);
                setAlamatUtama(response);
                console.log(response);
            })
            .catch((error) => {
                console.error("Error fetching address:", error);
            });
    };

    useEffect(() => {
        fetchProfile();
        fetchAlamatUtama();
    }, []);

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
            <div className="flex flex-row">
                <SidebarNavOrg />

                <div className="flex flex-col flex-1 w-full p-4 mt-5 ms-10">
                    <div>
                        <h3>
                            <strong>Hello, {profile?.nama}</strong>
                        </h3>
                        <p className="text-gray-500">
                            From your account dashboard. you can easily check & view your{" "}
                            <a href="#" className="text-[#2DA5F3]">
                                Recent Orders
                            </a>
                            , manage your{" "}
                            <a href="" className="text-[#2DA5F3]">
                                Shipping and Billing Addresses
                            </a>{" "}
                            and edit your{" "}
                            <a href="" className="text-[#2DA5F3]">
                                Password
                            </a>{" "}
                            and{" "}
                            <a href="" className="text-[#2DA5F3]">
                                Account Details.
                            </a>
                        </p>
                    </div>

                    <div className="flex flex-row gap-4 mt-5">
                        <div className="flex flex-row w-2/5 bg-white rounded-lg border-1 border-gray-300 justify-center items-center gap-10">
                            <img
                                src={`${"http://127.0.0.1:8000"}/storage/${profile?.foto}`}
                                alt=""
                                className="w-50 h-50 rounded-full max-sm:w-20 max-sm:h-20"
                            />
                            <div className="text-center">
                                <p className="text-2xl font-bold mt-2">{profile?.nama}</p>
                                <p className="text-gray-500">{profile?.email}</p>
                                <p className="text-gray-500">Buyer</p>
                            </div>
                        </div>

                        <div className="flex flex-col w-1/4 bg-white rounded-lg p-5 border-1 border-gray-300 text-start gap-y-4">
                            <p className="text-[#999999]">TOTAL POINT</p>
                            <p>
                                <strong>200 pts</strong>
                            </p>
                            <p className="text-[#999999]">TOTAL ORDER</p>
                            <p>
                                <strong>200 times</strong>
                            </p>
                            <p className="text-[#999999]">DATE JOIN</p>
                            <p>
                                <strong>20 November 2025</strong>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-row gap-x-10">
                        <div className="flex flex-col w-2/5 bg-white  border-1 py-1  border-gray-300 text-start gap-y-4 mt-10">
                            <div className="flex- flex-col">
                                <p className="border-b-1 border-gray-300 p-2 px-4">
                                    <strong>CHANGE PASSWORD</strong>
                                </p>
                                <div className="flex flex-col gap-2 p-4">
                                    <label htmlFor="current-password">
                                        <strong>Current Password</strong>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            id="current-password"
                                            className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
                                        />
                                        <span
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={toggleCurrentPasswordVisibility}
                                        >
                                            {showCurrentPassword ? (
                                                <IoEyeOutline size={20} />
                                            ) : (
                                                <IoEyeOffOutline size={20} />
                                            )}
                                        </span>
                                    </div>

                                    <label htmlFor="new-password">
                                        <strong>New Password</strong>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            id="new-password"
                                            className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
                                            placeholder="8+ characters"
                                        />
                                        <span
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={toggleNewPasswordVisibility}
                                        >
                                            {showNewPassword ? (
                                                <IoEyeOutline size={20} />
                                            ) : (
                                                <IoEyeOffOutline size={20} />
                                            )}
                                        </span>
                                    </div>

                                    <label htmlFor="new-password">
                                        <strong>New Password</strong>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="new-password"
                                            className="border-1 border-gray-300 rounded-lg p-2 w-full pr-10"
                                            placeholder="8+ characters"
                                        />
                                        <span
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                                            onClick={toggleConfirmPasswordVisibility}
                                        >
                                            {showConfirmPassword ? (
                                                <IoEyeOutline size={20} />
                                            ) : (
                                                <IoEyeOffOutline size={20} />
                                            )}
                                        </span>
                                    </div>

                                    <button className="bg-[#1F510F] text-white p-3 mt-4 w-1/2">
                                        <strong>CHANGE PASSWORD</strong>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col w-1/5  bg-white  border-1 py-1  border-gray-300 text-start gap-y-4 mt-10">
                            <p className="border-b-1 border-gray-300 p-2 px-4">
                                <strong>BILLING ADDRESS</strong>
                            </p>

                            <div className="space-y-2 p-2">
                                <p>
                                    <strong>{alamatUtama?.nama_alamat || "Alamat masih kosong"}</strong>
                                </p>
                                <p className="text-[#5F6C72]">
                                    {alamatUtama?.nama_kota || "Alamat masih kosong"}
                                </p>
                                <p>
                                    <strong>Street : </strong>
                                    <span className="text-[#5F6C72]">{alamatUtama?.nama_kota || "Alamat masih kosong"}</span>
                                </p>
                                <p>
                                    <strong>Postal Code : </strong>
                                    <span className="text-[#5F6C72]">
                                        {alamatUtama?.kode_pos || "Alamat masih kosong"}
                                    </span>
                                </p>
                                <button className=" text-[#1F510F] border-4 border-[#1F510F] p-3 mt-4 w-3/4">
                                    <strong>EDIT ADDRESS</strong>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-end gap-10">
                <button className=" text-red-500 border-4 border-red-500 p-3 mt-4 ">
                    <strong>NONACTIVE ACCOUNT</strong>
                </button>

                <a href="/edit_profile" className=" text-[#1F510F] border-4 border-[#1F510F] p-3 mt-4 ">
                    <strong>EDIT PROFILE</strong>
                </a>
            </div>
        </div>
    );
};

export default ProfileOrganisasi;
