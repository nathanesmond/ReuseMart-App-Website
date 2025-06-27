import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SidebarNav from "../../../Components2/SideBarNav";
import {
	fetchOrderDetailsById,
	fetchOrderHistoryById,
} from "../../../api/ApiTransaksi";
import { fetchPembeli, getAlamatUtama } from "../../../api/ApiPembeli";
import { createRating, getRating } from "../../../api/ApiRating";

interface DetailKeranjang {
	id_barang: number;
	id_pembeli: number;
	jumlah: number;
	barang: {
		id_barang: number;
		nama: string;
		harga: number;
		foto: string;
	};
}

interface Pembelian {
	id_pembelian: number;
	id_barang: number;
	id_pembeli: number;
	tanggal_lunas: string;
	total: number;
	status_pengiriman: string;
	poin_digunakan: number;
	ongkir: number;
}

interface Pembeli {
	id_pembeli: number;
	nama: string;
	email: string;
	telepon: string;
	foto: string;
	poin: number;
}

interface AlamatUtama {
	nama_alamat: string;
	nama_kota: string;
	nama_jalan: string;
	kode_pos: string;
}

interface Rating {
	id_barang: number;
	id_pembeli: number;
	rating_diberikan: number;
}

const OrderDetails = () => {
	const [profile, setProfile] = useState<Pembeli | null>(null);
	const [alamatUtama, setAlamatUtama] = useState<AlamatUtama | null>(null);
	const [pembelian, setPembelian] = useState<Pembelian | null>(null);
	const [barang, setBarang] = useState<DetailKeranjang[]>([]);
	const [rating, setRating] = useState<{ [id_barang: number]: number }>({});
	const [showModal, setShowModal] = useState(false);
	const [selectedBarangId, setSelectedBarangId] = useState<number | null>(null);
	const [tempRating, setTempRating] = useState<number>(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [konfirm, setKonfirm] = useState(false);

	const navigate = useNavigate();
	const { id } = useParams();
	const id2 = parseInt(id || "0");

	useEffect(() => {
		if (!profile?.id_pembeli) return; 
		barang.forEach((item) => {
			if (!rating[item.id_barang]) {
				getRating(item.id_barang)
					.then((response) => {
						const userRating = response.data?.find(
							(r: Rating) => r.id_pembeli === profile.id_pembeli
						);
						setRating((prev) => ({
							...prev,
							[item.id_barang]: userRating ? userRating.rating_diberikan : 0,
						}));
					})
					.catch((error) => {
						console.error(`Error fetching rating for item ${item.id_barang}:`, error);
					});
			}
		});
	}, [barang, profile]);

	const fetchHistory = async () => {
		setIsLoading(true);
		try {
			const response = await fetchOrderHistoryById(id2);
			setPembelian(response.pembelian);
		} catch (err) {
			console.error("Error fetching order history:", err);
			toast.error("Failed to fetch order history.");
		} finally {
			setIsLoading(false);
		}
	};

	const fetchProfile = async () => {
		try {
			const response = await fetchPembeli();
			setProfile(response);
		} catch (error) {
			console.error("Error fetching profile:", error);
			toast.error("Failed to fetch profile.");
		}
	};

	const fetchAlamatUtama = async () => {
		try {
			const response = await getAlamatUtama();
			setAlamatUtama(response.alamatUtama);
		} catch (error) {
			console.error("Error fetching address:", error);
			toast.error("Failed to fetch address.");
		}
	};

	const fetchOrderDetails = async () => {
		try {
			const response = await fetchOrderDetailsById(id2);
			setBarang(response.items);
		} catch (error) {
			console.error("Error fetching order details:", error);
			toast.error("Failed to fetch order details.");
		}
	};

	useEffect(() => {
		fetchHistory();
		fetchProfile();
		fetchAlamatUtama();
		fetchOrderDetails();
	}, [id2]);

	const handleSubmitRating = async () => {
		if (selectedBarangId === null || !profile?.id_pembeli || tempRating === 0) {
			toast.error("Please select a rating.");
			return;
		}

		setIsSubmitting(true);
		try {
			await createRating({
				id_barang: selectedBarangId,
				id_pembeli: profile.id_pembeli,
				rating_diberikan: tempRating,
			});
			setRating((prev) => ({
				...prev,
				[selectedBarangId]: tempRating,
			}));
			toast.success("Rating submitted successfully!");
			setShowModal(false);
			setSelectedBarangId(null);
			setTempRating(0);
		} catch (error) {
			console.error("Error submitting rating:", error);
			toast.error("Failed to submit rating.");
		} finally {
			setIsSubmitting(false);
			setKonfirm(false);
			setTempRating(0);
		}
	};

	return (
		<div className="h-full px-10 py-5">
			<ToastContainer position="top-right" autoClose={3000} />
			<div className="mt-5 max-sm:mt-0">
				<ol className="inline-flex items-center space-x-1 md:space-x-3">
					<li className="inline-flex items-center">
						<a
							href="/"
							className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-green-300"
						>
							<FontAwesomeIcon className="text-gray-500 text-sm" icon={faHouse} />
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
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
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
									fillRule="evenodd"
									d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
									clipRule="evenodd"
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
				<SidebarNav />
				<div className="flex flex-col w-full min-h-[500px] mt-5 border border-gray-300 rounded-lg">
					<div className="flex items-center w-full justify-between">
						<div className="flex items-center">
							<p className="text-2xl font-bold ml-8 mt-5">Order Details</p>
						</div>
						<p
							className="text-lg font-semibold text-[#00B207] mr-8 mt-5 hover:underline cursor-pointer"
							onClick={() => navigate("/order")}
						>
							Back to List
						</p>
					</div>

					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<p>Loading...</p>
						</div>
					) : (
						<>
							<div className="flex gap-4">
								<div className="flex flex-col w-full max-w-[400px] mt-5 p-4 m-4 border border-gray-300 rounded-lg">
									<p className="text-md font-semibold text-[#999999]">
										BILLING ADDRESS
									</p>
									<hr className="-mx-4 my-2 border-t border-gray-300" />
									<p className="text-lg font-semibold">{profile?.nama || "N/A"}</p>
									<p className="text-[#999999]">
										{alamatUtama
											? `${alamatUtama.nama_alamat}, ${alamatUtama.nama_kota}, ${alamatUtama.nama_jalan} ${alamatUtama.kode_pos}`
											: "No address available"}
									</p>
									<p className="mt-20 font-semibold text-xs text-[#999999]">EMAIL</p>
									<p>{profile?.email || "N/A"}</p>
									<p className="mt-2 font-semibold text-xs text-[#999999]">PHONE</p>
									<p>{profile?.telepon || "N/A"}</p>
								</div>
								<div className="flex flex-col w-full max-w-[350px] mt-5 p-4 m-4 border border-gray-300 rounded-lg">
									<div className="flex items-center justify-between">
										<p className="text-md font-semibold text-[#999999]">ORDER ID:</p>
										<div className="flex items-center gap-2">
											<div className="w-px h-5 bg-gray-300" />
											<p className="text-md font-semibold">
												{pembelian?.id_pembelian || "N/A"}
											</p>
										</div>
									</div>
									<hr className="my-2 border-t border-gray-300" />
									<div className="flex justify-between">
										<p className="text-md font-semibold text-[#999999]">Subtotal:</p>
										<p className="text-md">
											Rp {pembelian?.total?.toLocaleString("id-ID") || 0}
										</p>
									</div>
									<hr className="my-2 border-t border-gray-300" />
									<div className="flex justify-between">
										<p className="text-md font-semibold text-[#999999]">Point:</p>
										<p className="text-md">{pembelian?.poin_digunakan || 0}</p>
									</div>
									<hr className="my-2 border-t border-gray-300" />
									<div className="flex justify-between">
										<p className="text-md font-semibold text-[#999999]">Shipping:</p>
										<p className="text-md">
											Rp {pembelian?.ongkir?.toLocaleString("id-ID") || 0}
										</p>
									</div>
									<hr className="my-2 border-t border-gray-300" />
									<div className="flex justify-between">
										<p className="text-md font-semibold text-[#999999]">Total:</p>
										<p className="text-md text-green-500">
											Rp{" "}
											{((pembelian?.total || 0) + (pembelian?.ongkir || 0)).toLocaleString(
												"id-ID"
											)}
										</p>
									</div>
								</div>
							</div>

							<table className="w-full mt-5 mb-5 border border-gray-200">
								<thead>
									<tr className="bg-[#F2F2F2] text-sm text-gray-600">
										<th className="px-4 py-3 text-center border">IMAGE</th>
										<th className="px-4 py-3 text-center border">PRODUCT</th>
										<th className="px-4 py-3 text-center border">TOTAL</th>
										<th className="px-4 py-3 text-center border">RATING</th>
									</tr>
								</thead>
								<tbody>
									{barang.length > 0 ? (
										barang.map((item) => (
											<tr
												key={item.id_barang}
												className="text-center border-b hover:bg-gray-50"
											>
												<td className="px-4 py-3 flex items-center gap-4 justify-center">
													<img
														src={item.barang?.foto || ""}
														alt={item.barang?.nama || "Product"}
														className="w-16 h-16 object-cover rounded-md"
													/>
												</td>
												<td className="px-4 py-3">{item.barang?.nama || "N/A"}</td>
												<td className="px-4 py-3">
													Rp {item.barang?.harga?.toLocaleString("id-ID") || 0}
												</td>
												<td className="px-4 py-3">
													{rating[item.id_barang] != null ? (
														<span>
															{Array.from({ length: 5 }).map((_, i) => {
																const rate = rating[item.id_barang];
																let starColor = "#E0E0E0";
																let starChar = "★";
																if (rate >= i + 1) {
																	starColor = "#FFD700";
																} else if (rate > i && rate < i + 1) {
																	starColor = "#FFD700";
																	starChar = "⯪";
																}
																return (
																	<span key={i} style={{ color: starColor }}>
																		{starChar}
																	</span>
																);
															})}
														</span>
													) : pembelian?.status_pengiriman === "selesai" ? (
														<button
															className="ml-2 px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
															onClick={() => {
																setShowModal(true);
																setSelectedBarangId(item.id_barang);
																setTempRating(0);
															}}
														>
															Add Rating
														</button>
													): (
														<span className="text-xs text-gray-400">Rating available after order is completed</span>
													)}
												</td>
											</tr>
										))
									) : (
										<tr>
											<td colSpan={4} className="py-4 text-center">
												No items found.
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</>
					)}
				</div>
			</div>

			{showModal && selectedBarangId !== null && (
				<div className="fixed inset-0 flex items-center justify-center z-50 ">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h2 className="text-lg font-semibold mb-4">Add Rating</h2>
						<p className="mb-4">Please select a rating for the product.</p>
						<div className="flex gap-2 justify-center">
							{Array.from({ length: 5 }).map((_, i) => (
								<button
									key={i}
									className={`p-2 rounded-full transition-colors ${tempRating >= i + 1 ? "bg-yellow-200" : "bg-gray-300 hover:bg-gray-400"
										}`}
									onClick={() => setTempRating(i + 1)}
								>
									<span className="text-xl">★</span>
								</button>
							))}
						</div>
						<div className="mt-6 flex justify-end gap-2">
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
								onClick={() => {
									setShowModal(false);
									setTempRating(0);
								}}
								disabled={isSubmitting}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								onClick={() => {
									setKonfirm(true);
									setShowModal(false);
								}}
							>
								{isSubmitting ? "Submitting..." : "Submit"}
							</button>
						</div>
					</div>
				</div>
			)}
			{konfirm && (
				<div className="fixed inset-0 flex items-center justify-center z-50 ">
					<div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
						<h2 className="text-lg font-semibold mb-4">Confirmation</h2>
						<p className="mb-4">Are you sure you want to confirm this rate?</p>
						<div className="mt-6 flex justify-end gap-2">
							<button
								className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
								onClick={() => {
									setKonfirm(false);
									setSelectedBarangId(null);
									setShowModal(false);
								}}
							>
								Cancel
							</button>
							<button
								className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								onClick={handleSubmitRating}
								disabled={isSubmitting}
							>
								{isSubmitting ? "Submitting..." : "Submit"}
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default OrderDetails;