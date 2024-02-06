import React, {useEffect, useState} from 'react';
import Image from 'next/image';
import {useTheme} from "next-themes";

import images from "@/assets";
import {toggle} from "@nextui-org/react";

const SearchBar = ( {activeSelect, setActiveSelect, handleSearch, clearSearch } ) => {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const {theme} = useTheme();
    const [toggle, setToggle] = useState(false);
    const [isRotated, setIsRotated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(debouncedSearch);
        }, 1000);

        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    useEffect(() => {
        if (search) {
            handleSearch(search);
        } else {
            clearSearch();
        }
    }, [search]);


    return (
        <>
            <div
                className="flex-1 flexCenter dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md py-3">
                <Image src={images.search}
                       alt="search"
                       height={20}
                       style={{objectFit: "contain"}}
                       className={theme === 'light' ? 'filter invert' : 'filter out'}
                />
                <input
                    type="text"
                    placeholder="Search NFT here..."
                    className="dark:bg-nft-black-2 bg-white mx-4 w-full dark:text-white text-nft-black-1 font-normal text-xs outline-none"
                    value={debouncedSearch}
                    onChange={(e) => setDebouncedSearch(e.target.value)}
                />
            </div>
            <div onClick={() => {setToggle((prevToggle) => !prevToggle); setIsRotated(!isRotated)}}
                 className="relative flexBetween ml-4 sm:ml-0 sm:mt-2 min-w-190 cursor-pointer dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 px-4 rounded-md">
                <p className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs py-3">{activeSelect}</p>
                <Image src={images.arrow}
                       alt="arrow"
                       width={15}
                       style={{objectFit: "contain"}}
                       className={`${theme === 'light'? 'filter invert' : 'filter out'} transform ${isRotated ? 'rotate-180' : ''} ease-in duration-200`}
                />
                {toggle && (
                    <div
                        className="absolute top-full left-0 right-0 w-full mt-3 z-10 dark:bg-nft-black-2 bg-white border dark:border-nft-black-2 border-nft-gray-2 py-3 px-4 rounded-md">
                        {['Recently Added', 'Price (Low to High)', 'Price (High to Low)'].map(item => (
                            <p key={item}
                               className="font-poppins dark:text-white text-nft-black-1 font-normal text-xs my-3 cursor-pointer hover:text-blue-500 hover:dark:text-blue-500 hover:underline"
                               onClick={() => setActiveSelect(item)}
                            >
                                {item}
                            </p>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default SearchBar;
