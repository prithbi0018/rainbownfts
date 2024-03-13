"use client";
import React, {useContext} from 'react';
import Image from "next/image";
import Link from "next/link";
import assets from "@/assets"
import {NFTContext} from "../../../context/NFTContext";

const NFTCard = ({nft, onProfilePage}) => {
    const {nftCurrency} = useContext(NFTContext);
    return (
        <Link href={{pathname: "/nft-details", query: nft}}>
            <div
                className="flex-1 min-w-215 max-w-max sm:w-full sm:min-w-155 minmd:min-w-256 minlg:min-w-327 dark:bg-nft-black-3 bg-white rounded-2xl p-4 m-4 minlg:m-8 sm:p-2 sm:m-2 sm:my-2 sm:mx-2 cursor-pointer shadow-md">
                <div
                    className="relative w-full h-52 sm:h-36 minmd:h-60 minlg:h-300 rounded-2xl overflow-hidden">
                    <Image priority={true} src={nft.image || assets[`nft${nft.item}`]} alt='nftImage' fill={true}
                           style={{objectFit: "cover"}} sizes='(max-width: 768px) 100vw, 33vw'/>
                </div>
                <div className="mt-3 flex flex-col ">
                    <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">{nft.name}</p>
                    <div className="flexBetween mt-1 minlg:mt-3 flex-row xs:flex-col xs:items-start xs:mt-3">
                        <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">{nft.price}
                            <span className="normal-case">{nftCurrency}</span></p>
                        <p className="-mx-1 font-poppins dark:text-white text-nft-black-1 font-semibold text-xs minlg:text-lg">{onProfilePage?nft.owner?.length > 10 ? `${nft.owner.slice(0, 5)}...${nft.owner.slice(nft.owner?.length - 4)}` : nft.owner : nft.seller?.length > 10 ? `${nft.seller.slice(0, 5)}...${nft.seller.slice(nft.seller?.length - 4)}` : nft.seller}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default NFTCard;
