import { useEffect, useState } from 'react';
import logo from '../assets/images/LOGO.png';
import Freiren from '../assets/images/Frieren.jpg';
import noprofile from '../assets/images/noprofile.jpg';
import { useLocation, useNavigate } from 'react-router-dom';
import { FetchSearchBarang } from '../api/ApiBarang';
import useAxios from '../api/index';

const Header = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [role, setRole] = useState<string | null>(null);
    const [isRoleLoading, setIsRoleLoading] = useState(true);

    const handleShopClick = () => {
        if (location.pathname === "/shop") {
            navigate("/shop", { state: { refresh: Date.now() } });
        } else {
            navigate("/shop");
        }
    };

    const searchBarang = (query: string) => {
        setIsLoading(true);
        if (query.trim() === "") {
            setIsLoading(false);
            navigate("/shop")
            return;
        }
        FetchSearchBarang(query)
            .then(() => {
                setIsLoading(false);
                setSearchTerm("");
                navigate(`/shop?search=${encodeURIComponent(query)}`)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        const fetchRole = async () => {
            try {
                const response = await useAxios.get("/cekRole", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                    },
                });
                setRole(response.data.role);
            } catch (error: any) {
                console.error("Error fetching role:", error);
            }
        };

        fetchRole();
    }, []);


    // Roles that should NOT see nav options or search
    const isPrivileged = role === 'Admin' || role === 'Organisasi' || role === 'CS' || role === 'Gudang' || role === 'Owner'

    return (
        <header className='sticky w-full top-0 z-50'>
            <div className="bg-[#1F510F] text-white flex  items-center h-20 px-8">
                {!isPrivileged && (
                    <>
                        <div className="flex items-center font-semibold space-x-4 h-full ml-6">
                            <a
                                className="hover:bg-white hover:text-black h-full px-6 flex items-center justify-center"
                                href="/"
                            >
                                Home
                            </a>
                            <button
                                onClick={handleShopClick}
                                className='hover:bg-white hover:text-black h-[80px] w-[150px] max-w-[100px] justify-center flex items-center'
                            >
                                Shop
                            </button>
                            <a
                                className="hover:bg-white hover:text-black h-full px-6 flex items-center justify-center"
                                href="#"
                            >
                                Merch
                            </a>
                            <a
                                className="hover:bg-white hover:text-black h-full px-6 flex items-center justify-center"
                                href="/about"
                            >
                                About
                            </a>
                        </div>
                        <div className="flex items-center max-w-md w-full ml-50">
                            <div className="w-2/3 bg-white text-black rounded-l p-1">
                                <input
                                    type="text"
                                    className="w-full h-full rounded-l-sm px-4 focus:outline-none"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                            searchBarang(searchTerm);
                                        }
                                    }}
                                />
                            </div>
                            <button className=' bg-[#F5CB58] font-semibold items-center flex rounded-r-sm px-4 p-1 hover:bg-[#31442c] text-white'
                                onClick={() => searchBarang(searchTerm)}
                            >
                                Search
                            </button>
                        </div>
                    </>
                )}



                <div className="flex items-center gap-4 font-semibold ml-auto">
                    {role ? (
                        <>
                            {role === 'Admin' && (
                                <a
                                    href="/admin/organisasi"
                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                                >
                                    <img src={noprofile} alt="Profile" className="w-full h-full object-cover" />
                                </a>
                            )}
                            {role === 'Organisasi' && (
                                <a
                                    href="/profile-organisasi"
                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                                >
                                    <img src={Freiren} alt="Profile" className="w-full h-full object-cover" />
                                </a>
                            )}
                            {role === 'Owner' && (
                                <a
                                    href="/owner/donasi"
                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                                >
                                    <img src={Freiren} alt="Profile" className="w-full h-full object-cover" />
                                </a>
                            )}
                            {role === 'CS' && (
                                <a
                                    href="/cs/penitip"
                                    className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                                >
                                    <img src={Freiren} alt="Profile" className="w-full h-full object-cover" />
                                </a>
                            )}{role === 'Pembeli' && (
                                <>
                                    <a href="/cart" className="bg-gray-500 py-2 px-4 rounded-md">
                                        Cart
                                    </a>

                                    <a
                                        href="/profile"
                                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                                    >
                                        <img src={Freiren} alt="Profile" className="w-full h-full object-cover" />
                                    </a>
                                </>
                            )}{role === 'Penitip' && (
                                <>
                                    <a href="/cart" className="bg-gray-500 py-2 px-4 rounded-md">
                                        Cart
                                    </a>

                                    <a
                                        href="/penitip/profile"
                                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                                    >
                                        <img src={Freiren} alt="Profile" className="w-full h-full object-cover" />
                                    </a>
                                </>
                            )}{role === 'Gudang' && (
                                <>

                                    <a
                                        href="/gudang/manage"
                                        className="w-12 h-12 rounded-full overflow-hidden border-2 border-white"
                                    >
                                        <img src={Freiren} alt="Profile" className="w-full h-full object-cover" />
                                    </a>
                                </>
                            )}
                        </>
                    ) : (
                        <a href="/login" className="py-2 px-4 rounded-md hover:underline">
                            Login / Register
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
