import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">401</h1>
                <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
                <p className="text-gray-600 mb-6">
                    Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
                >
                    Kembali
                </button>
            </div>
        </div>
    );
};

export default Unauthorized;
