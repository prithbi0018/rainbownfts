require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

const privateKey = 'a0e45eb093f981079bd2f56a2514030c422ae9b13592aef35e09c5487c831f31';

const ANKR_API_KEY = '81aaf2c58cc6ed7d9d12773b5cc124b7dd9b508ab0b52a39e37f505dbf116889';

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.19",
    networks: {
        hardhat: {},
        polygon_amoy: {
            url: `https://rpc.ankr.com/polygon_amoy/${ANKR_API_KEY}`,
            accounts: [`0x${privateKey}`],
            chainId: 80002
        }
    }
};
