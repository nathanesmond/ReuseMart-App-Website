import { useState } from 'react'
import logo from '../assets/images/LOGO.png'
import { Button } from '../components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFacebook,
    faTwitter,
    faInstagram,
    faLinkedin,
    faGithub,
    faYoutube,
    faTiktok,
} from '@fortawesome/free-brands-svg-icons';
const Footer = () => {
    return (
        <footer className='w-full'>
            <div className="bg-[#1F510F] text-white p-4 h-45 flex flex-col">
                <div className='flex flex-col items-end'>
                    <div className='flex items-center justify-center '>
                        <h1 className='text-xl font-bold text-white'>ReuseMart</h1>
                        <img src={logo} alt='logo' className='w-16 h-16' />
                    </div>
                    <p className=' ml-2 text-sm font-light break-words whitespace-normal '>ReuseMart supports a circular economy by reducing waste and giving secondhand goods a second life — embracing the 3R: Reduce, Reuse, Recycle.
                    </p>   
                </div>
                <hr className="my-2 border-t  w-[100%] border-white mb-4" />
                <div className='flex justify-between items-center w-full  '>
                    <div className='gap-4 flex text-2xl ml-10'>
                        <FontAwesomeIcon
                            icon={faInstagram}
                            onClick={() => window.open('https://www.instagram.com', '_blank')}
                            style={{ cursor: 'pointer' }}
                        />
                        <FontAwesomeIcon
                            icon={faTiktok}
                            onClick={() => window.open('https://www.instagram.com', '_blank')}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    <p className='text-sm font-light text-white'>© 2025 ReUseMart. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer