"use client"
import market from './NFTMarketplace.json';

export const MarketAddress = process.env.NEXT_PUBLIC_PRIVATE_KEY;
export const MarketAddressAbi = market.abi;
