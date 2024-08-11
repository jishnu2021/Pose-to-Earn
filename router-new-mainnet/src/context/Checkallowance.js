// CheckAllowance.js
import ethers from '../ethers.js'
import erc20_abi from '../erc20_abi.js'

export const checkAndSetAllowance = async (wallet, tokenAddress, approvalAddress, amount) => {
    if (tokenAddress === ethers.constants.AddressZero) {
        return;
    }
    const erc20 = new ethers.Contract(tokenAddress, erc20_abi, wallet);
    const allowance = await erc20.allowance(await wallet.getAddress(), approvalAddress);
    if (allowance.lt(amount)) {
        const approveTx = await erc20.approve(approvalAddress, amount, { gasPrice: await wallet.provider.getGasPrice() });
        try {
            await approveTx.wait();
            console.log(`Transaction mined successfully: ${approveTx.hash}`);
        } catch (error) {
            console.log(`Transaction failed with error: ${error}`);
        }
    } else {
        console.log("Enough allowance");
        alert("Enough allowance");
    }
};

export const handleCheckAllowance = async (quoteData) => {
    if (window.ethereum) {
        console.log('MetaMask detected');
        try {
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log(accounts[0]);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            await checkAndSetAllowance(
                signer,
                '0xTokenAddress', // Replace with your token address
                quoteData.allowanceTo, // quote.allowanceTo in getQuote(params) response
                ethers.constants.MaxUint256 // Approving infinite allowance
            );

            console.log('Allowance checked and updated ✅');
        } catch (err) {
            console.error('Error:', err);
        }
    } else {
        console.error('MetaMask not detected');
    }
};
