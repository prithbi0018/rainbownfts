"use client";
import Banner from '@/components/Banner';
import React from "react";
import {useState, useEffect, useRef, useContext} from 'react';
import CreatorCard from '@/components/CreatorCard';
import images from '@/assets'
import Image from "next/image";
import {useTheme} from "next-themes";
import NFTCard from "@/components/NFTCard";
import {NFTContext} from "../../context/NFTContext";
import {getCreators} from "../../utils/getTopCreators";
import {SearchBar} from "@/components";
import Loader from "@/components/Loader";
const Home = () => {
    const {fetchNFTs} = useContext(NFTContext);
    const [hideButtons, setHideButtons] = useState(false)
    const {theme} = useTheme();
    const [nfts, setNfts] = useState([]);
    const [nftsCopy, setNftsCopy] = useState([]);
    const parentRef = useRef(null);
    const scrollRef = useRef(null)
    const [activeSelect, setActiveSelect] = useState('Recently Added');
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchNFTs()
            .then((items) => {
                const sortedNfts = [...items];
                sortedNfts.sort((a, b) => b.tokenId - a.tokenId);
                setNfts(sortedNfts);
                setNftsCopy(items);
                setIsLoading(false);
            });
    }, [fetchNFTs]);
    const handleScroll = (direction) => {
        const {current} = scrollRef;

        const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

        if (direction === 'left') {
            current.scrollLeft -= scrollAmount;
        } else {
            current.scrollLeft += scrollAmount;
        }
    }
    const isScrollable = () => {
        const {current} = scrollRef;
        const {current: parent} = parentRef;

        if (current?.scrollWidth >= parent?.offsetWidth) {
            setHideButtons(false);
        } else {
            setHideButtons(true);
        }
    }

    useEffect(() => {
        isScrollable();
        window.addEventListener('resize', isScrollable);

        return () => {
            window.removeEventListener('resize', isScrollable);
        }
    })

    const topCreators = getCreators(nftsCopy);

    useEffect(() => {
        const sortedNfts = [...nfts];

        switch (activeSelect) {
            case 'Recently Added':
                setNfts(sortedNfts.sort((a, b) => b.tokenId - a.tokenId));
                break;
            case 'Price (Low to High)':
                setNfts(sortedNfts.sort((a, b) => a.price - b.price));
                break;
            case 'Price (High to Low)':
                setNfts(sortedNfts.sort((a, b) => b.price - a.price));
                break;
            default:
                setNfts(sortedNfts); // Update the state with the sorted array
                break;
        }

    }, [activeSelect]);

    const onHandleSearch = (value) => {
        const filteredNfts = nfts.filter(({name}) => name.toLowerCase().includes(value.toLowerCase()));

        if (filteredNfts?.length) {
            setNfts(filteredNfts);
        } else {
            setNfts(nftsCopy)
        }
    }

    const onClearSearch = () => {
        if (nfts?.length && nftsCopy?.length) {
            setNfts(nftsCopy);
        }
    }

    return (<div className="flex justify-center sm:p-4 p-12 bg-gray-100 dark:bg-nft-dark">
            <div className="w-full minmd:w-4/5">
                <Banner
                    bannerAttribute="Discover, collect, and sell extraordinary NFTs"
                    childStyle="md:text-4xl sm:text-2xl xs:text-xl text-left"
                    parentStyle="justify-start mb-6 h-72 sm:h-60 p-12 xs:p- xs:h-[200px] rounded-3xl"
                />

                {!isLoading && !nfts?.length? (
                    <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                        No NFTs Listed For Sale
                    </h1>
                ) : isLoading ? <Loader/> : (
                    <>
                        <div>
                            <h1 className="font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold ml-4 xs:ml-0">
                                🥇Top Sellers
                            </h1>
                            <div className="relative flex-1 max-w-full flex mt-3"
                                 ref={parentRef}>
                                <div className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
                                     ref={scrollRef}>
                                    {topCreators.map((creator, i) => (
                                        <CreatorCard
                                            key={creator.seller}
                                            rank={i + 1}
                                            creatorImage={images[`creator${i + 1}`]}
                                            creatorName={creator.seller?.length > 10 ? `${creator.seller.slice(0, 5)}...${creator.seller.slice(creator.seller?.length - 4)}` : creator.seller}
                                            creatorEths={creator.sum}
                                        />
                                    ))}
                                    {!hideButtons && (
                                        <>
                                            <div
                                                onClick={() => {
                                                    handleScroll('left');
                                                }}
                                                className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0">
                                                <Image src={images.left}
                                                       alt="left"
                                                       fill={true}
                                                       sizes='(max-width: 768px) 100vw, 33vw'
                                                       style={{objectFit: "contain"}}
                                                       className={theme === 'light' ? 'filter invert' : 'filter out'}/>
                                            </div>
                                            <div
                                                onClick={() => {
                                                    handleScroll('right');
                                                }}
                                                className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0">
                                                <Image src={images.right}
                                                       alt="left"
                                                       fill={true}
                                                       sizes='(max-width: 768px) 100vw, 33vw'
                                                       style={{objectFit: "contain"}}
                                                       className={theme === 'light' ? 'filter invert' : 'filter out'}/>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-10">
                            <div className="flexBetween mx-4 xs:mx-0 minlg:mx-8 sm:flex-col sm:items-start">
                                <h1 className="flex-1 font-poppins dark:text-white text-nft-black-1 text-2xl minlg:text-4xl font-semibold sm:mb-4">
                                    🔥Hot NFTs
                                </h1>
                                <div className="flex-2 sm:w-full flex flex-row sm:flex-col">
                                    <SearchBar
                                        activeSelect={activeSelect}
                                        setActiveSelect={setActiveSelect}
                                        handleSearch={onHandleSearch}
                                        clearSearch={onClearSearch}
                                    />
                                </div>
                            </div>
                            <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
                                {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft}/>)}
                            </div>
                        </div>
                    </>
                )
                }
            </div>
        </div>
    );
};
export default Home;
