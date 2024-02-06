"use client";

import ThemeSwitcher from '@/app/ThemeSwitcher';
import Image from "next/image";
import Link from "next/link";
import images from "@/assets";
import React, {useState, useEffect, useContext} from "react";
import {Button} from "@/components";
import {useRouter} from "next/navigation";
import {Twirl as Hamburger} from 'hamburger-react'
import {NFTContext} from "../../../context/NFTContext";
import {usePathname} from "next/navigation";

const MenuItem = ({isMobile, active, setActive , setIsOpen}) => {
    const generateLink = (index) => {
        switch (index) {
            case 0:
                return '/';
            case 1:
                return '/listed-nfts';
            case 2:
                return '/my-nfts';
            default:
                return '/';
        }
    }
    return (
        <ul className={`list-none flexCenter flex-row ${isMobile && 'flex-col mt-6 '}`}>
            {['Explore NFTs', 'Listed NFTs', 'My NFTs'].map((item, index) => (
                <li
                    key={index}
                    onClick={() => {
                        setActive(item);

                        if(isMobile) setIsOpen(false);
                    }}
                    className={`flex flex-row items-center font-poppins font-semibold text-base mx-3 ${ isMobile ? 'text-[28px] tracking-[.007em] w-full flex pl-[48px] pt-[3px] pb-[4px] h-[60px]' : 'text-base mx-3'}
                    ${active === item ? 'text-nft-black-1 dark:text-white' : 'text-nft-gray-2 dark:text-nft-gray-2 hover:text-nft-gray-3 dark:hover:text-nft-gray-1' }
                    `}>
                    <Link href={generateLink(index)}>{item}</Link>
                </li>
            ))}
        </ul>
    )
}

const ButtonGroup = ({isMobile, setActive, router, setIsOpen}) => {
    const {connectWallet, currentAccount} = useContext(NFTContext);

    return currentAccount ? (
        <Button
            btnName="Create"
            classStyles="mx-2 rounded-xl"
            handeClick={() => {
                setActive('');
                router.push('/create-nft');
                if(isMobile) setIsOpen(false);
            }}
        />
    ) : <Button
        btnName="Connect"
        classStyles="mx-2 rounded-xl"
        handeClick={connectWallet}
        setIsOpen={false}
    />;
}

const checkActive = (active, setActive, pathname) => {
    switch (pathname) {
        case '/':
            if(active !== 'Explore NFTs') setActive('Explore NFTs');
            break;
        case '/listed-nfts':
            if(active !== 'Listed NFTs') setActive('Listed NFTs');
            break;
        case '/my-nfts':
            if(active !== 'My NFTS') setActive('My NFTs');
            break;
        default:
            setActive('');
            break;
    }
}
const Navbar = () => {
    const pathname = usePathname();
    const [active, setActive] = useState('Explore NFTs');
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        checkActive(active, setActive, pathname);
    }, [pathname]);
    return (
        <nav
            className="flexBetween w-full fixed z-10 p-4 flex-row border-b bg-gray-100 dark:bg-nft-dark border-nft-gray-1 dark:border-nft-black-1">
            <div className="flex flex-1 flex-row justify-start">
                <Link href="/">
                    <div className="flexCenter md:hidden cursor-pointer" onClick={() => {
                    }}>
                        <Image src={images.logo03} style={{objectFit:"contain"}} width={32} height={32} alt="logo" priority={true}/>
                        <p className="font-semibold text-lg ml-2 text-nft-black-1 dark:text-white">RAINBOW NFT</p>
                    </div>
                </Link>
                <Link href="/">
                    <div className="hidden md:flex" onClick={() => {
                    }}>
                        <Image src={images.logo03} style={{objectFit:"contain"}} width={32} height={32} alt="logo" priority={true}/>
                    </div>
                </Link>
            </div>
                <ThemeSwitcher/>
            <div className="md:hidden flex text-nft-black-1">
                <MenuItem active={active} setActive={setActive}/>
                <div className="ml-4 ">
                    <ButtonGroup setActive={setActive} router={router}/>
                </div>
            </div>
            <div className="hidden md:flex ml-2">
                <Hamburger toggled={isOpen} toggle={setIsOpen} />
                {isOpen && (
                    <div className="fixed inset-0 top-65 bg-white dark:bg-nft-dark z-10 nav-h flex justify-between flex-col">
                        <div className="flex-1 p-4 ">
                            <MenuItem active={active} setActive={setActive} isMobile setIsOpen={setIsOpen}/>
                        </div>
                        <div className="p-4 border-t dark:border-nft-black-1 border-nft-gray-1">
                            <ButtonGroup setActive={setActive} router={router} isMobile setIsOpen={setIsOpen}/>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
