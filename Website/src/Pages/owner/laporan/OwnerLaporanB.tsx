import { useState } from "react";
import { SyncLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faDownload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Button } from "flowbite-react";

import SideBarNavOwner from "../../../Components2/SideBarNavOwner";
import { fetchLaporanBarangHabis, fetchLaporanBarangTerjual } from "../../../api/ApiOwner";
import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

type Report = {
    id: number;
    title: string;
};


const OwnerLaporanB = () => {
    const [isLoading] = useState<boolean>(false);
    const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");





    const handlePrintLaporanBarangHabis = async () => {
        try {
            const response = await fetchLaporanBarangHabis();
            const data = response.data;

            const doc = new jsPDF();
            const marginLeft = 15;
            let y = 20;

            doc.setFontSize(14);
            doc.text("Laporan Barang yang Masa Penitipannya Sudah Habis", marginLeft, y);
            y += 8;
            doc.setFontSize(12);
            doc.text("ReUse Mart", marginLeft, y);
            y += 6;
            doc.text("Jl. Green Eco Park No. 456 Yogyakarta", marginLeft, y);
            y += 10;

            const formattedDate = dayjs().locale('id').format('D MMMM YYYY');
            doc.setFontSize(11);
            doc.text(`Tanggal cetak: ${formattedDate}`, marginLeft, y);
            y += 10;

            const headers = [
                "Kode Produk", "Nama Produk", "Id Penitip", "Nama Penitip",
                "Tanggal Masuk", "Tanggal Akhir", "Batas Ambil"
            ];
            const colWidths = [30, 40, 25, 40, 30, 30, 30];
            const tableStartY = y;

            let x = marginLeft;
            doc.setFontSize(10);
            doc.setFont("helvetica", 'bold');
            headers.forEach((header, i) => {
                doc.text(header, x, y);
                x += colWidths[i];
            });

            y += 8;
            doc.setFont("helvetica", 'normal');

            data.forEach((item: any) => {
                const tglMasuk = dayjs(item.tanggal_masuk).format("D/M/YYYY");
                const tglAkhir = dayjs(item.tanggal_akhir).format("D/M/YYYY");
                const batasAmbil = dayjs(item.tanggal_akhir).add(7, 'day').format("D/M/YYYY");

                const row = [
                    item.nama.charAt(0).toUpperCase() + item.id_barang,
                    item.nama,
                    item.id_penitip.toString(),
                    item.nama_penitip,
                    tglMasuk,
                    tglAkhir,
                    batasAmbil
                ];

                let x = marginLeft;
                row.forEach((text, i) => {
                    doc.text(String(text), x, y);
                    x += colWidths[i];
                });

                y += 8;
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
            });

            doc.save("Laporan-Barang-Masa-Penitipan-Habis.pdf");

        } catch (error) {
            console.error("Gagal mencetak laporan", error);
            alert("Gagal mencetak laporan");
        }
    };


    const handlePrintLaporanBarangTerjual = async () => {
        try {
            const response = await fetchLaporanBarangTerjual();
            const data = response.data;

            const doc = new jsPDF();
            const marginLeft = 15;
            let y = 20;

            const currentYear = dayjs().year();
            const formattedDate = dayjs().locale('id').format('D MMMM YYYY');

            doc.setFontSize(14);
            doc.text("Laporan penjualan per kategori barang (dalam 1 tahun)", marginLeft, y);
            y += 8;
            doc.setFontSize(12);
            doc.text("ReUse Mart", marginLeft, y);
            y += 6;
            doc.text("Jl. Green Eco Park No. 456 Yogyakarta", marginLeft, y);
            y += 10;

            doc.setFontSize(11);
            doc.text(`Tahun: ${currentYear}`, marginLeft, y);
            y += 6;
            doc.text(`Tanggal cetak: ${formattedDate}`, marginLeft, y);
            y += 10;

            // Table header
            const headers = ["Kategori", "Jumlah item terjual", "Jumlah item gagal terjual"];
            const colWidths = [80, 50, 50];

            doc.setFontSize(10);
            doc.setFont("helvetica", 'bold');

            let x = marginLeft;
            headers.forEach((header, i) => {
                doc.text(header, x, y);
                x += colWidths[i];
            });

            y += 8;
            doc.setFont("helvetica", 'normal');

            let totalTerjual = 0;
            let totalGagal = 0;

            data.forEach((item: any) => {
                const kategori = item.nama || "-";
                const jumlahTerjual = Number(item.jumlah_terjual ?? 0);
                const jumlahGagal = Number(item.jumlah_gagal ?? 0);


                totalTerjual += jumlahTerjual;
                totalGagal += jumlahGagal;

                const row = [
                    kategori,
                    jumlahTerjual.toString(),
                    jumlahGagal.toString(),
                ];

                let x = marginLeft;
                row.forEach((text, i) => {
                    doc.text(String(text), x, y);
                    x += colWidths[i];
                });

                y += 8;

                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
            });

            // Total row
            doc.setFont("helvetica", 'bold');
            doc.text("Total", marginLeft, y);
            doc.text(totalTerjual.toString(), marginLeft + colWidths[0], y);
            doc.text(totalGagal.toString(), marginLeft + colWidths[0] + colWidths[1], y);

            doc.save("Laporan-Penjualan-Kategori-Barang.pdf");
        } catch (error) {
            console.error("Gagal mencetak laporan", error);
            alert("Gagal mencetak laporan");
        }
    };


    const reports: Report[] = [
        { id: 1, title: "Laporan Barang yang masa penitipanya sudah habis" },
        { id: 2, title: "Laporan Barang Terjual per Kategori" },

    ];

    const filteredData = reports.filter((item) => {
        return (
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toString().includes(searchTerm)
        );
    });
    const handleDownload = async (id: number) => {
        setDownloadLoading(true);
        try {
            if (id === 1) {
                await handlePrintLaporanBarangHabis(); // for "Barang Habis"
            } else if (id === 2) {
                await handlePrintLaporanBarangTerjual(); // for "Barang Terjual"
            } else {
                alert("Laporan tidak dikenali.");
            }
        } catch (error) {
            alert("Gagal mencetak laporan.");
            console.error(error);
        } finally {
            setDownloadLoading(false);
        }
    };

    const TABLE_HEAD = ["No", "Judul Laporan", "Aksi"];

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex flex-col lg:flex-row p-5 gap-5 lg:p-10 lg:gap-10">
                <SideBarNavOwner />
                {isLoading ? (
                    <div className="flex justify-center items-center w-full h-64">
                        <SyncLoader color="#F5CB58" size={10} />
                        <p className="mt-2 ml-4">Loading...</p>
                    </div>
                ) : (
                    <div className="bg-white w-full border border-gray-300 shadow-md rounded-lg">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-900">Download Laporan</h2>
                            </div>
                            <div className="relative w-full sm:w-1/2 mb-6">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full h-10 bg-gray-100 rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Cari laporan..."
                                />
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-[#2A3042] text-white text-sm">
                                        <tr>
                                            {TABLE_HEAD.map((head) => (
                                                <th
                                                    key={head}
                                                    className="px-4 py-3 text-center font-semibold tracking-wide"
                                                >
                                                    {head}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 text-sm text-center">
                                        {filteredData.map((report) => {
                                            return (
                                                <tr
                                                    key={report.id}
                                                    className="hover:bg-gray-50 transition-all"
                                                >
                                                    <td className="px-4 py-3">{report.id}</td>
                                                    <td className="px-4 py-3 text-left">{report.title}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex justify-center">
                                                            <Button
                                                                size="sm"
                                                                disabled={downloadLoading}
                                                                onClick={() => handleDownload(report.id)}

                                                                className="bg-green-500 hover:bg-green-600 text-white items-center flex justify-center"
                                                            >
                                                                {downloadLoading ? (
                                                                    <SyncLoader size={6} color="#ffffff" className="ml-1" />
                                                                ) : (
                                                                    <>
                                                                        <FontAwesomeIcon icon={faDownload} />
                                                                        <span className="ml-2">Unduh</span>
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OwnerLaporanB;