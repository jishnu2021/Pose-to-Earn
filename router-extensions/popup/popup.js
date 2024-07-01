document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');
  
    let walletAddress = '';
    let holskyBalance = 0;
    let avalancheBalance = 0;
    let quoteData = null;
  
    const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api";
  
    const render = () => {
      app.innerHTML = `
        <h1>Cross-chain Crypto Wallet</h1>
        <button id="connectWallet" class="button">Connect Wallet</button>
        <div id="walletAddress"></div>
        <div id="balances">
          <p>Holsky: <span id="holskyBalance">0</span></p>
          <p>Avalanche: <span id="avalancheBalance">0</span></p>
        </div>
        <input type="number" id="amount" placeholder="Enter Amount">
        <button id="getQuote" class="button">Get Quote</button>
        <button id="checkAllowance" class="button">Check Allowance</button>
        <button id="executeTransaction" class="button">Execute Transaction</button>
      `;
  
      document.getElementById('connectWallet').addEventListener('click', connectWallet);
      document.getElementById('getQuote').addEventListener('click', handleGetQuote);
      document.getElementById('checkAllowance').addEventListener('click', handleCheckAllowance);
      document.getElementById('executeTransaction').addEventListener('click', handleExecuteTransaction);
    };
  
    const connectWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          walletAddress = accounts[0];
          document.getElementById('walletAddress').innerText = `Wallet: ${walletAddress}`;
          await fetchBalances();
        } catch (err) {
          console.error(err);
        }
      }
    };
  
    const fetchBalances = async () => {
      try {
        const provider1 = new ethers.providers.JsonRpcProvider("https://rpc.holesky.ethpandaops.io", 17000);
        const provider2 = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/avalanche_fuji", 43113);
  
        const contract1 = new ethers.Contract(
          "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f",
          erc20_abi,
          provider1
        );
        const contract2 = new ethers.Contract(
          "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
          erc20_abi,
          provider2
        );
  
        const balance1 = await contract1.balanceOf(walletAddress);
        const balance2 = await contract2.balanceOf(walletAddress);
  
        holskyBalance = ethers.utils.formatEther(balance1);
        avalancheBalance = ethers.utils.formatEther(balance2);
  
        document.getElementById('holskyBalance').innerText = holskyBalance;
        document.getElementById('avalancheBalance').innerText = avalancheBalance;
      } catch (err) {
        console.error(err);
      }
    };
  
    const handleGetQuote = async () => {
      const amount = document.getElementById('amount').value * Math.pow(10, 18);
      const params = {
        'fromTokenAddress': "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
        'toTokenAddress': "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f",
        'amount': amount,
        'fromTokenChainId': "43113",
        'toTokenChainId': "17000",
        'partnerId': "0",
      };
  
      quoteData = await getQuote(params);
      console.log(quoteData);
    };
  
    const getQuote = async (params) => {
      const endpoint = "v2/quote";
      const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;
  
      try {
        const res = await axios.get(quoteUrl, { params });
        return res.data;
      } catch (e) {
        console.error(`Fetching quote data from pathfinder: ${e}`);
      }
    };
  
    const handleCheckAllowance = async () => {
      const fromTokenAddress = "0x69dc97bb33e9030533ca2006ab4cef67f4db4125";
  
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
  
          await checkAndSetAllowance(
            signer,
            fromTokenAddress,
            quoteData.allowanceTo,
            ethers.constants.MaxUint256
          );
        } catch (err) {
          console.error(err);
        }
      }
    };
  
    const checkAndSetAllowance = async (wallet, tokenAddress, approvalAddress, amount) => {
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
  
    const handleExecuteTransaction = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
  
          const txResponse = await getTransaction({
            'fromTokenAddress': "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
            'toTokenAddress': "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f",
            'fromTokenChainId': "43113",
            'toTokenChainId': "17000",
            'widgetId': 0,
          }, quoteData);
  
          const tx = await signer.sendTransaction(txResponse.txn);
          try {
            await tx.wait();
            console.log(`Transaction mined successfully: ${tx.hash}`);
            alert(`Transaction mined successfully: ${tx.hash}`);
          } catch (error) {
            console.log(`Transaction failed with error: ${error}`);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
  
    const getTransaction = async (params, quoteData) => {
      const endpoint = "v2/transaction";
      const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`;
  
      try {
        const res = await axios.post(txDataUrl, {
          ...quoteData,
          slippageTolerance: 0.5,
          senderAddress: walletAddress,
          receiverAddress: walletAddress,
        });
        return res.data;
      } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`);
      }
    };
  
    render();
  });
  