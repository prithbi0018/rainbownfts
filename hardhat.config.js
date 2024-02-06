require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

const MATICVIGIL_API_KEY = process.env.NEXT_PUBLIC_MATICVIGIL_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {},
        polygon_mumbai: {
            url: `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_API_KEY}`,
            accounts: [`0x${privateKey}`],
            chainId: 80001
        }
    }
};
