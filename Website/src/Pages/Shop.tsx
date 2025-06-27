import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faHouse, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { Button } from '../components/ui/button';
import { FetchBarang, FetchBarangById, FetchBarangByKategori, FetchBarangIsGaransi, FetchBarangIsNotGaransi, FetchSearchBarang, getPenitip } from '../api/ApiBarang';


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

const Shop = () => {
    const [allData, setAllData] = useState([]);
    const [selectedKategori, setSelectedKategori] = useState<string | null>(null);
    const [selectedWarranty, setSelectedWarranty] = useState<boolean | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<Barang[]>([]);
    const navigate = useNavigate();
    const [penitip, setPenitip] = useState<{ [id_barang: number]: string }>({});
    const [rating, setRating] = useState<{ [id_barang: number]: string }>({});
    const namaKategori = (id_kategori: string) => {
        if (parseInt(id_kategori) >= 0 && parseInt(id_kategori) < 11) {
            return "Electronic & Gadget";
        } else if (parseInt(id_kategori) >= 11 && parseInt(id_kategori) < 21) {
            return "Clothing & Accessories";
        } else if (parseInt(id_kategori) >= 21 && parseInt(id_kategori) < 31) {
            return "Home Furnishings";
        }
        else if (parseInt(id_kategori) >= 31 && parseInt(id_kategori) < 41) {
            return "Books & School Supplies";
        }
        else if (parseInt(id_kategori) >= 41 && parseInt(id_kategori) < 51) {
            return "Hobbies & Collectibles";
        }
        else if (parseInt(id_kategori) >= 51 && parseInt(id_kategori) < 61) {
            return "Baby & Kids Equipment";
        } else if (parseInt(id_kategori) >= 61 && parseInt(id_kategori) < 71) {
            return "Automotive";
        } else if (parseInt(id_kategori) >= 71 && parseInt(id_kategori) < 81) {
            return "Garden & Outdoor Supplies";
        } else if (parseInt(id_kategori) >= 81 && parseInt(id_kategori) < 91) {
            return "Office & Industrial Equipment";
        } else if (parseInt(id_kategori) >= 91 && parseInt(id_kategori) < 101) {
            return "Cosmetics & Personal Care";
        }
    }

    const resetFilters = () => {
        setSelectedKategori(null);
        setSelectedWarranty(null);
        setSelectedPrice(null);
        setWarranty(null);
        setSearchTerm("");
    };

    const handleSearch = async (query: string) => {
        if (query.trim() === "") {
            setData(allData);
            return;
        }
        setIsLoading(true);
        try {
            const response = await FetchSearchBarang(query);
            setData(response.data);
            setSearchTerm("");
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApplyFilter = async () => {
        setIsLoading(true);
        try {
            let filteredData: Barang[] = [...allData];

            if (!selectedKategori && selectedWarranty === null && !selectedPrice) {
                setData(allData);
                return;
            }

            if (selectedKategori !== null) {
                const response = await FetchBarangByKategori(selectedKategori);
                filteredData = response.data;
            }

            if (selectedWarranty !== null) {
                const response = selectedWarranty
                    ? await FetchBarangIsGaransi()
                    : await FetchBarangIsNotGaransi();

                filteredData = filteredData.filter(item =>
                    response.data.some((filteredItem: { id_barang: number; }) => filteredItem.id_barang === item.id_barang)
                );
            }

            if (selectedPrice) {
                filteredData = filteredData.filter((item: Barang) => {
                    const harga = item.harga;
                    if (selectedPrice === "price-1") return harga <= 50000;
                    if (selectedPrice === "price-2") return harga > 50000 && harga <= 100000;
                    if (selectedPrice === "price-3") return harga > 100000 && harga <= 500000;
                    if (selectedPrice === "price-4") return harga > 500000;
                    return true;
                });
            }

            setData(filteredData);
        } catch (err) {
            console.error("Error saat apply filter:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBarangById = (id_barang: number) => {
        setIsLoading(true);
        FetchBarangById(id_barang)
            .then((response) => {
                const barang = response.data;
                setIsLoading(false);
                navigate('/item', { state: { barang } });
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const fetchBarang = () => {

        setIsLoading(true);
        FetchBarang()
            .then((response) => {
                setData(response.data);
                setAllData(response.data);
                setIsLoading(false);
                console.log("Data fetched:", response.data);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const location = useLocation();

    const fetchdariHome = (id_kategori: string) => {
        setIsLoading(true);
        FetchBarangByKategori(id_kategori)
            .then((response) => {
                setData(response.data);
                setAllData(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        data.forEach((item) => {
            if (!penitip[item.id_barang]) {
                getPenitip(item.id_barang).then((res) => {
                    setPenitip((prev) => ({
                        ...prev,
                        [item.id_barang]: res.data?.nama || "Penitip"
                    }));
                });
            }
        });
    }, [data]);

    useEffect(() => {
        data.forEach((item) => {
            if (!rating[item.id_barang]) {
                getPenitip(item.id_barang).then((res) => {
                    setRating((prev) => ({
                        ...prev,
                        [item.id_barang]: res.data?.total_rating || "Rating"
                    }));
                });
            }
        });
    }, [data]);


    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");

        if (location.state?.selectedKategori) {
            console.log("Selected Kategori di ShopPage:", location.state.selectedKategori);
            setSelectedKategori(location.state.selectedKategori);
            fetchdariHome(location.state.selectedKategori);
        } else if (location.pathname == "/shop") {
            resetFilters();
            fetchBarang();
        }

        if (searchQuery) {
            setSearchTerm(searchQuery);
            handleSearch(searchQuery);
        }

    }, [location.state?.refresh, location.pathname, location.search, location.state]);


    const [warranty, setWarranty] = useState<boolean | null>(null);
    return (
        <div className='flex flex-col h-full bg-white p-12'>
            <div className="flex items-center gap-2">
                <FontAwesomeIcon className="text-gray-500 text-sm" icon={faHouse} />
                <FontAwesomeIcon className="text-gray-500 text-sm font-extralight" icon={faChevronRight} />
                <p className="text-sm font-bold text-green-500">Shop</p>
            </div>

            <div className='flex mt-4 gap-8'>
                <div className='flex flex-col w-1/5 h-full bg-white rounded-lg p-4 border-1 border-gray-300'>
                    <p className='self-center text-xl text-black font-bold mt-2 mb-4'>Filters</p>
                    <hr className="my-2 border-t  w-[95%] border-gray-300" />
                    <p className='self-start text-xl text-black font-bold'>Category</p>
                    <RadioGroup className='mt-4 mb-4 font-bold' value={selectedKategori ?? ""} onValueChange={(value) => setSelectedKategori(value)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="option-one" />
                            <Label htmlFor="option-one">Electronic & Gadget</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="1" id="option-two" />
                            <Label htmlFor="option-two">Clothing & Accessories</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="2" id="option-3" />
                            <Label htmlFor="option-3">Home Furnishings</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="3" id="option-4" />
                            <Label htmlFor="option-4">Books & School Supplies</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="4" id="option-5" />
                            <Label htmlFor="option-5">Hobbies & Collectibles</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="5" id="option-6" />
                            <Label htmlFor="option-6">Baby & Kids Equipment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="6" id="option-7" />
                            <Label htmlFor="option-7">Automotive</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="7" id="option-8" />
                            <Label htmlFor="option-8">Garden & Outdoor Supplies</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="8" id="option-9" />
                            <Label htmlFor="option-9">Office & Industrial Equipment</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="9" id="option-10" />
                            <Label htmlFor="option-10">Cosmetics & Personal Care</Label>
                        </div>
                    </RadioGroup>
                    <hr className="my-2 border-t  w-[95%] border-gray-300" />
                    <p className='self-start text-xl text-black font-bold'>Warranty</p>
                    <div className='flex gap-4 mt-2'>

                        <Button onClick={() => {
                            setWarranty(true);
                            setSelectedWarranty(true);
                        }}
                            className={`w-28 rounded-lg ${warranty === true ? 'bg-[#1F510F] text-white' : warranty === null ? 'bg-[#F0F0F0] text-black hover:text-white' : 'bg-[#F0F0F0] text-black hover:text-white'}`}>                            Yes
                        </Button>
                        <Button onClick={() => {
                            setWarranty(false);
                            setSelectedWarranty(false);
                        }}
                            className={`w-28 rounded-lg ${warranty === true ? 'bg-[#F0F0F0] text-white' : warranty === null ? 'bg-[#F0F0F0] text-black hover:text-white' : 'bg-[#1F510F] text-white hover:text-white'}`}>                            No
                        </Button>
                    </div>
                    <p className='self-start text-xl text-black font-bold mt-2'>Harga</p>
                    <RadioGroup className='mt-4 mb-4 font-bold' value={selectedPrice ?? ""} onValueChange={(value) => setSelectedPrice(value)}>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="price-1" id="option-price-1" />
                            <Label htmlFor="option-price-1">Hingga Rp 50.000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="price-2" id="option-price-2" />
                            <Label htmlFor="option-price-2">Rp 50.000 - Rp 100.000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="price-3" id="option-price-3" />
                            <Label htmlFor="option-price-3">Rp 100.000 - Rp 500.000</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="price-4" id="option-price-4" />
                            <Label htmlFor="option-price-4">Diatas Rp 500.000</Label>
                        </div>
                    </RadioGroup>
                    <hr className="my-2 border-t  w-[95%] border-gray-300" />
                    <Button className='mt-4 rounded-lg bg-[#1F510F] hover:bg-[#F0F0F0] hover:text-black text-white' onClick={handleApplyFilter}>Apply</Button>
                    <Button className='mt-4 rounded-lg bg-[#1F510F] hover:bg-[#F0F0F0] hover:text-black text-white' onClick={() => {
                        resetFilters();
                        fetchBarang();
                    }} >Reset</Button>
                </div>
                <div className="flex flex-col w-4/5">
                    <div className="relative w-full">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        />
                        <input
                            type="text"
                            className="w-full h-10 bg-[#F0F0F0] rounded-4xl pl-10 pr-4 py-2 focus:outline-none"
                            placeholder="Search Products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch(searchTerm);
                                }
                            }}
                        />
                    </div>
                    <div className='h-full mt-8'>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-6">
                            {data.map((item: any, index: React.Key) => (
                                <div
                                    key={index}
                                    onClick={() => fetchBarangById(item.id_barang)}
                                    className="w-64 h-72 bg-white p-4 shadow-md rounded-lg border flex flex-col items-start hover:scale-105 transition-transform"
                                >
                                    <img src={item.foto} alt={item.name || item.nama} className="h-[60%] w-full object-contain" />
                                    <p className='mt-2 font-light text-gray-400 text-xs'>
                                        {namaKategori(item.id_kategori)}
                                    </p>
                                    <p className="mt-2 font-normal break-words whitespace-normal ">
                                        {item.nama}
                                    </p>
                                    <p className='font-bold text-green-900 text-md'>
                                        Rp {item.harga}
                                    </p>
                                    <div className='flex flex-row gap-2'>
                                        <p className='mt-2 font-light text-gray-400 text-xs'>
                                            {rating[item.id_barang]
                                                ? (
                                                    <span>
                                                        {Array.from({ length: 5 }).map((_, i) => {
                                                            const rate = Number(rating[item.id_barang]);
                                                            let starColor = '#E0E0E0';
                                                            let starChar = '★';
                                                            if (rate >= i + 1) {
                                                                starColor = '#FFD700';
                                                            } else if (rate > i && rate < i + 1) {
                                                                starColor = '#FFD700';
                                                                starChar = '⯪';
                                                            }
                                                            return (
                                                                <span key={i} style={{ color: starColor }}>
                                                                    {starChar}
                                                                </span>
                                                            );
                                                        })}
                                                        <span className="ml-1 text-xs text-gray-500">({rating[item.id_barang]})</span>
                                                    </span>
                                                )
                                                : "Rating"}
                                        </p>
                                        <p className='mt-2 font-light text-gray-400 text-xs'>•</p>
                                        <p className='mt-2 font-light text-gray-400 text-xs'>
                                            {penitip[item.id_barang] || "Memuat..."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {data.length === 0 && (
                            <div className="w-full h-72 flex items-center justify-center">
                                <p className="text-gray-500">No items found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Shop;