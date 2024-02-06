"use client";
import {useState, useEffect} from 'react';
import {useTheme} from 'next-themes';
import {SunIcon, MoonIcon} from "@heroicons/react/24/solid";

const ThemeSwitcher = () => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme();
    const [isRotated, setIsRotated] = useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    useEffect(() => {
        setMounted(true)
    }, []);

    if (!mounted) {
        return null
    }

    const handeleButtonClicked = () => {
        setIsRotated(!isRotated)
        setTheme(theme === 'light' ? 'dark' : 'light')
    }
    return (
        <div className="flex flex-initial flex-row justify-end">
            <div className="flex items-center mr-2">
                <button
                    aria-label="Toggle Theme"
                    type="button"
                    className={`transform ${isRotated ? 'rotate-90' : ''} ease-in duration-200`}
                    onClick={handeleButtonClicked}
                >
                    {theme === 'dark' ?
                        (<SunIcon className="w-6 h-6 text-white"/>) : (
                            <MoonIcon className="w-5 h-5 text-nft-black-1"/>
                        )}
                </button>
            </div>
        </div>
    );
};

export default ThemeSwitcher
