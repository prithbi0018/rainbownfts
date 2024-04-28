"use client";
import Image from "next/image";
import images from "@/assets";
import React from "react";
import {useTheme} from "next-themes";
import {Button} from "@/components";
import CustomForm from "@/components/MailChimpForm"
const FooterLinks = ({heading, items}) => (
    <div className="flex-1 justify-start items-start">
        <h3 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl mb-8">{heading}</h3>
        {items.map((item, index) => (
            <p key={index} className="hover:underline cursor-pointer hover:text-blue-400 focus:text-blue-700">{item}</p>
        ))}
    </div>
)
function Footer() {
    const {theme} = useTheme();
    return (
        <footer className="flexCenter flex-col border-t border-nft-gray-1 dark:border-nft-black-1 sm:py-8 py-16 bg-gray-100 dark:bg-nft-dark">
            <div className="w-full minmd:w-4/5 flex flex-row md:flex-col sm:px-4 px-16">
                <div className="flexStart flex-1 flex-col">
                    <div className="flexCenter cursor-pointer">
                        <Image src={images.logo03} style={{objectFit:"contain"}} width={32} height={32} alt="logo" priority={true}/>
                        <p className="font-semibold text-lg ml-2 text-nft-black-1 dark:text-white">RAINBOW NFT</p>
                    </div>
                    <p className="font-poppins font-semibold text-base mt-6 ml-2 text-nft-black-1 dark:text-white">Get the latest updates</p>
                    <CustomForm/>
                </div>
            <div className="flex-1 flexBetweenStart flex-wrap ml-12 md:ml-0 md:mt-8">
                <FooterLinks heading="Rainbow Nft" items={['Explore', 'How it works', 'Contact us']}/>
                <FooterLinks heading="Support" items={['Help center', 'Terms of services', 'Privacy policy']}/>
            </div>
            </div>


            <div className="flexCenter w-full mt-5 border-t dark:border-nft-black-1 border-nft-gray-1 sm:px-4 px-16">
                <div className="flexBetween flex-row w-full minmd:w-4/5 sm:flex-col mt-7">
                    <p className="font-poppins dark:text-nft-gray-1 text-nft-gray-3 font-semibold text-base">RainbowNft,
                        Inc.All Rights Reserved.</p>
                    <div className="flex flex-row sm:mt-4">
                        <div className="mx-2 cursor-pointer">
                            <a href="https://www.instagram.com/prithbi0018/" target="_blank" rel="noreferrer">
                                <Image src={images.instagram}
                                       style={{objectFit: "contain"}}
                                       width={30}
                                       height={30}
                                       alt="social"
                                       className={theme === 'light' ? 'filter invert' : 'filter out'}
                                />
                            </a>
                        </div>
                        <div className="mx-2 cursor-pointer">
                            <a href="https://www.linkedin.com/in/contactprithbi" target="_blank" rel="noreferrer">
                                <Image src={images.linkedin}
                                       style={{objectFit: "contain"}}
                                       width={30}
                                       height={30}
                                       alt="social"
                                       className={theme === 'light' ? 'filter invert' : 'filter out'}
                                />
                            </a>
                        </div>
                        <div className="mx-2 cursor-pointer">
                            <a href="https://github.com/prithbi0018/Prithbirajpanda" target="_blank" rel="noreferrer">
                                <Image src={images.github}
                                       style={{objectFit: "contain"}}
                                       width={30}
                                       height={30}
                                       alt="social"
                                       className={theme === 'light' ? 'filter invert' : 'filter out'}
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
