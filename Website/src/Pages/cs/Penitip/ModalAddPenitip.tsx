import { useState } from "react";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Label, Modal, ModalBody, ModalHeader, TextInput, FileInput } from "flowbite-react";
import { AddPenitip } from "../../../api/ApiAdmin"; // Assume you have an API call for addPenitip

interface ModalAddPenitipProps {
    onClose: () => void;
    show: boolean;
    onSuccessAdd: () => void;
}

const ModalAddPenitip = ({ onClose, show, onSuccessAdd }: ModalAddPenitipProps) => {
    const [data, setData] = useState({
        nama: "",
        email: "",
        telepon: "",
        no_ktp: "",
        password: "",
        foto_ktp: null as File | null,
    });
    const [isPending, setIsPending] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const handleFotoChange = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            setData({ ...data, foto_ktp: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submitData = (event: any) => {
        event.preventDefault();
        setIsPending(true);

        const formData = new FormData();
        formData.append("nama", data.nama);
        formData.append("email", data.email);
        formData.append("telepon", data.telepon);
        formData.append("no_ktp", data.no_ktp);
        formData.append("password", data.password);
        formData.append("foto_ktp", data.foto_ktp!);

        AddPenitip(formData)
            .then((response) => {
                console.log("no_ktp before sending:", data.no_ktp);

                setIsPending(false);
                toast.success(response.message);
                onSuccessAdd();
                onClose();
            })
            .catch((err) => {
                setIsPending(false);
                if (err.response && err.response.status === 422) {
                    const validationErrors = err.response.data.errors;
                    for (const key in validationErrors) {
                        if (validationErrors.hasOwnProperty(key)) {
                            toast.error(validationErrors[key][0]);
                        }
                    }
                } else {
                    toast.error("Error: " + err.message);
                }
            });

    };

    return (
        <Modal show={show} dismissible size="md" popup onClose={onClose}>
            <ModalHeader />
            <ModalBody>
                <form onSubmit={submitData}>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                            Add Penitip
                        </h3>
                        {previewImage && (
                            <div className="flex justify-center items-center">
                                <img
                                    src={previewImage}
                                    alt="Preview Image"
                                    className="w-32 h-32 object-cover"
                                />
                            </div>
                        )}

                        <div>
                            <Label htmlFor="nama">Penitip Name</Label>
                            <TextInput
                                id="nama"
                                name="nama"
                                value={data.nama}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <TextInput
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="telepon">Phone Number</Label>
                            <TextInput
                                id="telepon"
                                name="telepon"
                                value={data.telepon}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="no_ktp">No KTP</Label>
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
                            <Label htmlFor="password">Password</Label>
                            <TextInput
                                id="password"
                                name="password"
                                type="password"
                                value={data.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="foto_ktp">KTP Image</Label>
                            <FileInput
                                id="foto_ktp"
                                name="foto_ktp"
                                accept="image/*"
                                onChange={handleFotoChange}
                            />
                        </div>
                        <div className="w-full rounded-2xl bg-[#1F510F] p-2 text-center text-white cursor-pointer">
                            <button type="submit" className="w-full">
                                {isPending ? (
                                    <SyncLoader color="#F5CB58" size={10} />
                                ) : (
                                    <strong>Add Penitip</strong>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default ModalAddPenitip;
