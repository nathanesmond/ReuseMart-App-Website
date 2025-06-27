import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useEffect } from "react";
import RegisterImage from "../../assets/images/registerImage.png";
import { SyncLoader } from "react-spinners";
import { Link, useNavigate } from "react-router-dom";
import { RegisterOrganisasi } from "../../api/apiAuth";
import { FileInput, HelperText, Label } from "flowbite-react";

interface RegisterOrganisasiProps {
	nama: string;
	email: string;
	password: string;
	telp: string;
	alamat: string;
	foto?: File;
}

const Register_Organisasi = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			toast.error("Anda sudah login!");
			navigate("/");
		} 
	}, [navigate]);

	const [data, setData] = useState<RegisterOrganisasiProps>({
		nama: "",
		email: "",
		password: "",
		telp: "",
		alamat: "",
	});

	const handleConfirmPassword = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setConfirmPassword(event.target.value);
	};

	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const handleChange = (event: any) => {
		setData({ ...data, [event.target.name]: event.target.value });
	};
	const handleFotoChange = (event: any) => {
		setData({ ...data, foto: event.target.files[0] });
	}
	const Register = (event: any) => {
		event.preventDefault();
		setLoading(true);

		if (data.password != confirmPassword) {
			toast.error("Password dan Confirm Password tidak sesuai!");
			setLoading(false);
			return;
		}
		const formData = new FormData();
		formData.append("nama", data.nama);
		formData.append("email", data.email);
		formData.append("password", data.password);
		formData.append("telp", data.telp);
		formData.append("alamat", data.alamat);
		formData.append("foto", data.foto || "");
		

		RegisterOrganisasi(formData)
			.then((response) => {
				toast.success(response.message);
				setLoading(false);
				setTimeout(() => {
					navigate("/login");
				}, 2000);
			})
			.catch((err) => {
				setLoading(false);
				toast.error(err.message);
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div className="flex flex-col md:flex-row w-full h-full min-h-screen">
			<div className="hidden md:flex flex-col w-full md:w-1/2 h-auto bg-white">
				<img src={RegisterImage} alt="Register" className="w-full h-full object-cover" />
			</div>
	
			<div className="flex flex-col w-full md:w-1/2 bg-gray-100 justify-start h-auto p-10 sm:p-20">
				<h1 className="text-4xl sm:text-6xl font-bold mb-4">ReUseMart</h1>
				<h3 className="self-start mt-4 sm:mt-10">
					<strong className="text-2xl sm:text-3xl">Create Account as Organization</strong>
				</h3>
	
				<form className="flex flex-col gap-4 w-full mt-5" onSubmit={Register}>
					<div className="space-y-4 text-gray-700 text-base sm:text-lg">
						<div className="relative w-full">
							<input
								id="nama"
								name="nama"
								type="text"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Organization Name"
								onChange={handleChange}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Organization Name
							</label>
						</div>
	
						<div className="relative w-full">
							<input
								id="email"
								name="email"
								type="email"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Email Address"
								onChange={handleChange}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Email Address
							</label>
						</div>
	
						<div className="relative w-full">
							<input
								id="telp"
								name="telp"
								type="text"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Phone Number"
								onChange={handleChange}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Phone Number
							</label>
						</div>
	
						<div className="relative w-full">
							<input
								id="password"
								name="password"
								type="password"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Password"
								onChange={handleChange}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Password
							</label>
						</div>
	
						<div className="relative w-full">
							<input
								id="confirmpassword"
								name="confirmpassword"
								type="password"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Confirm Password"
								onChange={handleConfirmPassword}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Confirm Password
							</label>
						</div>
	
						<div className="relative w-full">
							<input
								id="alamat"
								name="alamat"
								type="text"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Address"
								onChange={handleChange}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:top-2 peer-placeholder-shown:text-base transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Address
							</label>
						</div>
	
						<div className="w-full">
							<Label htmlFor="file" className="mb-2 block text-gray-600 text-sm">Image</Label>
							<FileInput id="file" name="foto" accept="image/*" onChange={handleFotoChange}/>
						</div>
	
						<div className="flex justify-center mt-6">
							<button
								className="bg-[#1F510F] text-white rounded-md px-2 py-2 w-full sm:w-3/4 h-12"
								type="submit"
							>
								{loading ? (
									<SyncLoader color="#F5CB58" size={10} />
								) : (
									<strong>Create Account</strong>
								)}
							</button>
						</div>
	
						<div className="flex justify-center">
							<p className="text-base">
								<strong>
									Already have an account?{" "}
									<Link to="/login" className="text-[#F5CB58]">Login</Link>
								</strong>
							</p>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
	
};

export default Register_Organisasi;
