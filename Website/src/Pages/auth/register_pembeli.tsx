import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import RegisterImage from "../../assets/images/registerImage.png";
import { RegisterPembeli } from "../../api/apiAuth";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

interface registerProps {
	nama: string,
	email: string,
	password: string,
	telepon: string
}

const Register_Pembeli = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (token) {
			toast.error("Anda sudah login!");
			navigate("/");
		} 
	}, [navigate]);

	const [data, setData] = useState<registerProps>({
		nama: "",
		email: "",
		password: "",
		telepon: ""
	});

	const handleConfirmPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
		setConfirmPassword(event.target.value);
	};

	const [confirmPassword, setConfirmPassword] = useState<string>("");

	const handleChange = (event: any) => {
		setData({ ...data, [event.target.name]: event.target.value });
	}

	const Register = (event: any) => {
		event.preventDefault();
		setLoading(true);

		if (data.password != confirmPassword) {
			toast.error("Password dan Confirm Password tidak sesuai!");
			setLoading(false);
			return;
		}

		RegisterPembeli(data)
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
			}).finally(() => {
				setLoading(false);
			});
	}

	return (
		<div className="flex flex-col md:flex-row w-full h-full">
			<div className="hidden md:flex flex-col w-full md:w-1/2 h-auto bg-white">
				<img src={RegisterImage} alt="Login" className="w-full h-full" />
			</div>
			<div className="flex flex-col w-full md:w-1/2 bg-gray-100 justify-start h-auto p-10 sm:p-20">
				<h1 className="text-4xl sm:text-6xl font-bold mb-4">ReUseMart</h1>
				<h3 className="self-start mt-4 sm:mt-10">
					<strong className="text-2xl sm:text-3xl">Create Account as Buyer</strong>
				</h3>
				<form className="flex flex-col gap-4 w-full mt-5" onSubmit={Register}>

					<div className="divide-y divide-gray-200">
						<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
							<div className="relative w-1/2">
								<input
									id="nama"
									name="nama"
									type="text"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Full Name"
									onChange={handleChange}
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									Full Name
								</label>
							</div>
							<div className="relative w-1/2">
								<input
									id="email"
									name="email"
									type="email"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Email Address"
									onChange={handleChange}
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									Email Address
								</label>
							</div>

							<div className="relative w-1/2">
								<input
									id="telepon"
									name="telepon"
									type="text"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Phone Number"
									onChange={handleChange}
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									Phone Number
								</label>
							</div>

							<div className="relative w-1/2">
								<input
									id="password"
									name="password"
									type="password"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Password"
									onChange={handleChange}
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									Password
								</label>
							</div>

							<div className="relative w-1/2">
								<input
									id="confirmpassword"
									name="confirmpassword"
									type="password"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Confirm Password"
									onChange={handleConfirmPassword}
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									Confirm Password
								</label>
							</div>

							<div className="relative items-center justify-center flex mt-15">
								<button className="bg-[#1F510F] text-white rounded-md px-2 py-1 w-3/4 h-12 cursor-pointer" type="submit">
									{loading ? <SyncLoader size={10} color="white" /> : <strong>Create Account</strong>}
								</button>
							</div>
							<div className="relative  flex justify-center">
								<p className="text-l ">
									<strong>Already have an account ?<Link to="/login" className="text-[#F5CB58]"> Login</Link> </strong>
								</p>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register_Pembeli;
