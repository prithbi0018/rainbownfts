"use client";
import React, {useEffect, useState} from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";
import axios from "axios";

import {MarketAddress, MarketAddressAbi} from "../constants";

const { TatumSDK, Network } = require("@tatumio/tatum");
const tatumApi = process.env.NEXT_PUBLIC_TATUM_API;


const fetchContract = (signerOrProvider) => new ethers.Contract(MarketAddress, MarketAddressAbi, signerOrProvider);
export const NFTContext = React.createContext({});

export const NFTProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState();
    const [isLoadingNFT, setIsLoadingNFT] = useState(false);
    const nftCurrency = "ETH";

    const checkIfWalletIsConnected = async () => {
        if (!window.ethereum) return alert("Please install MetaMask!");

        const accounts = await window.ethereum.request({ method: "eth_accounts" });

        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("no account available");
        }
    };

    useEffect(() => {
        checkIfWalletIsConnected();
        // createSale('test', '0.025');
    }, []);

    const connectWallet = async () => {
        if (!window.ethereum) return alert("Please install MetaMask");

        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setCurrentAccount(accounts[0]);

        window.location.reload();
    };

    const uploadToIpfs = async (file) => {
        try {
            const tatumClient = await TatumSDK.init({
                network: Network.POLYGON,
                verbose: true,
                apiKey: {
                    v4:
                    tatumApi,
                },
            });
            const buffer = file;

            const result = await tatumClient.ipfs.uploadFile({ file: buffer });

            return result.data.ipfsHash;

        } catch (error) {
            console.log("Error uploading file:", error); // Log the specific error
        }
    };

    const createNFT = async (formInput, fileUrl, router) => {
        const{name, description, price} = formInput;

        if(!name ||!description ||!price) return alert("Please");
        console.log(name, description, price, fileUrl);

        const data = JSON.stringify({name, description, price, image: fileUrl});

        try {
            const tatumClient = await TatumSDK.init({
                network: Network.POLYGON,
                verbose: true,
                apiKey: {
                    v4:
                    tatumApi,
                },
            });
            const buffer = data;
            const result = await tatumClient.ipfs.uploadFile({ file: buffer });
            console.log(JSON.stringify(result))
            const url = `https://ipfs.io/ipfs/${result.data.ipfsHash}`;
            await createSale(url, price)
            router.push("/");

        }catch (e) {
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
            ? await contract.createToken(url, price, { value: listingPrice.toString() })
            : await contract.resellToken(id, price, { value: listingPrice.toString() });

        setIsLoadingNFT(true);
        await transaction.wait();
    }

    const fetchNFTs = async () => {
        setIsLoadingNFT(false);
        try {
            const provider = new ethers.providers.JsonRpcProvider(`https://rpc-mumbai.maticvigil.com/v1/${process.env.NEXT_PUBLIC_MATICVIGIL_API_KEY}`);
            const contract = fetchContract(provider);

            const data = await contract.fetchMarketItems();

            const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price:unformattedprice}) => {
                try {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const { data:{image, name, description }} = await axios.get(`${tokenURI}`);
                    const price = ethers.utils.formatEther(unformattedprice.toString(), 'ether');
                    return { tokenId: tokenId.toNumber(), seller, owner, price, image, name, description };
                } catch (error) {
                    return null;
                }
            }));
            return items.filter(item => item !== null);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            // Handle the error, e.g., return an empty array or throw an error
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

        const items = await Promise.all(data.map(async ({ tokenId, seller, owner, price:unformattedprice}) => {
            try {
                const tokenURI = await contract.tokenURI(tokenId);
                const user = null;
                const { data:{image, name, description }} = await axios.get(`${tokenURI}`);
                const price = ethers.utils.formatEther(unformattedprice.toString(), 'ether');
                return { tokenId: tokenId.toNumber(), seller, owner, price, image, name, description,tokenURI };
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

        const transaction = await contract.createMarketSale(nft.tokenId, { value: price });

        setIsLoadingNFT(true);
        await transaction.wait();
        setIsLoadingNFT(false);
    }

    return (
        <NFTContext.Provider
            value={{ nftCurrency, connectWallet, currentAccount, uploadToIpfs, createNFT, fetchNFTs, fetchMyNFTsOrListedNFTs, buyNFT, createSale, isLoadingNFT}}>
            {children}
        </NFTContext.Provider>
    );
};
