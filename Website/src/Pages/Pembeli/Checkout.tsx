import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FileInput, Button } from "flowbite-react";
import { GetOngoingPembelian } from "../../api/ApiTransaksiPembelian";
import { toast } from "react-toastify";
import { AddBuktiPembayaran } from "../../api/ApiTransaksiPembelian";

type Pembelian = {
	id_pembelian: number;
	id_pembeli: number;
	id_alamat: number;
	total: number;
	nomor_nota: string;
	tanggal_laku: Date;
	poin_didapat:number;
};

const Checkout = () => {
	const navigate = useNavigate();
	const { nomor_nota } = useParams();
	const [pembelian, setPembelian] = useState<Pembelian>();
	const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
	const [file, setFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selected = e.target.files?.[0];
		setFile(selected || null);
		if (selected) {
			const reader = new FileReader();
			reader.onloadend = () => setPreview(reader.result as string);
			reader.readAsDataURL(selected);
		} else {
			setPreview(null);
		}
	};

	useEffect(() => {
		const fetchTransaksiPembelian = async () => {
			try {
				const response = await GetOngoingPembelian(nomor_nota as string);
				setPembelian(response.pembelian);

				// Hitung waktu sisa pembayaran (15 menit dari tanggal_laku)
				const tanggalLaku = new Date(response.pembelian.tanggal_laku);
				const now = new Date();
				const targetTime = new Date(tanggalLaku.getTime() + 1 * 60 * 1000);
				const diffSeconds = Math.max(
					0,
					Math.floor((targetTime.getTime() - now.getTime()) / 1000)
				);
				setSecondsLeft(diffSeconds);
			} catch (error) {
				console.error("Error fetching ongoing orders:", error);
				toast.error("Gagal mendapatkan data pembelian");
				navigate("/");
			}
		};
		fetchTransaksiPembelian();
	}, [nomor_nota, navigate]);

	// Countdown logic + redirect saat waktu habis
	useEffect(() => {
		if (secondsLeft === null) return;
		if (secondsLeft <= 0) {
			toast.error("Waktu pembayaran telah habis.");
			navigate("/");
			return;
		}
		const interval = setInterval(() => {
			setSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
		}, 1000);
		return () => clearInterval(interval);
	}, [secondsLeft, navigate]);

	// Menunggu data transaksi
	if (!pembelian || secondsLeft === null) {
		return (
			<div className="h-screen flex items-center justify-center">
				<p>Memuat data pembelian...</p>
			</div>
		);
	}

	const minutes = Math.floor(secondsLeft / 60);
	const seconds = secondsLeft % 60;

	const submitFotoPembayaran = async () => {
		if (!file) {
			toast.error("Silakan pilih file untuk diunggah.");
			return;
		}

		const formData = new FormData();
		formData.append("bukti_pembayaran", file);
		formData.append("nomor_nota", pembelian.nomor_nota);

		try {
			const response = await AddBuktiPembayaran(formData, pembelian.nomor_nota);
			toast.success(response.message);
			navigate("/");
		} catch (error : any) {
			toast.error("Gagal mengunggah bukti pembayaran.");
			console.error("Error uploading payment proof:", error );
		}
	}

	return (
		<div className="h-screen items-center justify-center flex w-full">
			<div className="max-w-md w-full mx-auto mt-10 bg-white rounded-lg shadow-lg p-6">
				{/* Timer */}
				<div className="flex items-center justify-between mb-4">
					<span className="text-lg font-semibold">Sisa Waktu Pembayaran:</span>
					<span className="font-mono text-red-600">
						{minutes.toString().padStart(2, "0")}:
						{seconds.toString().padStart(2, "0")}
					</span>
				</div>

				{/* Bank Info */}
				<div className="flex items-center mb-4">
					<img
						src="https://landbank.co.id/wp-content/uploads/2025/05/bca-logo-25-ist.jpg"
						alt="Logo Bank"
						className="w-25 h-25 mr-4 object-contain"
					/>
					<div>
						<div className="font-semibold">Bank BCA</div>
						<div>
							No. Rekening: <span className="font-mono">1234567890</span>
						</div>
						<div>a.n. PT Reusemart Indonesia</div>
					</div>
				</div>

				{/* Nota & Total */}
				<div className="mb-4">
					<div className="flex justify-between">
						<span className="font-semibold">Nomor Nota:</span>
						<span className="font-mono">{pembelian.nomor_nota}</span>
					</div>
					<div className="flex justify-between">
						<span className="font-semibold">Total Tagihan:</span>
						<span className="font-bold text-green-600">
							Rp {pembelian.total}
						</span>
						
					</div>
					<div className="flex justify-between">
					<span className="font-semibold">Poin yang anda dapatkan:</span>
						<span className="font-bold text-green-600">
							{pembelian.poin_didapat}
						</span>

					</div>
				</div>

				{/* Upload Bukti */}
				<div>
					<label className="block font-semibold mb-2">
						Upload Bukti Pembayaran
					</label>
					<FileInput
						id="file"
						name="foto"
						accept="image/*"
						onChange={handleFileChange}
					/>
					{preview && (
						<div className="mt-2">
							<span className="block mb-1">Preview:</span>
							<img
								src={preview}
								alt="Preview Bukti Pembayaran"
								className="w-full max-h-64 object-contain border rounded"
							/>
						</div>
					)}
				</div>

				<Button className="justify-self-center mt-6" onClick={submitFotoPembayaran}>Confirm Payment</Button>
			</div>
		</div>
	);
};

export default Checkout;
