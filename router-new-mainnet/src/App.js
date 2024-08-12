import React, { useState } from 'react';
import './App.css';
import { useWallet } from './context/WalletProvider';
import getQuote from './context/GetQuote';
import checkAndSetAllowance from './context/Checkallowance';
import getTransaction from './context/Execute'
import { ethers } from 'ethers';


function App() {
  const { isAuthenticated, connectWallet, disconnectWallet, getAccounts, getProvider } = useWallet();
  const [token1Address, setToken1Address] = useState("");
  const [token2Address, setToken2Address] = useState("");
  const [rpcUrlToken1, setRpcUrlToken1] = useState("");
  const [rpcUrlToken2, setRpcUrlToken2] = useState("");
  const [chainIdToken1, setChainIdToken1] = useState("");
  const [chainIdToken2, setChainIdToken2] = useState("");
  const [amount, setAmount] = useState(0);
  const [token1Balance, setToken1Balance] = useState(null);
  const [token2Balance, setToken2Balance] = useState(null);
  const [quoteData, setQuoteData] = useState(null); // State to store the quote data
  const [chainId, setChainId] = useState(null);
  const [account, setAccount] = useState(null);
  const [step1, setStep1] = useState("");
  const [step2, setStep2] = useState("");
  const [step3, setStep3] = useState("");

  const handleGetQuote = async () => {
    setStep1("");
    const params = {
      fromTokenAddress: '0x4200000000000000000000000000000000000006',
      toTokenAddress: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      amount: amount, // Assuming amount is already in Wei format
      fromTokenChainId: 10,
      toTokenChainId: 42161,
      partnerId: 0,
    };

    const data = await getQuote(params);
    setQuoteData(data); // Update state with the fetched quote data
    setStep1("✅");
    

  };


const handleCheckAllowance = async (quoteData) => {
      setStep2('')
        try {
            
            console.log(quoteData);
            
            // const provider = new ethers.providers.JsonRpcProvider("https://optimism.llamarpc.com",10);
            const provider = new ethers.providers.Web3Provider(getProvider());
            const signer = provider.getSigner();
            console.log("Hello ami signer : ",signer)
            await checkAndSetAllowance(
                signer,
                '0x4200000000000000000000000000000000000006', // Replace with your token address
                quoteData.allowanceTo, // quote.allowanceTo in getQuote(params) response
                ethers.constants.MaxUint256 // Approving infinite allowance
            );
            console.log(getAccounts);
            console.log(getProvider);
            console.log('Allowance checked and updated ✅');
            
        } catch (err) {
            console.error('Error:', err);
        }
        setStep2('✅')
};

const handleExecute = async () => {
  if(window.ethereum) {
		console.log('detected');
  
		try {
		  const accounts = await window.ethereum.request({
			method: "eth_requestAccounts",
		  });
		  console.log(accounts[0])
		  const provider = new ethers.providers.Web3Provider(window.ethereum);
      console.log(provider)
		  const signer = provider.getSigner();
      console.log(signer)
      console.log(quoteData)
		  const params = {
        sender_address: accounts[0],
        receiver_address: accounts[0],
        refundAddress: accounts[0]
    };
    
    const txResponse = await getTransaction(params, quoteData);
    console.log(txResponse)
     // params have been defined in step 1 and quoteData has also been fetched in step 1
	
		// sending the transaction using the data given by the pathfinder
		const tx = await signer.sendTransaction(txResponse.txn)
    console.log(tx)
		try {
			await tx.wait();
			console.log(`Transaction mined successfully: ${tx.hash}`)
			alert(`Transaction mined successfully: ${tx.hash}`)
			setStep3('✅')
		}
		catch (error) {
			console.log(`Transaction failed with error: ${error}`)
		}
		}
		catch(err) {
		  console.log(err)
		}
	  }
};

  return (
    <div className="App">
      <header className="App-header">
        <h3>Crypto Wallet Extension</h3>
        <button
          onClick={isAuthenticated ? disconnectWallet : connectWallet}
          id="wallet-connect"
        >
          {isAuthenticated ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </header>
      <div className="App-body">
        <input
          type="text"
          placeholder="Token1's Address"
          value={token1Address}
          onChange={(e) => setToken1Address(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token2's Address"
          value={token2Address}
          onChange={(e) => setToken2Address(e.target.value)}
        />
        <input
          type="text"
          placeholder="RPC URL of Token 1"
          value={rpcUrlToken1}
          onChange={(e) => setRpcUrlToken1(e.target.value)}
        />
        <input
          type="text"
          placeholder="RPC URL of Token 2"
          value={rpcUrlToken2}
          onChange={(e) => setRpcUrlToken2(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chain ID of Token 1"
          value={chainIdToken1}
          onChange={(e) => setChainIdToken1(e.target.value)}
        />
        <input
          type="text"
          placeholder="Chain ID of Token 2"
          value={chainIdToken2}
          onChange={(e) => setChainIdToken2(e.target.value)}
        />
       <input placeholder='Enter Amount' onChange={(e)=>{setAmount(e.target.value*Math.pow(10,18))}}></input>
        <button onClick={handleGetQuote}>Get Quote{step1 && <span style={{ marginLeft: '10px' }}>{step1}</span>}</button>
        <button onClick={() => handleCheckAllowance(quoteData)}>Check Allowance {step2 && <span style={{ marginLeft: '10px' }}>{step2}</span>}</button> 
        <button onClick={handleExecute}>Execute</button>
      </div>
      <div>
        <p>
          Token 1 Balance:{" "}
          {token1Balance !== null ? token1Balance : "Not fetched"}
        </p>
        <p>
          Token 2 Balance:{" "}
          {token2Balance !== null ? token2Balance : "Not fetched"}
        </p>
        {quoteData && <p>Quote Data: {JSON.stringify(quoteData)}</p>}
      </div>
    </div>
  );
}

export default App;
