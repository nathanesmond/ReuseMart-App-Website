import React, { useRef, useEffect } from 'react';
import LoginImage from '../../assets/images/login_image.png';
import { Link, useNavigate } from 'react-router-dom';
import { LoginApi } from '../../api/apiAuth';
import { toast } from 'react-toastify';

const Login = () => {
	const navigate = useNavigate();
	const emailRef = useRef<any>(null);
	const passwordRef = useRef<any>(null);

	useEffect(() => {
		const token = sessionStorage.getItem('token');
		if (token) {
			toast.error('Anda sudah login!');
			navigate('/');
		}
	}, [navigate]);

	const HandleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		const data = {
			email: emailRef.current?.value,
			password: passwordRef.current?.value,
		};

		LoginApi(data)
			.then((response) => {
				sessionStorage.setItem('token', response.token);
				toast.success('Login successful!');

				if (response.role === 'Pembeli') {
					navigate('/');
				} else if (response.role === 'Organisasi') {
					navigate('/profile-organisasi');
				} else if (response.role === 'CS') {
					navigate('/CS/penitip');
				} else if (response.role === 'Admin') {
					navigate('/admin/organisasi');
				} else if (response.role === 'Gudang') {
					navigate('/gudang/manage');
				} else if (response.role === 'Owner') {
					navigate('/owner/donasi');
				} else if (response.role === 'Penitip') {
					navigate('/penitip/profile');
				}
			})
			.catch((error) => {
				console.log(error);
				toast.error(error.message);
			});
	};

	return (
		<div className="flex flex-col-reverse lg:flex-row w-full h-screen">
			<div className="w-full lg:w-1/2 h-64 lg:h-screen">
				<img
					src={LoginImage}
					alt="Login"
					className="w-full h-full object-cover"
				/>
			</div>

			{/* Form Section */}
			<div className="w-full lg:w-1/2 flex flex-col bg-gray-100 p-8 md:p-16 lg:p-20 justify-start">
				<h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4">
					Welcome to ReUseMart
				</h1>
				<h3 className="mt-10">
					<strong className="text-xl md:text-2xl lg:text-3xl">
						Sign In To ReUseMart
					</strong>
				</h3>

				<form
					className="flex flex-col gap-4 w-full mt-6 md:mt-10"
					onSubmit={HandleSubmit}
				>
					<div className="text-base leading-6 text-gray-700">
						{/* Email */}
						<div className="relative mt-4">
							<input
								id="email"
								name="email"
								type="text"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Email address"
								ref={emailRef}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Email
							</label>
						</div>

						{/* Password */}
						<div className="relative mt-6">
							<input
								id="password"
								name="password"
								type="password"
								className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none"
								placeholder="Password"
								ref={passwordRef}
							/>
							<label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-sm">
								Password
							</label>
						</div>

						<div className="flex justify-end mt-2">
							<Link to="/forgotPassword" className="text-sm text-[#F5CB58] hover:text-[#31442c]">
								<strong>Forgot Password?</strong>
							</Link>
						</div>

						<div className="flex justify-center mt-10">
							<button
								className="bg-[#1F510F] text-white rounded-md px-4 py-2 w-full md:w-3/4 hover:bg-[#31442c] transition duration-300"
								type="submit"
							>
								<strong>Sign in</strong>
							</button>
						</div>
					</div>
				</form>

				<div className="flex items-center justify-center my-6">
					<div className="flex items-center w-full text-center text-sm text-[#838383] before:flex-1 before:border-t before:border-[#838383] before:me-4 after:flex-1 after:border-t after:border-[#838383] after:ms-4">
						<strong>Or</strong>
					</div>
				</div>
				<div className="flex flex-col md:flex-row gap-4 items-center justify-center">
					<button
						className="border-[#F5CB58] border-2 rounded-md px-4 py-2 w-full md:w-1/2 hover:border-[#31442c]"
						onClick={() => navigate('/registerPembeli')}
					>
						<Link to="/registerPembeli">
							<strong className="text-[#F5CB58] hover:text-[#31442c]">Register as Buyer</strong>
						</Link>
					</button>
					<button
						className="border-[#F5CB58] border-2 rounded-md px-4 py-2 w-full md:w-1/2 hover:border-[#31442c]"
						onClick={() => navigate('/registerOrganisasi')}
					>
						<Link to="/registerOrganisasi">
							<strong className="text-[#F5CB58] hover:text-[#31442c]">
								Register as Organization
							</strong>
						</Link>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Login;
