import { faChevronRight, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import { FetchBarangById, FetchRelatedProducts, getPenitip } from "../api/ApiBarang";
import { FetchDiskusi, AddDiskusi } from "../api/ApiDiskusi";
import { getToken } from "../api/ApiPembeli";
import nopic from "../assets/images/noprofile.jpg";
import { toast } from "react-toastify";
import { AddKeranjang } from "../api/ApiKeranjang";
import { SyncLoader } from "react-spinners";
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
type Diskusi = {
	pesan: string;
	nama: string;
	tanggal: string;
	role: string;
	foto: string;
};

const Item = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const barang = location.state?.barang || null;
	const [isLoading, setIsLoading] = useState(false);
	const [isLoadingKeranjang, setIsLoadingKeranjang] = useState(false);
	const [data, setData] = useState<Barang[]>([]);
	const [diskusi, setDiskusi] = useState<Diskusi[]>([]);
	const [token, setToken] = useState<string | null>(null);
	const [pesan, setPesan] = useState<string>("");
    const [penitip, setPenitip] = useState<{ [id_barang: number]: string }>({});
	const [rating, setRating] = useState<{ [id_barang: number]: string }>({});

	const addDiskusi = (id_barang: number) => {
		if (!pesan) {
			toast.error("Please enter a message");
			return;
		}
		setIsLoading(true);

		AddDiskusi(pesan, id_barang)
			.then(() => {
				setIsLoading(false);
				toast.success("Comment added successfully");
				fetchDiskusi(id_barang);
				setPesan("");
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const addKeranjang = (id_barang: number) => {
		setIsLoadingKeranjang(true);
		AddKeranjang(id_barang)
			.then((data) => {
				toast.success(data.message || "Product added to cart successfully");
			})
			.catch((err) => {
				toast.error(err);
			})
			.finally(() => {
				setIsLoadingKeranjang(false);
			});
	};

	const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setPesan(event.target.value);
	};

	const fetchDiskusi = (id_barang: number) => {
		setIsLoading(true);
		FetchDiskusi(id_barang)
			.then((response) => {
				setDiskusi(response.diskusi);
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const fetchBarangById = (id_barang: number) => {
		setIsLoading(true);
		FetchBarangById(id_barang)
			.then((response) => {
				const barang = response.data;
				setIsLoading(false);
				navigate("/item", { state: { barang } });
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

	const namaGaransi = (akhir_garansi: Date) => {
		const currentDate = new Date();
		const endDate = new Date(akhir_garansi);
		const daysDiff = Math.ceil(
			(endDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
		);
		if (daysDiff > 0) return `${daysDiff} days left`;
		if (daysDiff === 0) return "Warranty expired today";
		return "Warranty expired";
	};

	const namaKategori = (id_kategori: string) => {
		const id = parseInt(id_kategori);
		if (id < 11) return "Electronic & Gadget";
		if (id < 21) return "Clothing & Accessories";
		if (id < 31) return "Home Furnishings";
		if (id < 41) return "Books & School Supplies";
		if (id < 51) return "Hobbies & Collectibles";
		if (id < 61) return "Baby & Kids Equipment";
		if (id < 71) return "Automotive";
		if (id < 81) return "Garden & Outdoor Supplies";
		if (id < 91) return "Office & Industrial Equipment";
		return "Cosmetics & Personal Care";
	};

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

	const fetchRelatedProducts = (id_kategori: string) => {
		setIsLoading(true);
		FetchRelatedProducts(id_kategori)
			.then((response) => {
				if (
					response.data &&
					typeof response.data === "object" &&
					!Array.isArray(response.data)
				) {
					setData(Object.values(response.data));
				} else if (Array.isArray(response.data)) {
					setData(response.data);
				} else {
					setData([]);
					console.warn("Expected array but got:", response.data);
				}
				setIsLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
				setData([]);
			});
	};

	useEffect(() => {
		fetchRelatedProducts(barang.id_kategori);
		fetchDiskusi(barang.id_barang);
		setToken(getToken());
	}, []);

	return (
		<div className="flex flex-col h-full bg-white p-6 md:p-12">
			<div className="flex flex-wrap items-center gap-2 text-sm">
				<FontAwesomeIcon className="text-gray-500" icon={faHouse} />
				<FontAwesomeIcon className="text-gray-500" icon={faChevronRight} />
				<p className="font-bold text-gray-500">Shop</p>
				<FontAwesomeIcon className="text-gray-500" icon={faChevronRight} />
				<p className="font-bold text-green-500">Detail Product</p>
			</div>

			<div className="flex flex-col lg:flex-row mt-4 gap-6 lg:gap-12 max-h-[500px]">
				<div className="w-full lg:w-1/3 h-96 lg:h-[400px] bg-gray-500">
					<img
						src={barang.foto}
						alt={barang.nama}
						className="w-full h-full object-cover rounded-lg  "
					/>
				</div>

				<div className="flex flex-col w-full lg:w-1/2 h-auto lg:h-[600px]">
					<p className="text-2xl md:text-3xl font-semibold text-black">
						{barang.nama}
					</p>
					<div className="flex flex-wrap gap-4 mt-2 text-sm">
						<p className="font-bold">
							Barang Id :{" "}
							<span className="text-gray-600">{barang.id_barang}</span>
						</p>
					</div>
					<p className="text-xl md:text-2xl font-bold text-green-600 mt-2">
						Rp {barang.harga}
					</p>
					<div className="flex items-center gap-2 mt-2 text-xs font-light text-gray-400">
						<p>
							{rating[barang.id_barang] ? (
								<span>
									{Array.from({ length: 5 }).map((_, i) => {
										const rate = Number(rating[barang.id_barang]);
										let starColor = "#E0E0E0";
										let starChar = "★";
										if (rate >= i + 1) {
											starColor = "#FFD700";
										} else if (rate > i && rate < i + 1) {
											starColor = "#FFD700";
											starChar = "⯪";
										}
										return (
											<span key={i} style={{ color: starColor, fontSize: "1rem" }}>
												{starChar}
											</span>
										);
									})}
									<span className="ml-1 text-[1rem] text-gray-500">
										({rating[barang.id_barang]})
									</span>
								</span>
							) : (
								"Rating"
							)}
						</p>
						<span>•</span>
						<p className="text-[1rem]">{penitip[barang.id_barang] || "Memuat..."}</p>
					</div>
					<hr className="my-2 border-t w-full border-gray-300" />
					<p className="text-md font-semibold">Description :</p>
					<p className="text-sm text-gray-500 break-words whitespace-normal">
						{barang.deskripsi}
					</p>
					<hr className="my-2 border-t w-full border-gray-300" />
					<div className="flex flex-col sm:flex-row gap-4 mt-4 mb-4 justify-center">
                        <Button
                            className="w-full sm:w-[45%] h-10 bg-black hover:bg-gray-100 hover:text-black text-white border border-black"
                            onClick={() => addKeranjang(barang.id_barang)}
                        >
                            {isLoadingKeranjang ? (
                                <span>
                                    <SyncLoader size={10} color="#22c55e" /> {/* Use a green color for visibility on both black and white backgrounds */}
                                </span>
                            ) : (
                                <span> Add to Cart </span>
                            )}
						</Button>
						<Button className="w-full sm:w-[45%] h-10 bg-gray-100 hover:bg-black hover:text-white text-black border border-black">
							Buy Now
						</Button>
					</div>
					<hr className="my-2 border-t w-full border-gray-300" />
					<p className="text-sm font-bold">
						Category:{" "}
						<span className="text-sm font-normal text-gray-500">
							{namaKategori(barang.id_kategori)}
						</span>
					</p>
					<p className="text-sm font-bold">
						Warranty:{" "}
						<span className="text-sm font-normal text-gray-500">
							{namaGaransi(barang.akhir_garansi)}
						</span>
					</p>
				</div>
			</div>

			<div className="flex flex-col w-full items-center">
				<p className="text-2xl md:text-3xl font-semibold text-black mb-6">
					Related Products
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
					{Array.isArray(data) && data.length > 0 ? (
						data.map((item, index) => (
							<div
								key={index}
								onClick={() => fetchBarangById(item.id_barang)}
								className="w-full sm:w-48 h-72 bg-white p-4 shadow-md rounded-lg border flex flex-col hover:scale-105 transition-transform cursor-pointer"
							>
								<img
									src={item.foto}
									alt={item.nama}
									className="h-[60%] w-full object-contain"
								/>
								<p className="mt-2 text-xs text-gray-400">{item.berat}</p>
								<p className="mt-2 text-sm break-words whitespace-normal">
									{item.nama}
								</p>
								<p className="font-bold text-green-900 text-md">
									Rp {item.harga}
								</p>
							</div>
						))
					) : (
						<p>No related products found.</p>
					)}
				</div>
			</div>

			<div className="flex flex-col w-full mt-12 border border-gray-300 p-4 rounded-lg">
				<p className="text-xl font-semibold text-black">Add Discussion</p>
				<hr className="my-2 border-t w-full border-gray-300" />
				<div className="grid w-full gap-1.5">
					<Label htmlFor="message">Your message</Label>
					<Textarea
						id="message"
						className="h-20"
						placeholder="Type your comment here."
						onChange={handleChange}
						value={pesan}
					/>
				</div>
				<Button
					className={`rounded-md mt-4 mb-4 ${
						!token
							? "bg-gray-300 text-gray-500 cursor-not-allowed"
							: "bg-black hover:bg-gray-100 hover:text-black text-white border border-black"
					}`}
					onClick={() => {
						if (token) addDiskusi(barang.id_barang);
						else toast.error("Please login to add a comment");
					}}
					disabled={!token}
				>
					Add Comment
				</Button>
				<hr className="my-2 border-t w-full border-gray-300" />
				<div className="flex flex-col gap-8 mt-4 ml-0 sm:ml-8">
					{diskusi.map((data, index) => (
						<div className="flex gap-4 items-center" key={index}>
							<img
								className="rounded-full w-12 h-12 bg-gray-500"
								src={nopic}
								alt=""
							/>
							<div className="flex flex-col w-full">
								<p className="font-bold text-black">
									{data.nama}
									<span className="ml-4 text-xs text-gray-500 font-normal">
										{data.role === "CS" && (
											<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-sm">
												Customer Service
											</span>
										)}{" "}
										{new Date(data.tanggal).toLocaleString("id-ID", {
											weekday: "long",
											year: "numeric",
											month: "long",
											day: "numeric",
											hour: "2-digit",
											minute: "2-digit",
										})}
									</span>
								</p>
								<p className="break-words whitespace-normal">{data.pesan}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Item;
