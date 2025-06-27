import React from "react";
import LoginImage from "../../assets/images/login_image.png";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAxios from "../../api";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";

const ForgotPassword = () => {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		console.log('Email yang dikirim: ', email);
		try {

			const response = await useAxios.post("/forgot-password", { email }
			);
			toast.success("Berhasil Mengirim Email");
			setMessage(response.data.message);

		} catch (error: any) {

			setMessage(error.response?.data?.message || "Terjadi kesalahan.");
			toast.error("Gagal Mengirim Email");
		} finally {
			setLoading(false);
		}
	};
	return (
		<div className="flex flex-row w-full">
			<div className="flex flex-col w-1/2 h-screen bg-white  ">
				<img src={LoginImage} alt="Login" className="w-full h-full" />
			</div>
			<div className="flex flex-col w-1/2 h-screen bg-gray-100 justify-start  p-20 max-sm:w-full">
				<h1 className="text-6xl font-bold mb-4">ReUseMart</h1>
				<h3 className="self-start mt-20">
					<strong className="text-3xl">Forgot Password</strong>
				</h3>
				<form className="flex flex-col gap-4 w-full mt-10" onSubmit={handleSubmit}>
					<div className="divide-y divide-gray-200">
						<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
							<div className="relative">
								<input
									id="email"
									name="email"
									type="text"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="Email address"
									onChange={(e) => setEmail(e.target.value)} required
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									Email
								</label>
							</div>

							<div className="relative items-center justify-center flex mt-10">
								<button className="bg-[#1F510F] text-white rounded-md px-2 py-1 w-3/4 h-12 cursor-pointer" type="submit">
									{loading ? <SyncLoader size={10} color="white" /> : <strong>Send Confirmation Mail</strong>}
								</button>
							</div>
						</div>
					</div>
				</form>
				<div className="relative flex justify-center">
					<Link to="/login" className="text-l">
						Already have an account?{" "}
						<strong className=" text-[#F5CB58]">Login</strong>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
