import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ethers } from 'ethers';

function App() {
  const from = "0x69dc97bb33e9030533ca2006ab4cef67f4db4125";
  const to = "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f";
  const [amount, setAmount] = useState(0);
  const [quoteData, setQuoteData] = useState('');
  const [holskyBalance, setHolskyBalance] = useState(0);
  const [avalancheBalance, setAvalancheBalance] = useState(0);
  const [account, setAccount] = useState('Connect Wallet');
  const [step1, setStep1] = useState('');
  const [step2, setStep2] = useState('');
  const [step3, setStep3] = useState('');
  
  const erc20_abi = [ /* ABI content */ ];
  
  const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api";
  
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

  const getTransaction = async (params, quoteData) => {
    const endpoint = "v2/transaction";
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    try {
      const res = await axios.post(txDataUrl, {
        ...quoteData,
        slippageTolerance: 0.5,
        senderAddress: account,
        receiverAddress: account,
      });
      return res.data;
    } catch (e) {
      console.error(`Fetching tx data from pathfinder: ${e}`);
    }
  };

  return (
    <div className="body">
      <center>
        <div className="navbar">
          <h1 className="name">Router Nitro Dapp</h1>
          <button className="button-52" onClick={async () => {
            if (window.ethereum) {
              console.log('detected');

              try {
                const accounts = await window.ethereum.request({
                  method: "eth_requestAccounts",
                });

                setAccount(accounts[0]);

                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const provider1 = new ethers.providers.JsonRpcProvider("https://rpc.holesky.ethpandaops.io", 17000);
                const provider2 = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/avalanche_fuji", 43113);
                const signer = provider.getSigner();

                const contract = new ethers.Contract(to, erc20_abi, provider1);

                let balance = await contract.balanceOf(accounts[0]);

                setHolskyBalance(ethers.utils.formatEther(balance));
                const contract2 = new ethers.Contract(from, erc20_abi, provider2);
                balance = await contract2.balanceOf(accounts[0]);
                setAvalancheBalance(ethers.utils.formatEther(balance));
              } catch (err) {
                console.log(err);
              }
            }
          }}>
            {account.substring(0, 4) + "...." + account.substring(38, 42)}
          </button>
        </div>
        <br />
        <br /><br />
        <h5>Transfer AFTT from Fuji to Holsky</h5>
        <br />
        <div>Fuji: {avalancheBalance}&nbsp;&nbsp;&nbsp;&nbsp;Holsky: {holskyBalance}</div>
        <br />
        <input placeholder='Enter Amount' onChange={(e) => { setAmount(e.target.value * Math.pow(10, 18)) }}></input>
        <h2>Steps Involved</h2>
        <br />

        <button className="button-51" onClick={async () => {
          const params = {
            'fromTokenAddress': from,
            'toTokenAddress': to,
            'amount': amount,
            'fromTokenChainId': "43113",
            'toTokenChainId': "17000",
            'partnerId': "0",
          };

          const quoteData = await getQuote(params);
          setQuoteData(quoteData);
          setStep1('✅');
        }}>
          Step 1: Get Quote {step1}
        </button>

        <br />
        <br />
        <button className="button-51" onClick={async () => {
          if (window.ethereum) {
            try {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });

              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();

              await checkAndSetAllowance(
                signer,
                from,
                quoteData.allowanceTo,
                ethers.constants.MaxUint256
              );
              setStep2('✅');
            } catch (err) {
              console.log(err);
            }
          }
        }}>
          Step 2: Check Allowance {step2}
        </button>
        <br />
        <br />

        <button className="button-51" onClick={async () => {
          if (window.ethereum) {
            try {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });

              const provider = new ethers.providers.Web3Provider(window.ethereum);
              const signer = provider.getSigner();

              const txResponse = await getTransaction({
                'fromTokenAddress': from,
                'toTokenAddress': to,
                'fromTokenChainId': "43113",
                'toTokenChainId': "17000",
                'widgetId': 0,
              }, quoteData);

              const tx = await signer.sendTransaction(txResponse.txn);
              try {
                await tx.wait();
                console.log(`Transaction mined successfully: ${tx.hash}`);
                alert(`Transaction mined successfully: ${tx.hash}`);
                setStep3('✅');
              } catch (error) {
                console.log(`Transaction failed with error: ${error}`);
              }
            } catch (err) {
              console.log(err);
            }
          }
        }}>
          Step 3: Execute {step3}
        </button>
      </center>
    </div>
  );
}

export default App;
