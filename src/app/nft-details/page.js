"use client";
import React, {useEffect, useState, useContext} from 'react';
import Image from 'next/image';
import {useRouter} from "next/navigation";

import {NFTContext} from "../../../context/NFTContext";
import {Loader} from "@/components";
import Button from "@/components/Button";
import images from "@/assets";
import Modal from "@/components/Modal";
import {useSearchParams} from "next/navigation";
import { Suspense } from 'react'

const PaymentBodyCmp = ({nft, nftCurrency}) => (
    <div className="flex flex-col">
        <div className="flexBetween">
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
                Item
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-base minlg:text-xl">
                Subtotal
            </p>
        </div>
        <div className="flexBetweenStart my-5">
            <div className="flex-1 flexStartCenter">
                <div className="relative w-28 h-28">
                    <Image src={nft.image} alt='nftImage' fill={true} style={{objectFit: 'cover'}}/>
                </div>
                <div className="flexCenterStart flex-col ml-5">
                    <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
                        {nft.seller?.length > 10 ? `${nft.seller.slice(0, 5)}...${nft.seller.slice(nft.seller?.length - 4)}` : nft.seller}
                    </p>
                    <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm minlg:text-xl">
                        {nft.name}
                    </p>
                </div>
            </div>
            <div>
                <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">
                    {nft.price} <span className="font-semibold">{nftCurrency}</span>
                </p>
            </div>
        </div>
        <div className="flexBetween mt-10">
            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-base minlg:text-xl">
                Total
            </p>
            <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-sm minlg:text-xl">
                {nft.price} <span className="font-semibold">{nftCurrency}</span>
            </p>
        </div>
    </div>
)

const NFTDetails = () => {
    const {currentAccount, nftCurrency, buyNFT, isLoadingNFT, connectWallet} = useContext(NFTContext);
    const [isLoading, setIsLoading] = useState(true)
    const [paymentModal, setPaymentModal] = useState(false)
    const [successModal, setSuccessModal] = useState(false)
    const [nft, setNft] = useState({
        tokenId: '',
        seller: '',
        owner: '',
        price: '',
        image: '',
        name: '',
        description: '',
        tokenURI: ''
    });
    const router = useRouter();
    const params = useSearchParams();
    useEffect(() => {
        const tokenId = params.get('tokenId');
        const seller = params.get('seller');
        const owner = params.get('owner');
        const price = params.get('price');
        const image = params.get('image');
        const description = params.get('description');
        const tokenURI = params.get('tokenURI');
        if (!tokenId) {
            return;
        }
        setNft({
                tokenId,
                seller,
                owner,
                price,
                image,
                description,
                tokenURI,
        }
        );
        setIsLoading(false);
    }, []);

    const checkout = async () => {
        try {
            await buyNFT(nft);
            setPaymentModal(false);
            setSuccessModal(true);
        } catch (error) {
            console.error("Transaction rejected by user", error);
            setPaymentModal(false);
        }
    }

    if (isLoading) return <Loader/>;

    return (
        <div className="relative flex justify-center md:flex-col min-h-screen">
            <div
                className="relative flex-1 flexCenter sm:px-4 p-12 border-r md:border-r-0 md:border-b dark:border-nft-black-1 border-nft-gray-1">
                <div className="relative w-557 minmd:w-2/3 minmd:h-2/3 sm:w-full sm:h-300 h-557">
                    <Image src={nft.image} alt="nftImage" style={{objectFit: 'cover'}} className="rounded-xl shadow-lg "
                           fill={true} priority={true}/>
                </div>
            </div>
            <div className="flex-1 justify-start sm:px-4 p-12 sm:pb-4">
                <div className="flex flex-row sm:flex-col">
                    <h2 className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl minlg:text-3xl">
                        {nft.name}
                    </h2>
                </div>
                <div className="mt-10">
                    <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-normal">
                        Creator
                    </p>
                    <div className="flex flex-row items-center mt-3">
                        <div className="relative w-12 h-12 minlg:w-20 minlg:h-20 mr-2">
                            <Image src={images.creator1} alt="creator1" className="rounded-full shadow-lg"
                                   style={{objectFit: 'cover'}} priority={true} fill={false}/>
                        </div>
                        <p className="font-poppins dark:text-white text-nft-black-1 text-xs minlg:text-base font-semibold">
                            {nft.seller?.length > 10 ? `${nft.seller.slice(0, 5)}...${nft.seller.slice(nft.seller?.length - 4)}` : nft.seller}
                        </p>
                    </div>
                </div>
                <div className="mt-10 flex flex-col">
                    <div className="w-full border-b dark:border-nft-black-1 border-nft-gray-1 flex flex-row">
                        <p className="font-poppins dark:text-white text-nft-black-1 text-base font-medium minlg:text-base mb-2">
                            Details
                        </p>
                    </div>
                    <div className="mt-3">
                        <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal">
                            {nft.description}
                        </p>
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col mt-10">
                    {currentAccount
                            ? (nft.seller && currentAccount === nft.seller.toLowerCase())
                                    ? (
                                        <p className="font-poppins dark:text-white text-nft-black-1 text-base font-normal border border-gray p-2">
                                            You are the owner of this NFT 🚫<span
                                            className="font-poppins text-red-700 font-extrabold"> ! Can not perform this action</span>
                                        </p>
                                    ) : (nft.owner && currentAccount === nft.owner.toLowerCase())
                                        ? (
                                            <Button
                                                btnName={`RESELL`}
                                                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                                                handeClick={() => router.push(`/resell-nft?tokenId=${nft.tokenId}&tokenURI=${nft.tokenURI}`)}
                                            />
                                        )
                                        : (
                                            <Button
                                                btnName={`Buy for ${nft.price} ${nftCurrency}`}
                                                classStyles="mr-5 sm:mr-0 sm:mb-5 rounded-xl"
                                                handeClick={() => setPaymentModal(true)}
                                            />
                                        )
                             : (
                                <Button
                                    btnName="Connect"
                                    classStyles="mx-2 rounded-xl"
                                    handeClick={connectWallet}
                                    setIsOpen={false}
                                />
                    )}
                </div>
            </div>

            {isLoadingNFT && (
                <Modal
                    header="Buying NFT..."
                    body={(
                        <div className="flexCenter flex-col text-center">
                            <div className="relative w-52 h-52">
                                <Loader/>
                            </div>
                        </div>
                    )}
                    handleClose={() => setPaymentModal(false)}
                />
            )}

            {paymentModal && (
                <Modal
                    header="Check Out"
                    body={<PaymentBodyCmp nft={nft} nftCurrency={nftCurrency}/>}
                    footer={(
                        <div className="flex flex-row sm:flex-col">
                            <Button
                                btnName="Check Out"
                                classStyles="mr-5 sm:mb-5 sm:mr-0 rounded-xl"
                                handeClick={checkout}
                            />
                            <Button
                                btnName="Cancel"
                                classStyles="rounded-xl"
                                handeClick={() => setPaymentModal(false)}
                            />
                        </div>
                    )}
                    handleClose={() => setPaymentModal(false)}
                />
            )}
            {successModal && (
                <Modal
                    header="Payment Succedded"
                    body={(
                        <div className="flexCenter flex-col text-center" onClick={() => setPaymentModal(false)}>
                            <div className="relative">
                                <Image src={nft.image} alt="nftImage" style={{objectFit: 'cover'}} width={200}
                                       height={200} className="rounded-xl shadow-lg"/>
                            </div>
                            <p className="font-poppins font-normal text-sm minlg:text-xl mt-10 text-green-500">
                                <span className="text-3xl">🎉</span>Successfully Purchased <span
                                className="font-semibold text-nft-black-1 dark:text-white underline">{nft.name}</span> from <span
                                className="font-semibold text-nft-black-1 dark:text-white underline">{nft.seller?.length > 10 ? `${nft.seller.slice(0, 5)}...${nft.seller.slice(nft.seller?.length - 4)}` : nft.seller}</span>
                            </p>
                        </div>
                    )}
                    footer={(
                        <div className="flex flex-row sm:flex-col">
                            <Button
                                btnName="Check It Out"
                                classStyles="sm:mb-5 sm:mr-0 rounded-xl"
                                handeClick={() => router.push('/my-nfts')}
                            />
                        </div>
                    )}
                    handleClose={() => setPaymentModal(false)}
                />
            )}
        </div>
    );
};

export default NFTDetails;
