import { faChevronRight, faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
// import { Button } from "flowbite-react";

import { FetchKeranjangByPembeli } from "../../api/ApiKeranjang";
import { FaLocationDot } from "react-icons/fa6";
import { getAlamatUtama } from "../../api/ApiPembeli";
import { ModalGantiAlamat } from "./ModalGantiAlamat";
import { CreatePembelian } from "../../api/ApiTransaksiPembelian";

import ModalDeleteKeranjang from "./ModalDeleteKeranjang";
import { fetchPembeli } from "../../api/ApiPembeli";
import { toast } from "react-toastify";

interface AlamatUtama {
	id_alamat: number;
	nama_alamat: string;
	nama_kota: string;
	nama_jalan: string;
	kode_pos: Int16Array;
}

interface Pembeli {
	id_pembeli: number;
	nama: string;
	email: string;
	telepon: string;
	foto: string;
	poin: number;
}

type Keranjang = {
	barang: {
		barang_penitipan: {
			penitipan_penitip: {
				nama: string;
			};
		};

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
	id_barang: number;
	id_keranjang: number;
	id_pembeli: number;
};

const Cart = () => {
	const [delivery, setDelivery] = useState(true);
	const navigate = useNavigate();
	const [barang, setBarang] = useState<Keranjang[]>([]);
	const [pembeli, setPembeli] = useState<Pembeli>();
	const [AlamatUtama, setAlamatUtama] = useState<AlamatUtama>();
	const [showModal, setShowModal] = useState(false);
	const [showModalDelete, setShowModalDelete] = useState(false);
	const abortControllerRef = useRef<AbortController | null>(null);
	const [selectedBarang, setSelectedBarang] = useState<Keranjang | null>(null);
	const [inputPoin, setInputPoin] = useState<string>("0");
	const [poinUsed, setPoinUsed] = useState(0);
	const [poinLeft, setPoinLeft] = useState(0);

	const [subtotal, setSubtotal] = useState(0);
	const [deliveryFee, setDeliveryFee] = useState(0);
	const [total, setTotal] = useState(0);

	const fetchProfile = () => {
		fetchPembeli()
			.then((response) => {
				setPembeli(response);
			})
			.catch((error) => {
				console.error("Error fetching profile:", error);
			});
	};

	const fetchAlamatUtama = () => {
		getAlamatUtama()
			.then((response) => {
				setAlamatUtama(response.alamatUtama);
			})
			.catch((error) => {
				console.error("Error fetching address:", error);
			});
	};

	const handleUsePoin = (e: React.FormEvent) => {
		e.preventDefault();
		if (!pembeli) return;

		if (Number(inputPoin) > pembeli.poin) {
			toast.error("Poin yang dimasukkan melebihi poin yang Anda miliki.");
			return;
		}

		if (Number(inputPoin) < 0) {
			toast.error("Poin tidak boleh negatif.");
			return;
		}

		setPoinUsed(Number(inputPoin));
		setPoinLeft(pembeli.poin - Number(inputPoin));
		toast.success("Poin berhasil digunakan.");
	};

	const fetchBarang = () => {
		abortControllerRef.current?.abort();
		const controller = new AbortController();
		abortControllerRef.current = controller;

		FetchKeranjangByPembeli(controller.signal)
			.then((response) => {
				setBarang(response.keranjang);
			})
			.catch((error) => {
				if (error.name === "CanceledError") return;
				console.error("Error fetching items:", error);
			});
	};

	const handleDelete = (barang: Keranjang) => {
		setShowModalDelete(true);
		setSelectedBarang(barang);
	};
	useEffect(() => {
		const newSubtotal = barang.reduce(
			(sum, item) => sum + item.barang.harga,
			0
		);
		setSubtotal(newSubtotal);

		let fee = 0;
		if (delivery && newSubtotal < 1500000) {
			fee = 100000;
		}

		setDeliveryFee(fee);

		const totalBeforeDiscount = newSubtotal + fee;

		const maxPoinUsed = Math.min(poinUsed, pembeli?.poin ?? 0);
		const diskonPoin = maxPoinUsed * 100;

		let totalAfterPoin = totalBeforeDiscount - diskonPoin;

		if (totalAfterPoin > 500000) {
			totalAfterPoin = totalAfterPoin * 0.8; // diskon 20%
		}

		if (poinUsed == 0) {
			setTotal(newSubtotal + fee);
		} else {
			setTotal(Math.max(0, Math.floor(totalAfterPoin)));
		}
	}, [barang, delivery, poinUsed, pembeli]);

	useEffect(() => {
		fetchBarang();
		fetchAlamatUtama();
		fetchProfile();
		setPoinLeft(pembeli?.poin || 0);

		return () => {
			abortControllerRef.current?.abort();
		};
	}, []);

	useEffect(() => {
		if (pembeli) {
			setPoinLeft(pembeli.poin);
		}
	}, [pembeli]);

	const handleShowModal = () => {
		setShowModal(true);
	};
	const handleCheckout = async () => {
		if (!pembeli) return;

		if (barang.length === 0) {
			toast.error("Keranjang kosong.");
			return;
		}

		if (delivery && !AlamatUtama) {
			toast.error("Alamat utama tidak ditemukan.");
			return;
		}

		try {
			const data = {
				metode_pengiriman: delivery ? "diantar" : "diambil",
				id_alamat: delivery ? AlamatUtama?.id_alamat : undefined,
				status_pengiriman: delivery ? "on progress" : "diambil",
				poin_digunakan: poinUsed,
			};

			const result = await CreatePembelian(data);
			console.log(result);
			toast.success("Checkout berhasil!");
			navigate(`/checkout/${result.pembelian.nomor_nota}`, {
				state: { pembelian: result.pembelian },
			});
		} catch (error: any) {
			const message =
				error.response?.data?.message || "Terjadi kesalahan saat checkout.";
			toast.error(message);
		}
	};

	return (
		<div className="flex flex-col h-full min-h-screen bg-white p-12 max-sm:flex-wrap">
			<div className="flex items-center gap-2">
				<FontAwesomeIcon className="text-gray-500 text-sm" icon={faHouse} />
				<FontAwesomeIcon
					className="text-gray-500 text-sm font-extralight"
					icon={faChevronRight}
				/>
				<p className="text-sm font-bold text-gray-500">Shop</p>
				<FontAwesomeIcon
					className="text-gray-500 text-sm font-extralight"
					icon={faChevronRight}
				/>
				<p className="text-sm font-bold text-green-500">Checkout</p>
			</div>
			<div className="flex mt-4 gap-16 p-12 justify-center">
				<div className="flex flex-col w-3/5 max-w-[700px] h-full bg-white rounded-lg border-1 border-gray-300">
					<div className="flex items-center w-full h-[70px] bg-black rounded-t-lg p-4">
						<p className="font-bold text-2xl text-white">DELIVERY</p>
					</div>
					<div className="flex justify-center mt-4 text-lg font-bold text-black">
						<button
							onClick={() => setDelivery(true)}
							className={`border border-gray-300 rounded-tl-lg bg-white w-full max-w-[250px] h-full flex items-center justify-center p-2 ${delivery ? "border-b-2 border-b-black" : ""
								}`}
						>
							<p>Delivery</p>
						</button>
						<button
							onClick={() => setDelivery(false)}
							className={`border border-gray-300 rounded-tr-lg bg-white w-full max-w-[250px] h-full flex items-center justify-center p-2 ${!delivery ? "border-b-2 border-b-black" : ""
								}`}
						>
							<p>Pickup</p>
						</button>
					</div>
					<React.Fragment>
						{delivery ? (
							<form
								action=""
								className="flex flex-col items-between justify-center mx-10"
							>
								<div className="mt-4 pb-15">
									<div className="flex items-center justify-between w-full">
										<div className="flex flex-row items-start gap-3">
											<span className="mt-1.5">
												<FaLocationDot />
											</span>
											{AlamatUtama ? (
												<div className="flex flex-col">
													<p className="text-lg font-bold text-black">
														{AlamatUtama?.nama_alamat}
													</p>
													<p className="text-lg">
														{AlamatUtama?.nama_jalan}, {AlamatUtama?.nama_kota},{" "}
														{AlamatUtama?.kode_pos}.
													</p>
												</div>
											) : (
												<p className="text-lg font-bold text-black">
													Tidak ada alamat
												</p>
											)}
										</div>

										<button
											type="button"
											className="flex-shrink-0 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
											onClick={handleShowModal}
										>
											Ubah
										</button>
									</div>
								</div>
							</form>
						) : (
							<div className="flex flex-col items-between justify-center mx-10 pb-15">
								<div className="flex flex-col mt-4">
									<div className="flex-col items-start justify-start mt-4">
										<p className="text-lg font-bold text-black">Location</p>
										<div className="w-full h-10 rounded-md border-1 border-gray-300 p-2 mt-1">
											<p className="text-black font-semibold">
												Gudang Reusemart Jl. Kaliurang km 6,8 no.8
											</p>
										</div>
									</div>
									<div className="flex-col items-start justify-start mt-4">
										<p className="text-lg font-bold text-black">Email</p>
										<div className="w-full h-10 rounded-md border-1 border-gray-300 p-2 mt-1">
											<p className="text-black font-semibold">
												reusemart@gmail.com
											</p>
										</div>
									</div>
									<div className="flex-col items-start justify-start mt-4">
										<p className="text-lg font-bold text-black">Phone Number</p>
										<div className="w-full h-10 rounded-md border-1 border-gray-300 p-2 mt-1">
											<p className="text-black font-semibold">08125342670</p>
										</div>
									</div>
								</div>
							</div>
						)}
					</React.Fragment>
				</div>

				<div className="flex flex-col w-2/5 h-full bg-white rounded-lg border-1 border-gray-300">
					<div className="flex items-center w-full h-[70px] bg-black rounded-t-lg p-4">
						<p className="font-bold text-2xl text-white">MY CART</p>
					</div>
					<div className="flex flex-col px-16 mt-8">
						<div className="flex items-center justify-between gap-4">
							<p className="font-semibold text-gray-400 text-xl">Subtotal</p>
							<p className="font-semibold text-gray-400 text-xl">
								Rp {subtotal.toLocaleString("id-ID")}
							</p>
						</div>

						{delivery ? (
							<div className="flex items-center justify-between gap-4 mt-2">
								<p className="font-semibold text-gray-400 text-xl">
									Delivery Fees
								</p>
								<p className="font-semibold text-gray-400 text-xl">
									Rp {deliveryFee.toLocaleString("id-ID")}
								</p>
							</div>
						) : (
							<div></div>
						)}
						<div className="flex items-center justify-between gap-4 mt-2">
							<p className="font-bold text-black text-xl">Total</p>
							<p className="font-bold text-red-400 text-xl">
								Rp {total.toLocaleString("id-ID")}
							</p>
						</div>

						<div className="flex items-center justify-between gap-4">
							<p className="font-semibold text-gray-400 text-xl">Poin Use</p>
							<p className="font-semibold text-gray-400 text-xl">{poinUsed}</p>
						</div>
						<div className="flex items-center justify-between gap-4">
							<p className="font-semibold text-gray-400 text-xl">Poin Left</p>
							<p className="font-semibold text-gray-400 text-xl">{poinLeft}</p>
						</div>

						<form onSubmit={handleUsePoin} className="flex mt-4">
							<input
								type="text"
								pattern="[0-9]*"
								inputMode="numeric"
								className="w-full h-10 rounded-l-md rounded-r-none border-1 border-gray-300 p-2 "
								value={inputPoin}
								onChange={(e) => {
									const value = e.target.value;
									if (/^\d*$/.test(value)) {
										setInputPoin(value);
									}
								}}
							/>
							<Button
								type="submit"
								className="rounded-l-none rounded-r-md h-10"
							>
								Use Points
							</Button>
						</form>
					</div>
					<hr className="self-center my-2 border-t  w-[95%] border-gray-300 mt-4" />
					<div className="flex flex-col items-center justify-center">
						{barang.map((item, index) => (
							<div
								key={index}
								className="w-full h-full bg-white p-4 flex flex-col items-start  "
							>
								<div className="flex items-center gap-2 w-full">
									<img
										src={item.barang.foto}
										alt={item.barang.nama}
										className="h-[60%] w-full max-w-[150px] max-h-[150px] object-contain"
									/>
									<div className="flex flex-col self-start justify-start items-start grow">
										<p className="font-semibold break-words whitespace-normal text-xl ">
											{item.barang.nama}
										</p>
										<p className=" font-normal text-gray-400 text-lg">
											{item.barang.barang_penitipan?.penitipan_penitip?.nama || "Unknown Penitip"}

										</p>
										<p className=" font-normal text-gray-400 text-lg">
											Description: {item.barang.deskripsi}
										</p>
										<p className="font-bold text-green-900 text-xl">
											Rp {item.barang.harga}
										</p>
									</div>
									<Button
										className="justfy-self-center self-center cursor-pointer"
										color="red"
										onClick={() => handleDelete(item)}
									>
										Delete
									</Button>
								</div>
								<hr className="self-center my-2 border-t  w-[95%] border-gray-300 mt-4" />
							</div>
						))}
					</div>
					<div className="flex items-center justify-center gap-4 mt-4 mb-8">
						<Button
							className="text-xl px-24 py-6 cursor-pointer"
							onClick={handleCheckout}
						>
							Checkout
						</Button>
					</div>
				</div>
			</div>

			{showModal && AlamatUtama && (
				<ModalGantiAlamat
					alamat={AlamatUtama}
					onClose={() => setShowModal(false)}
					show={showModal}
					onGantiAlamat={(alamatBaru) => setAlamatUtama(alamatBaru)}
				/>
			)}

			{showModalDelete && selectedBarang && (
				<ModalDeleteKeranjang
					show={showModalDelete}
					idBarang={selectedBarang.id_barang}
					onClose={() => setShowModalDelete(false)}
					onSuccessDelete={fetchBarang}
				/>
			)}
		</div>
	);
};
export default Cart;
