import {
	Button,
	Modal,
	ModalBody,
	ModalFooter,
	ModalHeader,
} from "flowbite-react";
import { useState, useEffect } from "react";
import { FetchHistoryTransaksiById } from "../../api/ApiPenitip";
import { SyncLoader } from "react-spinners";
import Frieren from "../../assets/images/Frieren.jpg";

const ModalDetailHistory = ({ idBarang, show, onClose }: any) => {
	const [data, setData] = useState<any>(null);

	const fetchHistoryTransaksiById = async () => {
		try {
			FetchHistoryTransaksiById(idBarang)
				.then((response) => {
					console.log(response);
					setData(response.data[0]);
				})
				.catch((error: any) => {
					console.error("Gagal mengambil data history", error);
				});
		} catch (error: any) {
			throw error.response.data;
		}
	};

	useEffect(() => {
		fetchHistoryTransaksiById();
	}, []);

	const handleClose = () => {
		onClose();
	};

	return (
		<>
			<Modal show={show} onClose={handleClose} dismissible>
				<ModalHeader>History Detail</ModalHeader>
				<ModalBody>
					{data === null ? (
						<>
							<div className="flex justify-center">
								<SyncLoader size={10} color="#F5CB58" />
							</div>
						</>
					) : (
						<>
							<div className="flex max-sm:flex-wrap gap-6">
								<div className="w-1/2">
									<img
										src={Frieren}
										className="object-cover w-full h-full"
										alt=""
									/>
								</div>

								<div>
									<p className="text-3xl font-semibold text-black">
										{data.nama_barang}
									</p>
									<div className="flex gap-4 mt-2">
										{/* <p>inibintang</p>
                        <p className='text-gray-600'>4 Review</p> */}
										<p className="font-bold">
											Status :{" "}
											<span className="text-gray-600">{data.status_barang}</span>
										</p>
									</div>
									<p className="text-2xl font-bold text-green-600 mt-2">
										Rp {data.harga}
									</p>
									<hr className="my-2 border-t  w-[95%] border-gray-300" />
									{/* <p className='text-lg font-bold '>ini toko penitipnya</p> */}
									<p className="text-md font-semibold ">Description :</p>
									<p className="text-sm font-normal text-gray-500 break-words whitespace-normal">
										{data.deskripsi}
									</p>
								</div>
							</div>
						</>
					)}
				</ModalBody>
				<ModalFooter>
					
				</ModalFooter>
			</Modal>
		</>
	);
};

export default ModalDetailHistory;
