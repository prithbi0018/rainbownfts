"use client";
import React, {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import axios from "axios";

import {MarketAddress, MarketAddressAbi} from "../constants";


const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressAbi, signerOrProvider);
export const NFTContext = React.createContext({});

export const NFTProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState();
    const [isLoadingNFT, setIsLoadingNFT] = useState(false);
    const nftCurrency = "ETH";

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return alert("Please install MetaMask!");

        const accounts = await window.ethereum.request({method: "eth_accounts"});

        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("no account available");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return alert("Please install MetaMask");

        const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
        setCurrentAccount(accounts[0]);

        window.location.reload();
    };

    const uploadToIpfs = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JSON_SECRET}`,
                },
            });
            return res.data.IpfsHash;

        } catch (error) {
            console.log("Error uploading file:", error); // Log the specific error
        }
    };

    const createNFT = async (formInput, fileUrl, router) => {
        const {name, description, price} = formInput;

        if (!name || !description || !price) return alert("Please");

        try {
            const data = JSON.stringify({
                pinataContent: {
                    name: name,
                    description: description,
                    price: price,
                    image: fileUrl
                },
                pinataMetadata: {
                    name: `${name}.json`
                }
            })
            const res = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JSON_SECRET}`
                }
            });
            const url = `https://ipfs.io/ipfs/${res.data.IpfsHash}`;
            await createSale(url, price)
            router.push("/");

        } catch (e) {
            console.log(`Error creating NFT:${e}`)
        }
    }

    const createSale = async (url, formInputPrice, isReselling, id) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const price = ethers.utils.parseUnits(formInputPrice, 'ether');
        const contract = fetchContract(signer);
        const listingPrice = await contract.getListingPrice();
        const transaction = !isReselling
            ? await contract.createToken(url, price, {value: listingPrice.toString()})
            : await contract.resellToken(id, price, {value: listingPrice.toString()});

        setIsLoadingNFT(true);
        await transaction.wait();
    }

    const fetchNFTs = async () => {
        setIsLoadingNFT(false);
        try {
            const provider = new ethers.providers.JsonRpcProvider(`https://rpc.ankr.com/polygon_mumbai/${process.env.NEXT_PUBLIC_ANKR_API_KEY}`);
            const contract = fetchContract(provider);

            const data = await contract.fetchMarketItems();

            const items = await Promise.all(data.map(async ({tokenId, seller, owner, price: unformattedprice}) => {
                try {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const {data: {image, name, description}} = await axios.get(`${tokenURI}`);
                    const price = ethers.utils.formatEther(unformattedprice.toString(), 'ether');
                    return {tokenId: tokenId.toNumber(), seller, owner, price, image, name, description};
                } catch (error) {
                    return null;
                }
            }));
            return items.filter(item => item !== null);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            return [];
        }
    }


    const fetchMyNFTsOrListedNFTs = async (type) => {
        setIsLoadingNFT(false);
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);

        const data = type === 'fetchItemsListed'
            ? await contract.fetchItemsListed()
            : await contract.fetchMyNFTs();

        const items = await Promise.all(data.map(async ({tokenId, seller, owner, price: unformattedprice}) => {
            try {
                const tokenURI = await contract.tokenURI(tokenId);
                const user = null;
                const {data: {image, name, description}} = await axios.get(`${tokenURI}`);
                const price = ethers.utils.formatEther(unformattedprice.toString(), 'ether');
                return {tokenId: tokenId.toNumber(), seller, owner, price, image, name, description, tokenURI};
            } catch (error) {
                return null;
            }
        }));
        const filteredItems = items.filter(item => item !== null);

        return filteredItems;
    }

    const buyNFT = async (nft) => {
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const contract = fetchContract(signer);
        const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

        const transaction = await contract.createMarketSale(nft.tokenId, {value: price});

        setIsLoadingNFT(true);
        await transaction.wait();
        setIsLoadingNFT(false);
    }

    return (
        <NFTContext.Provider
            value={{
                nftCurrency,
                connectWallet,
                currentAccount,
                uploadToIpfs,
                createNFT,
                fetchNFTs,
                fetchMyNFTsOrListedNFTs,
                buyNFT,
                createSale,
                isLoadingNFT
            }}>
            {children}
        </NFTContext.Provider>
    );
};
