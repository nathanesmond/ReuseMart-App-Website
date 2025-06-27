import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import aboutimage from '../assets/images/aboutimage.png';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import discord from '../assets/images/discord.png';
import whatsapp from '../assets/images/whatsapp.png';
import telegram from '../assets/images/telegram.png';
import gmap from '../assets/images/gmap.png';
import address from '../assets/images/Address.png';
import tiktok from '../assets/images/Tiktok.png';
import facebook from '../assets/images/Facebook.png';
import instagram from '../assets/images/Instagram.png';
import email from '../assets/images/Email.png';
import phone from '../assets/images/Rotary Dial Telephone.png';
import { FaDiscord, FaEnvelope, FaFacebook, FaInstagram, FaMap, FaPhone, FaTelegram, FaTiktok, FaWhatsapp } from 'react-icons/fa6';

const socials = [
    { name: "Whatsapp", image: whatsapp, link: "https://www.whatsapp.com/?lang=id" },
    { name: "Telegram", image: telegram, link: "https://web.telegram.org/" },
    { name: "Discord", image: discord, link: "https://discord.com/" },
]

const contacts = [
    { name: "Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281", image: address, },
    { name: "(0274) 487711", image: phone, },
    { name: "reusemart@gmail.com ", image: email, },
    { name: "@reusemart", image: tiktok, },
    { name: "@reusemart", image: facebook, },
    { name: "@reusemart", image: instagram, },
]

const About = () => {
    return (
        <div className='flex flex-col h-full bg-white items-center'>
            <div className='flex items-center justify-between h-screen max-h-[600px] bg-[#ffffff] space-x-20'>
                <div className="w-[500px] bg-[#ffffff]  ">
                    <p className='text-s text-green-700 font-bold'>WELCOME TO REUSEMART</p>
                    <p className="break-words whitespace-normal text-5xl font-bold mb-2">
                        ReuseMart: Reuse More, Waste Less, Do More</p>
                    <p className='text-md text-gray-600'>ReuseMart is a platform for those who care about sustainability and circular living. Here, you can explore, share, and give new life to preloved items—helping reduce waste and support a more eco-friendly lifestyle. Be part of the movement to connect, contribute, and create positive impact together!</p>

                    <Button asChild className='mt-8 w-44 h-12 flex justify-center items-center rounded-[50px] bg-[#1F510F] hover:bg-white hover:text-black hover:outline-black'>
                        <Link to="/shop" > Shop Now <FontAwesomeIcon icon={faArrowRight} /></Link>
                    </Button>
                </div>
                <div className=" w-full h-full max-w-[500px] max-h-[400px]">
                    <img className='w-[600px] h-[400px] object-contain' src={aboutimage} alt="" />
                </div>
            </div>
            <div className='flex flex-col items-center justify-center'>
            <h1 className="text-3xl md:text-5xl font-bold mt-10 mb:mt-10">
                Join Us
                </h1>
                <p className="text-[#142E38] mt-5 md:text-xl md:mt-10  ">
                Be Part of the Change! Connect, share, and support with ReuseMart.
                </p>
                <div className="flex flex-col md:flex-row mt-10 place-content-stretch mx-40 space-x-10">
                <div className="flex flex-col w-full mb-5 md:w-1/2 justify-center items-center">
                    <FaDiscord className="md:w-15 w-13 md:h-15 h-13" />
                    <h1 className="text-xl md:text-2xl font-bold mt-5  ">Dicord</h1>
                    <a
                    target="_blank"
                    className="bg-[#1F510F]  text-center text-white  mt-5 px-4 py-2 mb-4 rounded-full w-40 md:w-48 cursor-pointer font-bold "
                    href="https://discord.com/"
                    >
                    Join
                    </a>
                </div>
                <div className="flex flex-col w-full mb-5 md:w-1/2 items-center">
                    <FaWhatsapp className="md:w-15 w-13 md:h-15 h-13" />
                    <h1 className="text-xl md:text-2xl font-bold mt-5  ">Whatsapp</h1>
                    <a
                    target="_blank"
                    className="bg-[#1F510F]  text-center text-white mt-5 px-4 py-2 mb-4 rounded-full w-40 md:w-48 cursor-pointer font-bold "
                    href="https://web.whatsapp.com/"
                    >
                    Join
                    </a>
                </div>
                <div className="flex flex-col w-full md:w-1/2 mb-5 justify-center items-center">
                    <FaTelegram className="md:w-15 w-13 md:h-15 h-13" />
                    <h1 className="text-xl md:text-2xl font-bold mt-5  ">Telegram</h1>
                    <a
                    target="_blank"
                    className="bg-[#1F510F]  text-center text-white  mt-5 px-4 py-2 mb-4 rounded-full w-40 md:w-48 cursor-pointer font-bold "
                    href="https://web.telegram.org/"
                    >
                    Join
                    </a>
                </div>
        </div>
            </div>
            <div className='flex flex-col items-center justify-center mx-24 mt-20'>
                <p className="mt-12 text-4xl font-bold text-black">Contact Us</p>
                <p className="mt-4 text-lg font-normal text-gray-500 mb-6">Be Part of the Change! Connect, share, and support with ReuseMart.</p>
                <div className="flex flex-col md:flex-row justify-center items-center gap-2">
                <iframe
                    className="w-full h-60 mb-4 md:mx-10 md:w-1/2 md:h-96"
                    src="https://maps.google.com/maps?width=100%25&amp;height=800&amp;hl=en&amp;q=Universitas%20Atma%20Jaya%20Yogyakarta%20Kampus%203&amp;t=&amp;z=19&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                    allowFullScreen
                ></iframe>
                <div className="text-left">
                    <div className="flex flex-row space-x-4 mx-4 pb-4 md:pb-7 md:pt-10 pt-0">
                        <FaMap className="md:w-10 w-10 md:h-10 h-10" />
                        <p>
                            Jl. Babarsari No.43, Janti, Caturtunggal, Kec. Depok, Kabupaten
                            Sleman, Daerah Istimewa Yogyakarta 55281
                        </p>
                    </div>
                    <div className="flex flex-row space-x-4 mx-4 pb-4 md:pb-7">
                        <FaPhone className="md:w-8 w-5 md:h-11 h-8 " />
                        <p className="pt-2">(0274) 487711</p>
                    </div>
                    <div className="flex flex-row space-x-4 mx-4 pb-4 md:pb-7">
                        <FaEnvelope className="md:w-8 w-5 md:h-8 h-5" />
                        <p>reusemart@gmail.com</p>
                    </div>
                    <div className="flex flex-row space-x-4 mx-4 pb-4 md:pb-7">
                        <FaFacebook className="md:w-8 w-5 md:h-8 h-5" />
                        <p>reusemart._</p>
                    </div>
                    <div className="flex flex-row space-x-4 mx-4 pb-4 md:pb-7">
                        <FaInstagram className="md:w-8 w-5 md:h-8 h-5" />
                        <p>reusemart._</p>
                    </div>
                    <div className="flex flex-row space-x-4 mx-4 pb-4 md:pb-10">
                        <FaTiktok className="md:w-8 w-5 md:h-8 h-5" />
                        <p>reusemart._</p>
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
};
export default About;