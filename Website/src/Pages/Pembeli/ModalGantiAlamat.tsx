"use client";

import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useEffect, useState } from "react";
import { FetchAlamat } from "../../api/ApiAlamat";
import { Card } from "flowbite-react";
import { SyncLoader } from "react-spinners";
interface AlamatUtama {
	id_alamat: number;
	nama_alamat: string;
	nama_kota: string;
	nama_jalan: string;
	kode_pos: Int16Array;
}

interface ModalGantiAlamatProps {
	alamat: AlamatUtama;
	onClose: () => void;
	show: boolean;
	onGantiAlamat: (alamat: AlamatUtama) => void;
}
export function ModalGantiAlamat({
	alamat,
	onClose,
	show,
	onGantiAlamat,
}: ModalGantiAlamatProps) {
	const [allAlamat, setAllAlamat] = useState<AlamatUtama[]>([]);
    const [isPending, setIsPending] = useState(false);
	const fetchAllAlamat = () => {
        setIsPending(true);
		FetchAlamat()
			.then((response) => {
				setAllAlamat(response.alamat);
				console.log(response);
			})
			.catch((error) => {
				console.error("Error fetching address:", error);
			})
            .finally(() =>{
                setIsPending(false);
            });
	};

	const handleClose = () => {
		onClose();
	};

	useEffect(() => {
		fetchAllAlamat();
	}, []);

	const handleClick = (alamatBaru: any) => {
		onGantiAlamat(alamatBaru);
		onClose();
	};

	return (
		<>
			<Modal show={show} onClose={handleClose} dismissible>
				<ModalHeader>Choose Address</ModalHeader>
				<ModalBody>
                    {isPending ? 
                        <div className="flex justify-center">
                            <SyncLoader color="#36d7b7" size={20}/>
                        </div>
                        
                    : 
                    
                        <>
                            {allAlamat.map((alamatMap, idx) => (
                                    <Card
                                        key={idx}
                                        href="#"
                                        className="w-full mt-2"
                                        onClick={() => handleClick(alamatMap)}
                                    >
                                        <div className="flex items-center gap-2">
                                            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                {alamatMap.nama_alamat}
                                            </h5>
                                            {alamatMap.id_alamat === alamat.id_alamat && (
                                                <span className="mt-1.5 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                                    Current
                                                </span>
                                            )}
                                        </div>
                                        <p className="font-normal text-gray-700 dark:text-gray-400">
                                            {alamatMap.nama_jalan}, {alamatMap.nama_kota},{" "}
                                            {alamatMap.kode_pos}
                                        </p>
                                    </Card>
                                ))}
                        </>
                    }
                        
				</ModalBody>
			</Modal>
		</>
	);
}
export default ModalGantiAlamat;
