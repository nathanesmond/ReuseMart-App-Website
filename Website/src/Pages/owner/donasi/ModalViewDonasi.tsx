import { useEffect, useState } from "react";
import {
	Label,
	Modal,
	ModalBody,
	ModalHeader,
} from "flowbite-react";

import { FetchAllBarang } from "../../../api/ApiOwner";

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

interface ModalViewDonasiProps {
	dataDetailDonasi: {
		id_detaildonasi: number;
        id_request: number;
        id_pegawai: number;
        id_barang: number;
        tanggal_donasi: Date;
        nama_penerima: string;
		reward_sosial: number;
	};
	onClose: () => void;
	id_detaildonasi: number;
	show: boolean;
	onSuccessEdit: () => void;
}


const ModalViewDonasi = ({
	dataDetailDonasi,
    
	onClose,
	show,
}: ModalViewDonasiProps) => {
	const [data] = useState(dataDetailDonasi);
    const [barang, setBarang] = useState<Barang[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getNamaBarang = (id_barang: number) => {
        const barangItem = barang.find((item) => item.id_barang === id_barang);
        return barangItem ? barangItem.nama : "";
    };

    const fetchBarang = () => {  
		setIsLoading(true);
		FetchAllBarang()
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
    
	const handleClose = () => {
		onClose();
	};


	return (
		<>
			<Modal show={show} dismissible size="md" popup onClose={handleClose}>
				<ModalHeader />
				<ModalBody>
					
						<div className="space-y-6">
							<h3 className="text-xl font-medium text-gray-900 dark:text-white">
								View Donation
							</h3>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="alamat">Donation ID</Label>
								</div>
								<p className="text-gray-500">{data.id_detaildonasi}</p>	
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="alamat">Request ID</Label>
								</div>
								<p className="text-gray-500">{data.id_request}</p>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama">Donation Date</Label>
                                    <p className="text-gray-500">
                                        {new Date(data.tanggal_donasi).toLocaleDateString("id-ID", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                        })}
                                    </p>
								</div>
							</div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="nama_penerima">Recipient</Label>
								</div>
								<p className="text-gray-500">{data.nama_penerima}</p>
							</div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="alamat">Item</Label>
                                </div>
                                <p className="text-gray-500">{getNamaBarang(data.id_barang)}</p>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="alamat">Item ID</Label>
                                </div>
                                <p className="text-gray-500">{data.id_barang}</p>
                            </div>
							<div>
								<div className="mb-2 block">
									<Label htmlFor="alamat">Social Reward</Label>
								</div>
								<p className="text-gray-500">{data.reward_sosial}</p>
							</div>
						</div>
					
				</ModalBody>
			</Modal>
		</>
	);
};

export default ModalViewDonasi;
