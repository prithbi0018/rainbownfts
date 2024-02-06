import React from 'react';
import Image from "next/image";
import images from "@/assets";
import { Typewriter } from 'react-simple-typewriter'


const Banner = ({parentStyle, bannerAttribute, childStyle}) => (
    <div className={`relative w-full flex items-center z-0 overflow-hidden ${parentStyle} pointer-events-none`}>
        <Image className="absolute inset-0 w-full h-full object-cover blur-sm" src={images.bannerImage}  alt="bannerImage" />
        <p className={`absolute font-bold text-5xl text-white font-poppins leading-70 ${childStyle}`}>
            <Typewriter
                words={[bannerAttribute]}
                cursor
                cursorStyle='|'
                cursorColor="white"
                typeSpeed={90}
                deleteSpeed={50}
                delaySpeed={1000}
            />
        </p>
        <div className="absolute w-48 h-48 sm:w-32 sm:h-32 rounded-full white-bg -top-9 -left-16 z-5 opacity-30"/>
        <div className="absolute w-72 h-72 sm:w-56 sm:h-56 rounded-full white-bg -bottom-24 -right-14 z-5 opacity-50"/>
    </div>
);

export default Banner;
