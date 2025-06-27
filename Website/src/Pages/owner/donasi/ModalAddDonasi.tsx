import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Label, Modal, ModalBody, ModalHeader, TextInput, FileInput } from "flowbite-react";
import { addDetailDonasi, fetchBarangForDonasi } from "../../../api/ApiOwner";
import { FetchBarang } from "../../../api/ApiBarang";

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

interface ModalAddDonasiProps {
    onClose: () => void;
    show: boolean;
    onSuccessAdd: () => void;
    requestData: {
        id_request: number;
        id_barang: number;
        id_pegawai: number;
        tanggal_donasi: Date;
        nama_penerima: string;
    };
}

const ModalAddDonasi = ({ onClose, show, onSuccessAdd, requestData }: ModalAddDonasiProps) => {
    const [data, setData] = useState({
        id_request: requestData.id_request,
        id_barang: "",
        id_pegawai: 0,
        tanggal_donasi: "",
        nama_penerima: "",
    });
    const [barang, setBarang] = useState<Barang[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const submitData = (event: any) => {
        event.preventDefault();
        setIsPending(true);

        const formData = new FormData();
        formData.append("id_request", data.id_request.toString());
        formData.append("id_barang", data.id_barang.toString());
        formData.append("tanggal_donasi", data.tanggal_donasi);
        formData.append("nama_penerima", data.nama_penerima);

        addDetailDonasi(formData)
            .then((response) => {
                setIsPending(false);
                toast.success(response.message);
                onSuccessAdd();
                onClose();
            })
            .catch((err) => {
                console.log(err);
                setIsPending(false);
                toast.error("Error: " + err.message);
            });
    };

    const fetchBarang = () => {  
		setIsLoading(true);
		fetchBarangForDonasi()
			.then((response) => {
				setBarang(response.data);
				setIsLoading(false);
                
			})
			.catch((err) => {
				console.log(err);
				setIsLoading(false);
			});
	};

    useEffect(() => {
        fetchBarang();
    }, []);

    return (
        <Modal show={show} dismissible size="md" popup onClose={onClose}>
            <ModalHeader />
            <ModalBody>
                <form onSubmit={submitData}>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Add Donation
                        </h3>
                        <div>
                            <Label htmlFor="id_barang">Select Item</Label>
                            <select
                                id="id_barang"
                                name="id_barang"
                                value={data.id_barang}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Item</option>
                                {barang.map((item) => (
                                    <option key={item.id_barang} value={item.id_barang}>
                                        {item.nama}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <Label htmlFor="tanggal_donasi">Donation Date</Label>
                            <TextInput
                                id="tanggal_donasi"
                                name="tanggal_donasi"
                                type="date"
                                value={data.tanggal_donasi}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="nama_penerima">Recipient</Label>
                            <TextInput
                                id="nama_penerima"
                                name="nama_penerima"
                                value={data.nama_penerima}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full rounded-2xl bg-[#1F510F] p-2 text-center text-white cursor-pointer">
                            <button type="submit" className="w-full">
                                {isPending ? (
                                    <SyncLoader color="#F5CB58" size={10} />
                                ) : (
                                    <strong>Add Donation</strong>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default ModalAddDonasi;

