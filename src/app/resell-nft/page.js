"use client";
import React, {useEffect, useState, useContext} from 'react';
import Image from "next/image";
import {useRouter} from "next/navigation";

import {NFTContext} from "../../../context/NFTContext";
import {Button} from "@/components";
import {Loader} from "@/components";
import Input from "@/components/Input";
import axios from "axios";
import {useSearchParams} from "next/navigation";
import {Suspense} from "react";

const ResellNFT = () => {
    const { createSale, isLoadingNFT } = useContext(NFTContext);
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState('');
    const router = useRouter();
    const params = useSearchParams();
    const fetchNFT = async () => {
        const {data} = await axios.get(`${params.get('tokenURI')}`);
        setPrice(data.price);
        setImage(data.image);
    };

    useEffect(() => {
        if (params.get('tokenURI')) fetchNFT();
    }, []);

    if (isLoadingNFT) {
        return (
            <div className="flexStart min-h-screen">
                <Loader/>
            </div>
        )
    }

    const resell = async () => {
        try {
            await createSale(params.get('tokenURI'), price, true, params.get('tokenId'));

            router.push('/');
        }catch (e) {
            console.log('Transaction Rejected', e);
            router.push('/my-nfts');
        }
    }

    return (
        <div className="flex justify-center sm:px-4 p-12">
            <div className="w-3/5 md:w-full">
                <h1 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl">
                    Resell NFT
                </h1>

                <Input
                    inputType="number"
                    title="Price"
                    placeholder="NFT Price"
                    handleClick={(event) =>setPrice(event.target.value)}
                />
                <div className="flex justify-center items-center">
                    {image && <Image src={image} alt="NFT image" className="rounded mt-4" width={350} height={350} priority={false}/>}
                </div>
                <div className="mt-7 w-full flex justify-end">
                    <Button
                        btnName="Resell NFT"
                        classStyles="rounded-xl"
                        handeClick={resell}
                    />
                </div>
            </div>
        </div>
    );
};

export default ResellNFT;
