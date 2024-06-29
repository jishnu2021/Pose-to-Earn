require("@nomiclabs/hardhat-waffle");
require("dotenv").config({ path: ".env" });


module.exports = {
  solidity: "0.8.4",
  networks: {
    fuji: {
      url: 'https://avalanche-fuji.infura.io/v3/35b7743e19734c8e8444dfcd560502e8',
      accounts: ['601b7fedd11c56eb589c90b30ba9671e3499434ad1ec366f62ba6594dc72fddb'],
    },
  },
};