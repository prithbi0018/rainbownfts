require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

const privateKey = process.env.NEXT_PUBLIC_PRIVATE_KEY;

const ANKR_API_KEY = process.env.NEXT_PUBLIC_ANKR_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {},
        polygon_mumbai: {
            url: `https://rpc.ankr.com/polygon_mumbai/${ANKR_API_KEY}`,
            accounts: [`0x${privateKey}`],
            chainId: 80001
        }
    }
};
