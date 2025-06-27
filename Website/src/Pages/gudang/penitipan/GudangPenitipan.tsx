import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { SyncLoader } from "react-spinners";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { IoAdd } from "react-icons/io5";
import { Edit } from "lucide-react";
import { FaEye } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa";
import SidebarNavGudang from "../../../Components2/SideBarNavGudang";
import { FetchPenitipan, showAllBarang, fetchPegawai, fetchPenitip } from "../../../api/ApiPenitipan";
import ModalEditPenitipan from "./ModalEditPenitipan";
import ModalViewPenitipan from "./ModalViewPenitipan";
import { FetchKategori } from "../../../api/ApiBarang";
import ModalAddPenitipan from "./ModalAddPenitipan";
import EditPenitipan from "./EditPenitipan";
import { jsPDF } from "jspdf";

type Pegawai = {
    id_organisasi: number;
    id_pegawai: number;
    id_role: number;
    nama: string;
    email: string;
    password: string;
    tanggal_masuk: Date;
    tanggal_lahir: Date;
    wallet: number;
};

type Penitipan = {
    id_penitipan: number;
    id_penitip: number;
    id_pegawai: number;
    tanggal_masuk: Date;
};

type Barang = {
    id_barang: number;
    id_penitipan: number;
    id_kategori: string;
    id_hunter: string;
    nama: string;
    deskripsi: string;
    foto: File | null;
    berat: number;
    isGaransi: boolean;
    akhir_garansi: Date;
    status_perpanjangan: boolean;
    harga: number;
    tanggal_akhir: Date;
    batas_ambil: Date;
    status_barang: string;
    tanggal_ambil: Date;
    id_pegawai: number;
    durasi_penitipan: number;
};

type Penitip = {
    id_penitip: number;
    nama: string;
    wallet: string;
    telepon: string;
    email: string;
    password: string;
    foto_ktp: File;
    no_ktp: number;
    badges: string;
    total_rating: number;
    poin: number;
};

type Kategori = {
    id_kategori: string;
    nama: string;
};

const GudangPenitipan = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [dataPerPage, setDataPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [showModalAdd, setShowModalAdd] = useState(false);
    const [showModalView, setShowModalView] = useState(false);
    const [data, setData] = useState<Barang[]>([]);
    const [penitipan, setPenitipan] = useState<Penitipan[]>([]);
    const [penitip, setPenitip] = useState<Penitip[]>([]);
    const [pegawai, setPegawai] = useState<Pegawai[]>([]);
    const [selectedPenitipan, setSelectedPenitipan] = useState<Barang | null>(null);
    const [pilihPenitipan, setPilihPenitipan] = useState<Penitipan | null>(null);
    const [kategori, setKategori] = useState<Kategori[]>([]);
    const [showModalEdit, setShowModalEdit] = useState(false);

    const fetchPenitipan = () => {
        setIsLoading(true);
        FetchPenitipan()
            .then((response) => {
                setPenitipan(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const fetchBarang = () => {
        setIsLoading(true);
        showAllBarang()
            .then((response) => {
                setData(response.data);
                console.log(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const FetchPenitip = () => {
        setIsLoading(true);
        fetchPenitip()
            .then((response) => {
                setPenitip(response.penitip);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const FetchPegawai = () => {
        setIsLoading(true);
        fetchPegawai()
            .then((response) => {
                setPegawai(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const fetchKategori = () => {
        setIsLoading(true);
        FetchKategori()
            .then((response) => {
                setKategori(response.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const getNamaPenitip = (id: number) => {
        const namapenitip = penitip.find((item) => item.id_penitip === id);
        return namapenitip?.nama ?? "Unknown";
    };

    const getNamaPegawai = (id: number) => {
        const namapegawai = pegawai.find((item) => item.id_pegawai === id);
        return namapegawai?.nama ?? "Unknown";
    };

    const getNamaKategori = (id: string) => {
        const namakategori = kategori.find((item) => String(item.id_kategori).toLowerCase() === String(id).toLowerCase());
        return namakategori?.nama ?? "Unknown";
    };

    useEffect(() => {
        fetchPenitipan();
        fetchBarang();
        FetchPenitip();
        FetchPegawai();
        fetchKategori();
    }, []);

    const filteredData = penitipan.filter(
        (org) =>
            org.id_penitipan.toString().includes(searchTerm) ||
            getNamaPegawai(org.id_pegawai)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            getNamaPenitip(org.id_penitip)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (org.tanggal_masuk instanceof Date
                ? org.tanggal_masuk.toLocaleDateString().toLowerCase()
                : String(org.tanggal_masuk).toLowerCase()
            ).includes(searchTerm.toLowerCase()) ||
            data
                .filter((item) => item.id_penitipan === org.id_penitipan)
                .some(
                    (item) =>
                        item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.status_barang.toLowerCase().includes(searchTerm.toLowerCase())
                )
    );

    const indexOfLastData = currentPage * dataPerPage;
    const indexOfFirstData = indexOfLastData - dataPerPage;
    const currentData = filteredData.slice(indexOfFirstData, indexOfLastData);
    const totalPages = Math.ceil(filteredData.length / dataPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handlePrintNota = (id_penitipan: number) => {
        try {
            const penitipanData = penitipan.find((p) => p.id_penitipan === id_penitipan);
            if (!penitipanData) {
                alert("Penitipan data not found.");
                return;
            }

            const barangList = data.filter((item) => item.id_penitipan === id_penitipan);
            const penitipName = getNamaPenitip(penitipanData.id_penitip);
            const pegawaiName = getNamaPegawai(penitipanData.id_pegawai);

            const doc = new jsPDF();
            const pageHeight = doc.internal.pageSize.getHeight();
            const bottomMargin = 20;
            const marginLeft = 20;

            const now = new Date();
            const year = now.toLocaleString("default", { year: "2-digit" });
            const month = now.toLocaleString("default", { month: "2-digit" });
            const notaNumber = `${year}.${month}.${penitipanData.id_penitipan}`;
            const tanggalMasuk = new Date(penitipanData.tanggal_masuk).toLocaleString("id-ID");
            const tanggalAkhir = barangList.length > 0 && barangList[0].tanggal_akhir
                ? new Date(barangList[0].tanggal_akhir).toLocaleDateString("id-ID")
                : "-";

            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.text("ReUse Mart", marginLeft, 20);

            doc.setFont("helvetica", "normal");
            doc.text("Jl. Green Eco Park No. 456 Yogyakarta", marginLeft, 27);

            doc.text(`No Nota                         : ${notaNumber}`, marginLeft, 40);
            doc.text(`Tanggal penitipan          : ${tanggalMasuk}`, marginLeft, 47);
            doc.text(`Masa penitipan sampai  : ${tanggalAkhir}`, marginLeft, 54);

            doc.setFont("helvetica", "bold");
            doc.text("Penitip :", marginLeft, 64);
            doc.setFont("helvetica", "normal");
            doc.text(`T${penitipanData.id_penitip}/ ${penitipName}`, marginLeft + 15, 64);

            let y = 74;
            barangList.forEach((barang) => {
                if (y + 20 > pageHeight - bottomMargin) {
                    doc.addPage();
                    y = 20;
                }
                const hargaFormatted = barang.harga.toLocaleString("id-ID");
                doc.text(`${barang.nama}`, marginLeft, y);
                doc.text(hargaFormatted, 100, y, { align: "right" });
                y += 7;

                if (barang.isGaransi && barang.akhir_garansi) {
                    const akhirGaransi = new Date(barang.akhir_garansi);
                    const bulan = akhirGaransi.toLocaleString("id-ID", { month: "long" });
                    const tahun = akhirGaransi.getFullYear();
                    doc.text(`Garansi ON ${bulan} ${tahun}`, marginLeft, y);
                    y += 7;
                }

                doc.text(`Berat barang: ${barang.berat} kg`, marginLeft, y);
                y += 10;
            });

            if (y + 20 > pageHeight - bottomMargin) {
                doc.addPage();
                y = 20;
            }
            doc.text("Diterima dan QC oleh:", marginLeft + 8, y + 10);
            y += 40;
            doc.text(`P${penitipanData.id_pegawai} - ${pegawaiName}`, marginLeft + 8, y);

            const borderTop = 15;
            const borderBottom = y + 5;
            const borderLeft = marginLeft - 5;
            const borderRight = 105;
            doc.setLineWidth(0.5);
            doc.rect(borderLeft, borderTop, borderRight - borderLeft, borderBottom - borderTop);

            doc.save(`Nota_Penitipan_${id_penitipan}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please check the console for details.");
        }
    };

    const TABLE_HEAD = [
        "ID Penitipan",
        "Nama QC",
        "Tanggal Masuk",
        "Nama Penitip",
        "Barang",
    ];

    return (
        <>
            <div className="flex max-lg:flex-wrap p-5 gap-5 lg:flex-nowrap lg:p-20 w-[100%]">
                <SidebarNavGudang />

                {isLoading ? (
                    <div className="justify-center items-center text-center">
                        <SyncLoader color="#F5CB58" size={10} className="mt-4 mx-auto" />
                        <h6 className="mt-2 mb-0">Loading...</h6>
                    </div>
                ) : (
                    <div className="bg-white w-full lg:w-full border border-gray-300 text-start gap-y-4 shadow-md mt-5">
                        <div className="px-4 py-6 flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                            <p>
                                <strong>DETAIL BARANG</strong>
                            </p>
                            <button
                                className="bg-[#235b2d] hover:bg-[#283d21] text-white px-4 py-2 rounded-lg flex gap-2"
                                onClick={() => {
                                    setShowModalAdd(true);
                                    setSelectedPenitipan(null);
                                }}
                            >
                                <IoAdd size={20} />
                                <span className="hidden sm:block">Tambah Barang</span>
                            </button>
                            <div className="relative w-full sm:w-1/2">
                                <FontAwesomeIcon
                                    icon={faSearch}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                                />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full h-10 bg-[#F0F0F0] rounded-4xl pl-10 pr-4 py-2 focus:outline-none"
                                    placeholder="Search..."
                                />
                            </div>
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
                                    {currentData.map((org) => {
                                        const barangList = data.filter(
                                            (item) => item.id_penitipan === org.id_penitipan
                                        );
                                        return (
                                            <tr
                                                key={org.id_penitipan}
                                                className="hover:bg-gray-50 transition-all"
                                            >
                                                <td className="px-4 py-3">
                                                    {org.id_penitipan}
                                                    <button
                                                        className="ml-2 bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-full"
                                                        title="Edit"
                                                        onClick={() => {
                                                            setPilihPenitipan({
                                                                id_penitipan: org.id_penitipan,
                                                                id_pegawai: org.id_pegawai,
                                                                tanggal_masuk: org.tanggal_masuk,
                                                                id_penitip: org.id_penitip,
                                                            });
                                                            setShowModalEdit(true);
                                                            setShowModal(false);
                                                            setShowModalView(false);
                                                        }}
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        className="ml-2 bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full"
                                                        title="Print Nota"
                                                        onClick={() => handlePrintNota(org.id_penitipan)}
                                                    >
                                                        <FaPrint size={16} />
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">{getNamaPegawai(org.id_pegawai)}</td>
                                                <td className="px-4 py-3">
                                                    {org.tanggal_masuk instanceof Date
                                                        ? org.tanggal_masuk.toLocaleDateString()
                                                        : org.tanggal_masuk}
                                                </td>
                                                <td className="px-4 py-3">{getNamaPenitip(org.id_penitip)}</td>
                                                <td className="px-4 py-3">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {barangList.map((barang) => (
                                                            <div
                                                                key={barang.id_barang}
                                                                className="relative border rounded-xl p-4 shadow-md bg-gray-50 text-left"
                                                            >
                                                                <p className="font-semibold text-sm truncate">
                                                                    {barang.nama}
                                                                </p>
                                                                <p className="text-xs text-gray-500 truncate">
                                                                    {barang.deskripsi}
                                                                </p>
                                                                <p className="text-xs font-medium mt-1">
                                                                    {getNamaKategori(barang.id_kategori)} |{" "}
                                                                    {barang.status_barang}
                                                                </p>
                                                                <div className="absolute top-2 right-2 flex gap-2">
                                                                    <button
                                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white p-1.5 rounded-full"
                                                                        title="Edit"
                                                                        onClick={() => {
                                                                            setSelectedPenitipan({
                                                                                ...barang,
                                                                                id_penitipan: org.id_penitipan,
                                                                                id_pegawai: org.id_pegawai,
                                                                            });
                                                                            setShowModal(true);
                                                                            setShowModalView(false);
                                                                        }}
                                                                    >
                                                                        <Edit size={16} />
                                                                    </button>
                                                                    <button
                                                                        className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded-full"
                                                                        title="View"
                                                                        onClick={() => {
                                                                            setSelectedPenitipan({
                                                                                ...barang,
                                                                                id_penitipan: org.id_penitipan,
                                                                                id_pegawai: org.id_pegawai,
                                                                                tanggal_masuk: org.tanggal_masuk,
                                                                                id_penitip: org.id_penitip,
                                                                            } as Barang & {
                                                                                tanggal_masuk: Date;
                                                                                id_penitip: number;
                                                                                id_pegawai: number;
                                                                            });
                                                                            setShowModalView(true);
                                                                            setShowModal(false);
                                                                        }}
                                                                    >
                                                                        <FaEye size={16} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex items-center justify-between px-4 py-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-700">Rows per page:</span>
                                <select
                                    value={dataPerPage}
                                    onChange={(e) => {
                                        setCurrentPage(1);
                                        setDataPerPage(parseInt(e.target.value));
                                    }}
                                    className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                    {[5, 10, 20, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="text-sm text-gray-700">
                                {`${indexOfFirstData + 1}-${Math.min(
                                    indexOfLastData,
                                    filteredData.length
                                )} of ${filteredData.length}`}
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="text-gray-600 hover:text-black disabled:text-gray-300 cursor-pointer"
                                >
                                    <MdChevronLeft size={40} />
                                </button>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="text-gray-600 hover:text-black disabled:text-gray-300 cursor-pointer"
                                >
                                    <MdChevronRight size={40} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showModal && selectedPenitipan && (
                    <ModalEditPenitipan
                        show={showModal}
                        dataPenitipan={{
                            ...selectedPenitipan,
                            tanggal_masuk: (selectedPenitipan as any).tanggal_masuk ?? "",
                        }}
                        id_pegawai={selectedPenitipan.id_pegawai}
                        id_penitipan={selectedPenitipan.id_penitipan}
                        onClose={() => {
                            setShowModal(false);
                            setShowModalView(false);
                        }}
                        onSuccessEdit={() => {
                            fetchPenitipan();
                            fetchBarang();
                            fetchKategori();
                        }}
                    />
                )}
                {showModalEdit && pilihPenitipan && (
                    <EditPenitipan
                        show={showModalEdit}
                        dataPenitipan={{
                            ...pilihPenitipan,
                            tanggal_masuk: (pilihPenitipan as any).tanggal_masuk ?? "",
                            id_penitip: (pilihPenitipan as any).id_penitip ?? 0,
                        }}
                        id_pegawai={pilihPenitipan.id_pegawai}
                        id_penitipan={pilihPenitipan.id_penitipan}
                        onClose={() => {
                            setShowModal(false);
                            setShowModalEdit(false);
                            setShowModalView(false);
                        }}
                        onSuccessEdit={() => {
                            fetchPenitipan();
                            fetchBarang();
                            fetchKategori();
                        }}
                    />
                )}
                {showModalView && selectedPenitipan && (
                    <ModalViewPenitipan
                        show={showModalView}
                        dataPenitipan={{
                            ...selectedPenitipan,
                            tanggal_masuk: (selectedPenitipan as any).tanggal_masuk ?? "",
                            id_penitip: (selectedPenitipan as any).id_penitip ?? 0,
                        }}
                        id_penitipan={selectedPenitipan.id_penitipan}
                        onClose={() => {
                            setShowModal(false);
                            setShowModalEdit(false);
                            setShowModalView(false);
                        }}
                        onSuccessEdit={() => {
                            fetchPenitipan();
                            fetchBarang();
                            fetchKategori();
                        }}
                    />
                )}
                {showModalAdd && (
                    <ModalAddPenitipan
                        show={showModalAdd}
                        onClose={() => setShowModalAdd(false)}
                        requestData={
                            selectedPenitipan
                                ? {
                                    ...selectedPenitipan,
                                    tanggal_masuk: (selectedPenitipan as any).tanggal_masuk ?? "",
                                    id_penitip: (selectedPenitipan as any).id_penitip ?? 0,
                                }
                                : {
                                    id_barang: 0,
                                    id_penitipan: 0,
                                    id_kategori: "",
                                    id_hunter: "",
                                    nama: "",
                                    deskripsi: "",
                                    foto: null,
                                    berat: 0,
                                    isGaransi: false,
                                    akhir_garansi: new Date(),
                                    status_perpanjangan: false,
                                    harga: 0,
                                    tanggal_akhir: new Date(),
                                    batas_ambil: new Date(),
                                    status_barang: "",
                                    tanggal_ambil: "",
                                    id_pegawai: 0,
                                    tanggal_masuk: "",
                                    id_penitip: 0,
                                }
                        }
                        onSuccessAdd={() => {
                            fetchPenitipan();
                            fetchBarang();
                            fetchKategori();
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default GudangPenitipan;