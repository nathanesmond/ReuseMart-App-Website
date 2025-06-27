import React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react";

type Pembelian = {
    id_pembelian: number;
    id_pembeli: number;
    total: number;
    ongkir: number;
    nomor_nota: string;
    tanggal_laku: Date;
    bukti_pembayaran: string;
    nama_pembeli: string;
};

interface ViewBuktiPembayaranProps {
    show: boolean;
    dataPembelian: Pembelian | null;
    onClose: () => void;
}

const ViewBuktiPembayaranModal = ({ show, dataPembelian, onClose }: ViewBuktiPembayaranProps) => {
    return (
        <Modal show={show} onClose={onClose}>
            <ModalHeader>Proof of Payment - {dataPembelian?.nama_pembeli || "Unknown"} </ModalHeader>
            <ModalBody>
                <div className="space-y-6 pb-5">
                    {dataPembelian?.bukti_pembayaran ? (
                        <div className="flex justify-center">
                            <img
                                src={dataPembelian.bukti_pembayaran}
                                alt="Proof of Payment"
                                className="w-100 h-100 object-fit rounded-lg"
                            />
                        </div>
                    ) : (
                        <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                            No proof of payment available.
                        </p>
                    )}
                </div>
            </ModalBody>
        </Modal>
    );
};

export default ViewBuktiPembayaranModal;