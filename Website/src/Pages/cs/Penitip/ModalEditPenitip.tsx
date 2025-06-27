import { useState } from "react";

import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import {
    Label,
    Modal,
    ModalBody,
    ModalHeader,
    TextInput,
    FileInput,
} from "flowbite-react";

import { UpdatePenitip } from "../../../api/ApiAdmin";

interface ModalEditPenitipProps {
    dataPenitip: {
        id_penitip: number;
        nama: string;
        wallet: string;
        telepon: string;
        email: string;
        password: string;
        foto_ktp: File | string;
        no_ktp: number;
        badges: string;
        total_rating: number;
        poin: number;
    };
    onClose: () => void;
    idPenitip: number;
    show: boolean;
    onSuccessEdit: () => void;
}

const ModalEditPenitip = ({
    dataPenitip,
    onClose,
    idPenitip,
    show,
    onSuccessEdit,
}: ModalEditPenitipProps) => {
    const [data, setData] = useState(dataPenitip);
    const [isPending, setIsPending] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(
        dataPenitip.foto_ktp
            ? `${"http://127.0.0.1:8000"}/storage/${dataPenitip.foto_ktp}` // Gantilah ini dengan path URL foto yang sesuai
            : null
    );
    const handleClose = () => {
        onClose();
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const handleFotoChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setData({ ...data, foto_ktp: event.target.files[0] });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submitData = (event: any, idPenitip: number) => {
        event.preventDefault();
        setIsPending(true);

        const formData = new FormData();
        formData.append("nama", data.nama);
        formData.append("email", data.email);
        formData.append("telepon", data.telepon);
        formData.append("no_ktp", data.no_ktp.toString());
        formData.append("password", data.password);

        formData.append("foto_ktp", data.foto_ktp);


        UpdatePenitip(formData, idPenitip)
            .then((response) => {
                setIsPending(false);
                toast.success(response.message);
                onSuccessEdit();

                handleClose();
            })
            .catch((err) => {
                console.log(err);
                setIsPending(false);

                if (err.response && err.response.status === 422) {
                    const errors = err.response.data.errors;

                    if (errors) {
                        Object.keys(errors).forEach((field) => {
                            errors[field].forEach((msg: string) => {
                                toast.error(msg);
                            });
                        });
                    } else {
                        toast.error("Validation failed. Please check your input.");
                    }
                } else {
                    toast.error(err.response?.data?.message || "Something went wrong.");
                }
            });


    };

    return (
        <>
            <Modal show={show} dismissible size="md" popup onClose={handleClose}>
                <ModalHeader />
                <ModalBody>
                    <form action="submit" onSubmit={(e) => submitData(e, idPenitip)}>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                Edit Penitip
                            </h3>
                            {previewImage ? (
                                <div className="flex justify-center items-center">
                                    <img
                                        src={previewImage}
                                        alt="Preview Image"
                                        className="w-32 h-32 object-cover"
                                    />
                                </div>
                            ) : (
                                <p>No image selected</p>
                            )}

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="nama">Edit penitip name</Label>
                                </div>
                                <TextInput
                                    id="nama"
                                    name="nama"
                                    value={data.nama}
                                    placeholder="name@company.com"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="alamat">Edit email</Label>
                                </div>
                                <TextInput
                                    id="email"
                                    name="email"
                                    type="text"
                                    value={data.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="telp">Edit phone number</Label>
                                </div>
                                <TextInput
                                    id="telepon"
                                    name="telepon"
                                    type="text"
                                    value={data.telepon}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="telp">Edit Nomor KTP</Label>
                                </div>
                                <TextInput
                                    id="no_ktp"
                                    name="no_ktp"
                                    type="text"
                                    value={data.no_ktp}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="telp">Edit Password Penitip</Label>
                                </div>
                                <TextInput
                                    id="password"
                                    name="password"
                                    type="text"
                                    value={data.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label
                                        htmlFor="file"
                                        className=" text-gray-600 text-sm"
                                    >

                                        Edit Penitip Image
                                    </Label>
                                </div>
                                <FileInput
                                    id="foto_ktp"
                                    name="foto_ktp"
                                    accept="image/*"
                                    onChange={handleFotoChange}
                                />

                            </div>

                            <div className="w-full rounded-2xl bg-[#1F510F] p-2 text-center text-white cursor-pointer">
                                <button type="submit" className="w-full cursor-pointer">
                                    {isPending ? (
                                        <SyncLoader color="#F5CB58" size={10} />
                                    ) : (
                                        <strong>Edit</strong>
                                    )}
                                </button>
                            </div>

                            <div
                                className="w-full rounded-2xl bg-[#B33739] p-2 text-center text-white cursor-pointer"
                                onClick={handleClose}
                            >
                                <button className="w-full cursor-pointer">
                                    {" "}
                                    <strong>Cancel</strong>
                                </button>
                            </div>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
};

export default ModalEditPenitip;
