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

const ResellNFT = () => {
    const { createSale, isLoadingNFT } = useContext(NFTContext);
    // const searchParams = useSearchParams();
    // const tokenURI = searchParams.get('tokenURI');
    // const tokenId = searchParams.get('tokenId');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const router = useRouter();
    const fetchNFT = async (params) => {
        const {data} = await axios.get(`${params.tokenURI}`);
        setPrice(data.price);
        setImage(data.image);
    };

    useEffect((params) => {
        if (params.tokenURI) fetchNFT();
    }, []);

    if (isLoadingNFT) {
        return (
            <div className="flexStart min-h-screen">
                <Loader/>
            </div>
        )
    }

    const resell = async (params) => {
        await createSale(params.tokenURI, price, true, params.tokenId);

        router.push('/');
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
