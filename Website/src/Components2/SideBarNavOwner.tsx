import { MdDashboard } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { HiDocumentReport } from "react-icons/hi";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import { Logout } from "../api/apiAuth";
import { toast } from "react-toastify";

const SidebarNavOwner = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const navItems = [
        { label: "Donation", icon: <MdDashboard />, path: "/owner/donasi" },
        { label: "History Donation", icon: <FaArrowsRotate />, path: "/owner/history" },
        { label: "Laporan Penitip", icon: <FaArrowsRotate />, path: "/owner/penitip" },
        { label: "Laporan", icon: <HiDocumentReport />, path: "/owner/laporan" },
    ];

    const handleLogout = () => {
        Logout()
            .then((response) => {
                sessionStorage.removeItem("token");
                toast.success("Logout successful!");
                navigate("/");
            })
            .catch((error) => {
                console.error("Logout failed:", error);
            });
    };

    return (
        <div className="flex flex-col w-2/6 max-w-[300px] border border-gray-300 rounded-lg bg-white py-5 pe-10 mt-5 min-h-[500px]">
            <h3 className="px-4 mb-2">
                <strong>Navigation</strong>
            </h3>
            {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                    <div
                        key={index}
                        onClick={() => navigate(item.path)}
                        className={`flex items-center gap-2 p-4 cursor-pointer transition-colors ${isActive
                            ? "bg-[#E6E6E6] border-l-4 border-green-700 text-black"
                            : "text-gray-500 hover:bg-[#E6E6E6]"
                            }`}
                    >
                        {item.icon}
                        <p>{item.label}</p>
                    </div>
                );
            })}
            <button
                className={`flex items-center gap-2 p-4 cursor-pointer transition-colors hover:bg-[#E6E6E6] text-gray-500`}
                onClick={handleLogout}
            >
                <RiLogoutBoxRLine />
                <p>LogOut</p>
            </button>
        </div>
    );
};

export default SidebarNavOwner;