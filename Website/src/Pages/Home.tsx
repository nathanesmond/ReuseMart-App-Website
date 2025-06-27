import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import homeimage from '../assets/images/HomeImage.png';
import item1 from '../assets/images/item1.png';
import suit from '../assets/images/suits.jpg';
import jordan from '../assets/images/jordan.jpg';
import fridge from '../assets/images/fridge.jpg';
import couch from '../assets/images/couch.jpg';
import shoppingcart from '../assets/images/shoppingcart.png';
import { Button } from "../components/ui/button";
import rere from '../assets/images/rere_5.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faTruckFast, faHeadset, faBagShopping, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import clothing from '../assets/images/clothing.png';
import furnishing from '../assets/images/furnishing.png';
import book from '../assets/images/book.png';
import hobby from '../assets/images/hobby.png';
import baby from '../assets/images/baby.png';
import otomotif from '../assets/images/otomotif.png';
import garden from '../assets/images/garden.png';
import office from '../assets/images/office.png';
import kosmetik from '../assets/images/kosmetik.png';
import { requestNotificationPermission } from '../hooks/usePushNotification';
import { toast } from 'react-toastify';
import axios from 'axios';

const categories = [
    { name: "Electronics & Gadgets", image: item1, link: "/shop", id: "0" },
    { name: "Clothing & Accessories", image: clothing, link: "/shop", id: "1" },
    { name: "Home Furnishings", image: furnishing, link: "/shop", id: "2" },
    { name: "Books & School", image: book, link: "/shop", id: "3" },
    { name: "Hobbies & Collectibles", image: hobby, link: "/shop", id: "4" },
    { name: "Baby & Kids ", image: baby, link: "/shop", id: "5" },
    { name: "Automotive", image: otomotif, link: "/shop", id: "6" },
    { name: "Garden & Outdoor ", image: garden, link: "/shop", id: "7" },
    { name: "Office & Industrial ", image: office, link: "/shop", id: "8" },
    { name: "Cosmetics & Skincare", image: kosmetik, link: "/shop", id: "9" },
];

const team = [
    { name: "Natania Regina Clarabella Serafina", role: "CEO & Founder", sosmed: "@nataniareginaa", image: rere, },
    { name: "Kalvin Lawinata", role: "CEO & Founder", sosmed: "@asu", image: item1, },
    { name: "Nathanael Esmond", role: "CEO & Founder", sosmed: "@asu", image: item1, },
    { name: "Raka Pratama", role: "CEO & Founder", sosmed: "@rakapratama", image: item1, },
]

const Home = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const fetchBarangByKategori = (id_kategori: string) => {
        setIsLoading(true);
        const selectedKategori = Number(id_kategori) + Number(id_kategori) * 10;
        console.log("Selected Kategori:", selectedKategori);
        navigate('/shop', { state: { selectedKategori } });
    };


    // useEffect(() => {
    //     const getToken = async () => {
    //         const token = await requestNotificationPermission();
    //         if (token) {
    //         console.log("Token yang akan dikirim:", token);
    //         try {
    //             const authToken = sessionStorage.getItem("token") || null;
    //             if (!authToken) {
    //                 throw new Error("No auth token found. Please login.");
    //             }
    
    //             const response = await axios.post(
    //                 "http://localhost:8000/api/save-token",
    //                 { fcm_token: token },
    //                 {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${authToken}`, 
    //                 },
    //                 withCredentials: true,
    //                 }
    //             );
    //             console.log("Token tersimpan:", response.data);
    //             console.log("sanctum:", authToken);
    //             toast.success("Token berhasil disimpan!");
    //         } catch (error) {
    //             console.error("Error mengirim token ke backend:", error);
    //             toast.error("Gagal mengirim token ke backend.");
    //         }
    //         } else {
    //             toast.error("Token tidak ditemukan.");
    //         }
    //         };
    //         getToken();
    //     }, []);

    return (
        <div className='flex flex-col h-full bg-white ' >
            <div className='flex items-center justify-center h-screen max-h-[600px] bg-[#EDF2EE] '>
                <div className="w-[500px] bg-[#EDF2EE]  ">
                    <p className='text-s text-green-700 font-bold'>WELCOME TO REUSEMART</p>
                    <p className="break-words whitespace-normal text-6xl font-bold mb-2">
                        Give Second Chances. Support Circular Change.</p>
                    <p className='text-3xl'>Discover <span className='text-orange-500'>Preloved Treasures</span> Today</p>
                    <p className='text-xs text-gray-400'>Smart Choices for a Smarter Planet</p>

                    <Button asChild className='mt-4 w-44 h-12 flex justify-center items-center rounded-[50px] bg-[#1F510F] hover:bg-white hover:text-black hover:outline-black'>
                        <Link to="/shop" > Shop Now <FontAwesomeIcon icon={faArrowRight} /></Link>
                    </Button>


                </div>
                <div className=" w-full h-full max-w-[500px] max-h-[400px]">
                    <img className='w-[600px] h-[400px]' src={homeimage} alt="" />
                </div>
            </div>
            <div className='flex gap-4 items-center justify-between w-[75%] h-[120px] max-h[120px] bg-white absolute inset-0 top-154 rounded-md shadow-lg mx-auto'>
                <div className='flex items-center gap-4 ml-8'>
                    <p className='text-green-500 text-3xl'><FontAwesomeIcon icon={faTruckFast} /></p>
                    <div className='flex flex-col justify-center'>
                        <p className='font-bold'>Discount Points</p>
                        <p className='text-xs text-gray-500'>Earn Points. Redeem for Discounts</p>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <p className='ml-4 text-green-500 text-3xl'><FontAwesomeIcon icon={faHeadset} /></p>
                    <div className='flex flex-col justify-center'>
                        <p className='font-bold'>Quality Checked Items</p>
                        <p className='text-xs text-gray-500'>Every item inspected before it reaches you</p>
                    </div>
                </div>
                <div className='flex items-center gap-4 mr-8'>
                    <p className='ml-4 text-green-500 text-3xl' ><FontAwesomeIcon icon={faBagShopping} /></p>
                    <div className='flex flex-col justify-center'>
                        <p className='font-bold'>100% Secure Payment</p>
                        <p className='text-xs text-gray-500'>Your payment goes to ReuseMart</p>
                    </div>
                </div>
            </div>
            <div className='flex items-center flex-col h-full max-h-[700px] mb-8 bg-white'>
                <p className="mt-42 text-3xl font-semibold text-black mb-6">Categories</p>
                <div className='h-full'>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 ">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => fetchBarangByKategori(category.id)}
                                className="w-52 h-52 bg-white p-4 shadow-md rounded-lg border flex flex-col items-center justify-center hover:scale-105 transition-transform"
                            >
                                <img src={category.image} alt={category.name} className="h-20 w-20 object-contain" />
                                <p className="mt-2 font-semibold text-center">{category.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
            <div className='flex items-center flex-col h-full max-h-[1000px] bg-white'>
                <p className="mt-32 text-3xl font-semibold text-black mb-6">You Might Like</p>
                <div className='flex justify-center w-full h-full gap-6 '>
                    <div
                        style={{
                            backgroundImage: `url(${fridge})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        className='relative w-full max-w-[600px] h-[500px] rounded-md shadow-2xl flex flex-col items-end justify-between'
                    >
                        <div className="absolute inset-0 bg-black opacity-40 rounded-md"></div>
                        <Button className="relative z-10 text-black hover:text-white text-2xl bg-white rounded-[50px] h-12 w-12 flex items-center justify-center p-2 m-4">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </Button>
                        <div className="relative z-10 text-white p-4 self-start">
                            <Button className='bg-white text-black hover:text-white w-64 h-12 rounded-3xl font-bold text-lg' onClick={() => fetchBarangByKategori("2")}>Home Furnishings</Button>
                        </div>
                    </div>
                    <div className='w-full max-w-[650px] h-[600px]  rounded-md justify-center'>
                        <div className='flex flex-col space-y-5'>
                            <div className='flex w-full h-full gap-4 justify-center'>
                                <div style={{
                                    backgroundImage: `url(${couch})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }} className='relative w-full h-[240px] bg-white rounded-md shadow-2xl'>
                                    <div className="absolute inset-0 bg-black opacity-40 rounded-md"></div>
                                    <div className="absolute bottom-4 left-4 z-10 text-white">
                                        <Button className='bg-white text-black hover:text-white flex flex-col items-center justify-center w-46 h-12 rounded-3xl font-bold text-lg gap-0' onClick={() => fetchBarangByKategori("2")}>
                                            Furnishings
                                        </Button>
                                    </div>
                                    <div className="absolute top-0 right-0 z-10 text-white">
                                        <Button className="relative z-10 text-black hover:text-white text-2xl bg-white rounded-[50px] h-12 w-12 flex items-center justify-center p-2 m-4">
                                            <FontAwesomeIcon icon={faCartShopping} />
                                        </Button>
                                    </div>
                                </div>
                                <div style={{
                                    backgroundImage: `url(${suit})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }} className='relative w-full h-[240px] bg-white rounded-md shadow-2xl'>
                                    <div className="absolute inset-0 bg-black opacity-40 rounded-md"></div>
                                    <div className="absolute bottom-4 left-4 z-10 text-white">
                                        <Button className='bg-white text-black hover:text-white w-42 h-12 rounded-3xl font-bold text-lg' onClick={() => fetchBarangByKategori("1")}>Clothing</Button>
                                    </div>
                                    <div className="absolute top-0 right-0 z-10 text-white">
                                        <Button className="relative z-10 text-black hover:text-white text-2xl bg-white rounded-[50px] h-12 w-12 flex items-center justify-center p-2 m-4">
                                            <FontAwesomeIcon icon={faCartShopping} />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    backgroundImage: `url(${jordan})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                                className='relative w-full h-[240px] bg-white rounded-md shadow-2xl'>
                                <div className="absolute inset-0 bg-black opacity-40 rounded-md"></div>
                                <div className="absolute bottom-4 left-4 z-10 text-white">
                                    <Button className='bg-white text-black hover:text-white w-42 h-12 rounded-3xl font-bold text-lg' onClick={() => fetchBarangByKategori("1")}>Accessories</Button>
                                </div>
                                <div className="absolute top-0 right-0 z-10 text-white">
                                    <Button className="relative z-10 text-black hover:text-white text-2xl bg-white rounded-[50px] h-12 w-12 flex items-center justify-center p-2 m-4">
                                        <FontAwesomeIcon icon={faCartShopping} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
            <div className='flex items-center justify-center h-full max-h-[600px] bg-white mt-10 '>
                <div className="w-[500px] bg-white  ">
                    <p className="break-words whitespace-normal text-6xl font-bold mb-2">
                        100% Trusted Preloved Goods.</p>
                    <p className='text-md text-gray-400 break-words whitespace-normal'>At ReuseMart, we believe that every item deserves a second life. Through our curated platform, we connect people with quality preloved goods — helping reduce waste and support a more circular, sustainable future. Whether you're buying or giving, you're part of a greener change.</p>
                    <Button asChild className='mt-4 w-44 h-12 flex justify-center items-center rounded-[50px] bg-[#1F510F] hover:bg-white hover:text-black hover:outline-black'>
                        <Link to="/shop" > Shop Now <FontAwesomeIcon icon={faArrowRight} /></Link>
                    </Button>

                </div>
                <div className=" w-full h-full max-w-[500px] max-h-[400px]">
                    <img className='w-[600px] h-[400px]' src={shoppingcart} alt="" />
                </div>
            </div>

            <div className='flex flex-col items-center justify-center h-full max-h-[600px] bg-white mt-16 mb-32 '>
                <p className='text-green-500 font-semibold text-lg'>TEAM</p>
                <p className='text-black font-bold text-3xl mb-4'>Our Professional Members</p>
                <div className='h-full'>
                    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                        {team.map((team, index) => (
                            <div
                                key={index}
                                className="w-52 h-72 bg-white  shadow-md border flex flex-col items-start "
                            >
                                <img src={team.image} alt={team.name} className="bg-white h-[60%] w-full object-cover" />
                                <div className='mt-2 mx-4'>
                                    <p className=" font-semibold text-lg">{team.name}</p>
                                    <p className='font-light text-gray-400 text-s'>{team.role}</p>
                                    <p className='font-light text-gray-400 text-s'>{team.sosmed}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Home;
