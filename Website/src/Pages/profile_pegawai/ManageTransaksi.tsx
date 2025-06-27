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
import ModalDetailTransaksi from "./ModalDetailTransaksi";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../../components/ui/carousel"
import { confirmAlert } from 'react-confirm-alert';

import {
	faSearch,
	faHouse,
	faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { FetchDataNota, FetchDataPegawai, FetchTransaksiByGudang, FetchTransaksiGudangById, selesaiTransaksi } from "../../api/ApiGudang";
import SideBarNavGudang from "../../Components2/SideBarNavGudang";
import { Button } from "../../components/ui/button";
import ModalAssignDate from "./ModalAssignDate";
import jsPDF from "jspdf";
import SyncLoader from "react-spinners/SyncLoader";

type Barang = {
    id_barang: number;
    id_penitipan: number;
    id_kategori: string;
    id_hunter: string;
    nama_barang: string;
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
    id_pembelian: number;
    status_pengiriman: string;
    metode_pengiriman: string;
    tanggal_pengiriman: string;
};


type Nota = {
    id_pembelian: number;
    nomor_nota: number;
    tanggal_laku: string;
    tanggal_lunas: string;
    tanggal_pengiriman: string;
    nama: string;
    email: string;
    nama_alamat: string;
    nama_kota: string;
    nama_barang: string;
    total: number;
    ongkir: number;
    poin_digunakan: number;
    poin_didapat: number;
    poin: number;
    nama_pegawai: string;
    id_qc: number;
    nama_qc: string;
}
const ManageTransaksi = () => {
    const [showCurrentPassword, setCurrentPassword] = useState(false);
    const [showNewPassword, setNewPassword] = useState(false);
    const [showConfirmPassword, setConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0)
    const [dataBarang, setDataBarang] = useState<any>(null);
    const [dataNota, setDataNota] = useState<Nota>();
    const [data, setData] = useState<Barang[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(0);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [showModalAssign, setShowModalAssign] = useState(false);

	const [showModal, setShowModal] = useState(false);
	const [tempIdBarang, setTempIdBarang] = useState(0);

	const handleClick = (id_pembelian: number) => {
		setShowModal(true);
		setTempIdBarang(id_pembelian);
	};

	const handleAssignClick = (id_pembelian: number) => {
		setShowModalAssign(true);
		setTempIdBarang(id_pembelian);
	};


    const chunkArray = <T,>(array: T[], chunkSize: number): T[][] => {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            result.push(array.slice(i, i + chunkSize));
        }
        return result;
    };
    const filteredData = data.filter((item) => {
        const searchLower = searchTerm.toLowerCase();
        const itemDate = new Date(item.tanggal_pengiriman);

        const matchesSearch =
            item.id_pembelian.toString().includes(searchLower) ||
            item.status_pengiriman.toLowerCase().includes(searchLower) ||
            item.metode_pengiriman.toLowerCase().includes(searchLower);

        const matchesDateRange =
            (!startDate || itemDate >= new Date(startDate)) &&
            (!endDate || itemDate <= new Date(endDate));

        return matchesSearch && matchesDateRange;
    });


    const chunkedData = chunkArray(filteredData, itemsPerPage);


    const pageCount = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );



    const fetchBarangByPenitip = () => {
        setIsLoading(true);
        FetchTransaksiByGudang()
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

    const fetchTransaksiGudang = async (id_pembelian: number) => {
        try {
            FetchTransaksiGudangById(id_pembelian)
                .then((response) => {
                    console.log(response);
                    setDataBarang(response.data);
                })
                .catch((error: any) => {
                    console.error("Gagal mengambil data history", error);
                });
        } catch (error: any) {
            throw error.response.data;
        }
    };



    useEffect(() => {
        fetchBarangByPenitip();
    }, []); 44

    const handleSelesai = async (id_pembelian: number) => {
        confirmAlert({
            title: 'Konfirmasi',
            message: 'Apakah Anda yakin ingin menyelesaikan transaksi ini?',
            buttons: [
                {
                    label: 'Ya',
                    onClick: async () => {
                        try {
                            const response = await selesaiTransaksi(id_pembelian);
                            confirmAlert({
                                title: 'Sukses',
                                message: response.message || "Transaksi selesai",
                                buttons: [{ label: 'OK' }]
                            });
                            fetchBarangByPenitip();
                        } catch (error: any) {
                            confirmAlert({
                                title: 'Gagal',
                                message: error.message || "Gagal menyelesaikan transaksi",
                                buttons: [{ label: 'OK' }]
                            });
                        }
                    }
                },
                {
                    label: 'Tidak',
                    onClick: () => { /* Tidak melakukan apa-apa */ }
                }
            ]
        });
    };
    const handlePrintNota = async (id_pembelian: number) => {
        try {
            const response = await FetchDataNota(id_pembelian);
            const transaksiResponse = await FetchTransaksiGudangById(id_pembelian);
            const nota = response.data;
            const items = Array.isArray(transaksiResponse.data)
                ? transaksiResponse.data
                : [transaksiResponse.data];

            console.log("Nota:", nota);

            const doc = new jsPDF();

            const marginLeft = 15;
            const marginRight = 195;
            let y = 20;
            const contentStartY = y;

            doc.setFontSize(16);
            doc.text("ReUse Mart", marginLeft, y);
            doc.setFontSize(12);
            y += 8;
            doc.text("Jl. Green Eco Park No. 456 Yogyakarta", marginLeft, y);

            y += 12;
            doc.text(`No Nota                : ${nota.nomor_nota}`, marginLeft, y);
            y += 8;
            doc.text(`Tanggal pesan   : ${nota.tanggal_laku}`, marginLeft, y);
            y += 8;
            doc.text(`Lunas pada         : ${nota.tanggal_lunas}`, marginLeft, y);
            y += 8;
            doc.text(`Tanggal kirim      : ${nota.tanggal_pengiriman ?? "-"}`, marginLeft, y);

            y += 12;
            doc.text(`Pembeli: ${nota.email} / ${nota.nama}`, marginLeft, y);
            y += 8;
            doc.text(`${nota.nama_alamat}, ${nota.nama_kota}`, marginLeft, y);
            y += 8;
            doc.text(`Delivery: Kurir ReUseMart (${nota.nama_pegawai})`, marginLeft, y);

            y += 12;
            let total = 0;
            items.forEach((item: any) => {
                const nama = item.nama_barang;
                const harga = `Rp ${item.harga.toLocaleString()}`;
                doc.text(`${nama}`, marginLeft, y);
                doc.text(harga, marginRight - doc.getTextWidth(harga), y);
                y += 8;
                total += item.harga;
            });

            y += 5;
            doc.line(marginLeft, y, marginRight, y);
            y += 7;
            doc.text(`Total`, marginLeft, y);
            doc.text(`Rp ${nota.total.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${nota.total.toLocaleString()}`), y);

            y += 8;
            doc.text(`Ongkos Kirim`, marginLeft, y);
            doc.text(`Rp ${nota.ongkir.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${nota.ongkir.toLocaleString()}`), y);

            y += 8;
            const grandTotal = nota.total + nota.ongkir;
            doc.text(`Total`, marginLeft, y);
            doc.text(`Rp ${grandTotal.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${grandTotal.toLocaleString()}`), y);

            y += 8;
            doc.text(`Potongan ${nota.poin_digunakan} poin`, marginLeft, y);
            const potongan = nota.poin_digunakan * 100;
            doc.text(`– Rp ${potongan.toLocaleString()}`, marginRight - doc.getTextWidth(`– Rp ${potongan.toLocaleString()}`), y);

            y += 8;
            const akhir = grandTotal - potongan;
            doc.text(`Total`, marginLeft, y);
            doc.text(`Rp ${akhir.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${akhir.toLocaleString()}`), y);

            y += 10;
            doc.text(`Poin dari pesanan ini: ${nota.poin_didapat}`, marginLeft, y);
            y += 8;
            const totalPoin = nota.poin_didapat + nota.poin
            doc.text(`Total poin customer: ${totalPoin}`, marginLeft, y);

            y += 12;
            doc.text(`QC oleh: ${nota.nama_qc} (${nota.id_qc})`, marginLeft, y);

            y += 15;
            doc.text(`Diterima oleh:`, marginLeft, y);
            y += 20;
            doc.text(`(...........................................)`, marginLeft, y);
            y += 10;
            doc.text(`Tanggal: ..............................`, marginLeft, y);
            y = + 10;

            const contentHeight = y - contentStartY + 10;
            doc.rect(marginLeft - 5, contentStartY - 10, marginRight - marginLeft + 10, contentHeight);

            doc.save(`Nota-${nota.nomor_nota}.pdf`);
        } catch (error) {
            console.error("Gagal mencetak nota", error);
            alert("Gagal mencetak nota");
        }
    };


    const handlePrintNotaDiambil = async (id_pembelian: number) => {
        try {
            const response = await FetchDataNota(id_pembelian);
            const transaksiResponse = await FetchTransaksiGudangById(id_pembelian);
            const nota = response.data;
            const items = Array.isArray(transaksiResponse.data)
                ? transaksiResponse.data
                : [transaksiResponse.data];

            const doc = new jsPDF();

            const marginLeft = 15;
            const marginRight = 195;
            let y = 20;
            const contentStartY = y;

            doc.setFontSize(16);
            doc.text("ReUse Mart", marginLeft, y);
            doc.setFontSize(12);
            y += 8;
            doc.text("Jl. Green Eco Park No. 456 Yogyakarta", marginLeft, y);

            y += 12;
            doc.text(`No Nota              : ${nota.nomor_nota}`, marginLeft, y);
            y += 8;
            doc.text(`Tanggal pesan   : ${nota.tanggal_laku}`, marginLeft, y);
            y += 8;
            doc.text(`Lunas pada         : ${nota.tanggal_lunas}`, marginLeft, y);
            y += 8;
            doc.text(`Tanggal ambil     : ${nota.tanggal_pengiriman ?? "-"}`, marginLeft, y);

            y += 12;
            doc.text(`Pembeli: ${nota.email} / ${nota.nama}`, marginLeft, y);
            y += 8;
            doc.text(`${nota.nama_alamat}, ${nota.nama_kota}`, marginLeft, y);
            y += 8;
            doc.text(`Delivery: - (diambil sendiri)`, marginLeft, y);

            y += 12;
            let total = 0;
            items.forEach((item: any) => {
                const nama = item.nama_barang;
                const harga = `Rp ${item.harga.toLocaleString()}`;
                doc.text(`${nama}`, marginLeft, y);
                doc.text(harga, marginRight - doc.getTextWidth(harga), y);
                y += 8;
                total += item.harga;
            });

            y += 5;
            doc.line(marginLeft, y, marginRight, y);
            y += 7;
            doc.text(`Total`, marginLeft, y);
            doc.text(`Rp ${nota.total.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${nota.total.toLocaleString()}`), y);

            y += 8;
            doc.text(`Ongkos Kirim`, marginLeft, y);
            doc.text(`Rp ${nota.ongkir.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${nota.ongkir.toLocaleString()}`), y);

            y += 8;
            const grandTotal = nota.total + nota.ongkir;
            doc.text(`Total`, marginLeft, y);
            doc.text(`Rp ${grandTotal.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${grandTotal.toLocaleString()}`), y);

            y += 8;
            const potongan = nota.poin_digunakan * 100;
            doc.text(`Potongan ${nota.poin_digunakan} poin`, marginLeft, y);
            doc.text(`– Rp ${potongan.toLocaleString()}`, marginRight - doc.getTextWidth(`– Rp ${potongan.toLocaleString()}`), y);

            y += 8;
            const akhir = grandTotal - potongan;
            doc.text(`Total`, marginLeft, y);
            doc.text(`Rp ${akhir.toLocaleString()}`, marginRight - doc.getTextWidth(`Rp ${akhir.toLocaleString()}`), y);

            y += 10;
            doc.text(`Poin dari pesanan ini: ${nota.poin_didapat}`, marginLeft, y);
            y += 8;
            const totalPoin = nota.poin_didapat + nota.poin;
            doc.text(`Total poin customer: ${totalPoin}`, marginLeft, y);

            y += 12;
            doc.text(`QC oleh: ${nota.nama_qc} (${nota.id_qc})`, marginLeft, y);

            y += 15;
            doc.text(`Diambil oleh:`, marginLeft, y);
            y += 20;
            doc.text(`(...........................................)`, marginLeft, y);
            y += 10;
            doc.text(`Tanggal: ..............................`, marginLeft, y);
            y = + 10;

            const contentHeight = y - contentStartY + 10;
            doc.rect(marginLeft - 5, contentStartY - 10, marginRight - marginLeft + 10, contentHeight);

            doc.save(`Nota-${nota.nomor_nota}.pdf`);
        } catch (error) {
            console.error("Gagal mencetak nota (diambil)", error);
            alert("Gagal mencetak nota");
        }
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
                <SideBarNavGudang />
                <div className="flex flex-col max-w-[1200px] w-full min-h-[500px] mt-5 border-1 border-gray-300 rounded-lg">
                    <p className="text-2xl font-bold ml-8 mt-5">Manage Transaksi</p>

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
                        <CarouselContent className="flex flex-col items-center">
                            {isLoading ? (
                                <div>
                                    <SyncLoader color="#F5CB58" size={10} className="mx-auto" />
                                    <p className="text-center py-6">
                                        Loading...
                                    </p>
                                </div>
                            ) : chunkedData.length === 0 ? (
                                <div>
                                    <p className="text-center py-6">
                                        No data available.
                                    </p>
                                </div>
                            ) : (

                                <>
                                    {chunkedData.map((chunk, index) => (
                                        <CarouselItem key={index}>
                                            <div className="w-full overflow-x-auto">
                                                <table className="w-full mt-5 mb-5 table-auto">
                                                    <thead>
                                                        <tr className="bg-[#F2F2F2]">
                                                            <th className="px-4 py-3 text-center">ID PEMBELIAN</th>
                                                            <th className="px-4 py-3 text-center">STATUS PENGIRIMAN</th>
                                                            <th className="px-4 py-3 text-center">METODE PENGIRIMAN</th>
                                                            <th className="px-4 py-3 text-center">TANGGAL PENGIRIMAN</th>
                                                            <th className="px-4 py-3 text-center">DETAILS</th>
                                                            <th className="px-4 py-3 text-center">ACTIONS</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {chunk.map((item, rowIndex) => (
                                                            <tr key={rowIndex} className="border-b">
                                                                <td className="py-3 text-center break-words">{item.id_pembelian}</td>
                                                                <td className="px-4 py-3 text-center">{item.status_pengiriman}</td>
                                                                <td className="px-4 py-3 text-center">{item.metode_pengiriman}</td>
                                                                {item.tanggal_pengiriman === null ? (
                                                                    <td className="px-4 py-3 text-center">Unassigned</td>
                                                                ) : (
                                                                    <td className="px-4 py-3 text-center">{item.tanggal_pengiriman}</td>
                                                                )}
                                                                <td
                                                                    className="px-4 py-3 text-center text-[#00B207] hover:underline cursor-pointer"
                                                                    onClick={() => handleClick(item.id_pembelian)}
                                                                >
                                                                    View Details
                                                                </td>
                                                                <td className="px-4 py-3 flex justify-center">
                                                                    <div className="flex gap-4">

                                                                        {item.tanggal_pengiriman === null ? (
                                                                            <>
                                                                                <Button
                                                                                    color="red"
                                                                                    className="cursor-pointer"
                                                                                    onClick={() => {
                                                                                        handleAssignClick(item.id_pembelian);
                                                                                    }}
                                                                                >
                                                                                    Assign Date
                                                                                </Button>
                                                                            </>

                                                                        ) : (
                                                                            <Button
                                                                                color="red"
                                                                                className="cursor-pointer"
                                                                                onClick={() => {
                                                                                    handleSelesai(item.id_pembelian);
                                                                                }}
                                                                            >
                                                                                Selesai Transaksi
                                                                            </Button>

                                                                        )

                                                                        }

                                                                        {item?.tanggal_pengiriman !== null && (
                                                                            <>
                                                                                {item.metode_pengiriman?.toLowerCase() === "diantar".toLowerCase() && (
                                                                                    <Button
                                                                                        color="blue"
                                                                                        className="cursor-pointer"
                                                                                        onClick={() => handlePrintNota(item.id_pembelian)}
                                                                                    >
                                                                                        Print Nota
                                                                                    </Button>
                                                                                )}

                                                                                {item.metode_pengiriman?.toLowerCase() === "diambil".toLowerCase() && (
                                                                                    <Button
                                                                                        color="green"
                                                                                        className="cursor-pointer"
                                                                                        onClick={() => handlePrintNotaDiambil(item.id_pembelian)}
                                                                                    >
                                                                                        Print Nota
                                                                                    </Button>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </td>

                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </CarouselItem>
                                    ))}
                                </>

                            )}
                        </CarouselContent>

                        <div className="flex justify-center gap-4 mt-4">
                            <CarouselPrevious className="static relative" />
                            <CarouselNext className="static relative" />
                        </div>
                    </Carousel>


                </div>

            </div>
            {showModal && (
                <ModalDetailTransaksi
                    show={showModal}
                    idPembelian={tempIdBarang}
                    onClose={() => {
                        setShowModal(false);
                        fetchBarangByPenitip();
                    }}

                />
            )} {showModalAssign && (
                <ModalAssignDate
                    show={showModalAssign}
                    idPembelian={tempIdBarang}
                    onClose={() => {
                        setShowModalAssign(false);
                        fetchBarangByPenitip();
                    }}

                />
            )}

        </div>
    );
};

export default ManageTransaksi;
