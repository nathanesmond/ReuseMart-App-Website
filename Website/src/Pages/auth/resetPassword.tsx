import LoginImage from "../../assets/images/login_image.png";
import useAxios from "../../api";
import { SyncLoader } from "react-spinners";
import React, { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const ResetPassword = () => {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	const email = searchParams.get("email") || "";
	const token = searchParams.get("token") || "";
	const userType = searchParams.get("user_type") || "pembeli";

	const [password, setPassword] = useState("");
	const [passwordConfirmation, setPasswordConfirmation] = useState("");
	const [message, setMessage] = useState("");

	const [loading, setLoading] = useState(false);
	const handleReset = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			await useAxios.post("/reset-password", {
				email,
				token,
				user_type: userType,
				password,
				password_confirmation: passwordConfirmation,
			});
			toast.success("Password Berhasil Direset")
			setTimeout(() => navigate("/login"), 2000);
		} catch (error: any) {
			toast.error("Password dan Konfirmasi Password tidak sesuai!");
			setMessage(error.response?.data?.message || "Terjadi kesalahan.");
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
					<strong className="text-3xl">Enter Your New Password</strong>
				</h3>
				<form className="flex flex-col gap-4 w-full mt-10" onSubmit={handleReset}>
					<div className="divide-y divide-gray-200">
						<div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
							<div className="relative">
								<input
									id="newpassword"
									name="newpassword"
									type="password"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="New Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									New password
								</label>
							</div>
							<div className="relative">
								<input
									id="confirmnewpassword"
									name="confirmnewpassword"
									type="password"
									className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
									placeholder="New Password"
									value={passwordConfirmation}
									onChange={(e) => setPasswordConfirmation(e.target.value)}
								/>
								<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
									Confirmation password
								</label>
							</div>

							<div className="relative items-center justify-center flex mt-10">
								<button className="bg-[#1F510F] text-white rounded-md px-2 py-1 w-3/4 h-12 cursor-pointer" type="submit">
									{loading ? <SyncLoader size={10} color="white" /> : <strong>Submit</strong>}
								</button>
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
