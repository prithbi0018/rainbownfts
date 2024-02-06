"use client";
import {useState, useContext, useMemo, useCallback} from 'react';
import {useDropzone} from "react-dropzone";
import Image from "next/image";
import {useTheme} from "next-themes";


import {Button, Loader} from "@/components";
import images from "@/assets"
import React from 'react';
import Input from "@/components/Input";
import {NFTContext} from "../../../context/NFTContext";
import {useRouter} from "next/navigation";

const CreateNFT = () => {
    const [fileUrl, setFileUrl] = useState(null);
    const [formInput, setFormInput] = useState({ price: '', name: '', description: '',})
    const {theme} = useTheme();
    const {uploadToIpfs, createNFT, isLoadingNFT} = useContext(NFTContext);
    const router = useRouter();

    const onDrop = useCallback(async (acceptedFile) => {
            const url = await uploadToIpfs(acceptedFile[0]);
            setFileUrl(`https://ipfs.io/ipfs/${url}`);
        },[uploadToIpfs]);

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept:{ 'image/*': ['.jpeg', '.jpg', '.png', ".gif", ".svg", ".webm"] },
        multiple: false,
        maxSize: 5000000,
    })

    const fileStyle = useMemo(() => (
        `dark:bg-nft-black-1 bg-white border border-nft-gray-2 dark:border-white flex flex-col item-center p-5 rounded-sm border-dashed
        ${isDragActive && 'border-file-active'}
        ${isDragAccept && 'border-file-accept'}
        ${isDragReject && 'border-file-reject'}
        `
    ), [isDragAccept, isDragActive, isDragReject]); //these deps cause navigation errors

    if (isLoadingNFT) {
        return (<div className="flexStart min-h-screen">
            <Loader/>
        </div>);
    }
    return (
        <div className="flex justify-center p-8">
            <div className=" w-3/5 md:w-full">
                <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                    Create New NFT
                </h1>
                <div className="mt-16">
                    <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">Upload File</p>
                    <div className="mt-4">
                        <div {...getRootProps()} className={fileStyle}>
                            <input {...getInputProps()} />
                            <div className="flexCenter flex-col text-center">
                                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-xl">JPG, PNG, GIF, SVG, WEBM. Max 100mb.</p>
                                <div className="my-12 w-full flex justify-center">
                                    <Image src={images.upload} alt="Upload Image" width={100} height={100} priority={false} style={{objectFit:"contain"}} className={theme === 'light'? 'filter invert':'filter out'}/>
                                </div>
                                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm">Drag & Drop Files.</p>
                                <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-sm mt-2">or Browse media on your Device</p>
                            </div>
                        </div>
                        {fileUrl && (
                            <aside>
                                <div className="flex justify-center items-center">
                                    <Image src={fileUrl} className="rounded mt-4" alt="file" width={400} height={400} />
                                </div>
                            </aside>
                        )}
                    </div>
                </div>
                <Input
                    inputType="input"
                    title="Name"
                    placeholder="NFT Name"
                    handleClick={(e) => setFormInput({ ...formInput, name: e.target.value })}
                />
                <Input
                    inputType="textarea"
                    title="Description"
                    placeholder="NFT Description"
                    handleClick={(e) => setFormInput({ ...formInput, description: e.target.value })}
                />
                <Input
                    inputType="number"
                    title="Price"
                    placeholder="NFT Price"
                    handleClick={(e) => setFormInput({ ...formInput, price: e.target.value })}
                />
                <div className="mt-7 w-full flex justify-end">
                    <Button
                        btnName="Create NFT"
                        classStyles="rounded-xl"
                        handeClick={() => createNFT(formInput, fileUrl, router)}
                    />
                </div>
            </div>
        </div>
    );
};

export default CreateNFT;
