import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { AddPegawai } from "../../../api/ApiAdmin"; 

interface ModalAddPegawaiProps {
    onClose: () => void;
    show: boolean;
    onSuccessAdd: () => void;
}

const ModalAddPegawai = ({ onClose, show, onSuccessAdd }: ModalAddPegawaiProps) => {
    const [data, setData] = useState({
        id_role: 0,
        nama: "",
        email: "",
        password: "",
        tanggal_masuk: "",
        tanggal_lahir: "",
        wallet: 0,
    });

    const [isPending, setIsPending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData({ ...data, [name]: value });
    };

    const submitData = (event: any) => {
        event.preventDefault();
        setIsPending(true);
        const formData = new FormData();
		formData.append("id_role", data.id_role.toString());
        formData.append("nama", data.nama);
        formData.append("email", data.email);
        formData.append("password", data.password);
        formData.append("tanggal_masuk", new Date(data.tanggal_masuk).toISOString().split('T')[0]);
        formData.append("tanggal_lahir", new Date(data.tanggal_lahir).toISOString().split('T')[0]);
        formData.append("wallet", data.wallet.toString());

        AddPegawai(formData)
            .then(() => {
                setIsPending(false);
                toast.success("Employee added successfully");
                onSuccessAdd();
                onClose();
            })
            .catch(() => {
                setIsPending(false);
                const currentDate = new Date();
                const c = currentDate.toISOString().split('T')[0];
                if (data.id_role === 0) {
                    toast.error("Role is required");
                    return false;
                } else if(data.nama === "") {
                    toast.error("Name is required");
                    return false;
                } else if (data.password.length < 8) {
                    toast.error("Password is required and must be at least 8 characters long");
                    return false;
                } else if (data.tanggal_masuk < data.tanggal_lahir) {
                    toast.error("Hire date must be greater than born date");
                    return false;
                } else if (data.tanggal_lahir >= c ) {
                    toast.error("Born date is required and must be in the past");
                    return false;
                } else {
                    toast.error("Email already exists");
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
                            Add Employee
                        </h3>
                        <div>
                            <Label htmlFor="id_role">Role Employee</Label>
                            <div className="flex items-center justify-between gap-1">
                                <div
                                    onClick={() => setData({ ...data, id_role: 2 })}
                                    className={`px-4 py-2 rounded ${data.id_role === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Owner
                                </div>
                                <div
                                    onClick={() => setData({ ...data, id_role: 3 })}
                                    className={`px-4 py-2 rounded ${data.id_role === 3 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Kurir
                                </div>
                                <div
                                    onClick={() => setData({ ...data, id_role: 4 })}
                                    className={`px-4 py-2 rounded ${data.id_role === 4 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Hunter
                                </div>
                                <div
                                    onClick={() => setData({ ...data, id_role: 5 })}
                                    className={`px-4 py-2 rounded ${data.id_role === 5 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    Gudang
                                </div>
                                <div
                                    onClick={() => setData({ ...data, id_role: 6 })}
                                    className={`px-4 py-2 rounded ${data.id_role === 6 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                                >
                                    CS
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="nama">Employee Name</Label>
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
                            <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <TextInput
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        onChange={handleChange}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                    </button>
                                </div>
                        </div>
                        <div>
                            <Label htmlFor="tanggal_masuk">Hire Date</Label>
                            <TextInput
                                id="tanggal_masuk"
                                name="tanggal_masuk"
                                type="date"
                                value={data.tanggal_masuk}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="tanggal_lahir">Born Date</Label>
                            <TextInput
                                id="tanggal_lahir"
                                name="tanggal_lahir"
                                type="date"
                                value={data.tanggal_lahir}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="wallet">Wallet</Label>
                            <TextInput
                                id="wallet"
                                name="wallet"
                                type="number"
                                value={data.wallet}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full rounded-2xl bg-[#1F510F] p-2 text-center text-white cursor-pointer">
                            <button type="submit" className="w-full">
                                {isPending ? (
                                    <SyncLoader color="#F5CB58" size={10} />
                                ) : (
                                    <strong>Add Employee</strong>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    );
};

export default ModalAddPegawai;
