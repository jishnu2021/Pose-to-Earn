// src/components/CryptoForm.jsx

import React, { useState } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const CryptoForm = () => {
  const [crypto1, setCrypto1] = useState('Fuji');
  const [crypto2, setCrypto2] = useState('Holsky');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [sendingFrom, setSendingFrom] = useState({ tokenAddress: "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f", chainId: "17000", name: "Fuji", tokenName: "" });
  const [sendingTo, setSendingTo] = useState({ tokenAddress: "0x69dc97bb33e9030533ca2006ab4cef67f4db4125", chainId: "43113", name: "Holsky", tokenName: "" });
  const [account, setAccount] = useState('Connect Wallet')
  const [quoteData, setQuoteData] = useState('')

  const tokenDetailsList = [
    { tokenAddress: "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f", chainId: "17000", name: "Fuji", tokenName: "" },
    { tokenAddress: "0x69dc97bb33e9030533ca2006ab4cef67f4db4125", chainId: "43113", name: "Holsky", tokenName: "" },
  ]
  const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api"
  // Makes an HTTP GET Request to the Nitro Pathfinder API
  // quote data, which typically includes details about the token transfer, 
  // such as source and destination chains, token amount, fees, and other relevant information.
  const getQuote = async (params) => {
    const endpoint = "v2/quote"
    const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`

    console.log(quoteUrl)

    try {
      const res = await axios.get(quoteUrl, { params })
      return res.data;
    } catch (e) {
      console.error(`Fetching quote data from pathfinder: ${e}`)
    }
  }

  const getTransaction = async (params, quoteData) => {
    const endpoint = "v2/transaction"
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`

    console.log(txDataUrl)

    try {
      const res = await axios.post(txDataUrl, {
        ...quoteData,
        // fromTokenAddress: params.fromTokenAddress,
        // toTokenAddress: params.toTokenAddress,
        slippageTolerance: 0.5,
        senderAddress: account,
        receiverAddress: account,
        // widgetId: params.widgetId
      })
      return res.data;
    } catch (e) {
      console.error(`Fetching tx data from pathfinder: ${e}`)
    }
  }
  return (
    <div>
      <div>
        <label htmlFor="crypto1">Select Cryptocurrency 1:</label>
        <select id="crypto1" value={crypto1} onChange={(e) => {
          const new_val = tokenDetailsList.filter((eachItem) => eachItem.name === e.target.value)
          setCrypto1(new_val[0].name)
          setSendingFrom(new_val[0]);
        }}>
          {tokenDetailsList.map((eachItem, index) => {
            return <option value={eachItem.name} key={index}>{eachItem.name}</option>
          })}
        </select>
      </div>
      <div>
        <label htmlFor="input1">Input 1:</label>
        <input
          id="input1"
          type="text"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="crypto2">Select Cryptocurrency 2:</label>
        <select id="crypto2" value={crypto2} onChange={(e) => {

          const new_val = tokenDetailsList.filter((eachItem) => eachItem.name === e.target.value)
          setCrypto2(new_val[0].name)
          setSendingTo(new_val[0]);
          // console.log("new value -> " , new_val)
        }}>
          {tokenDetailsList.map((eachItem, index) => {
            return <option value={eachItem.name} key={index}>{eachItem.name}</option>
          })}
        </select>
      </div>
      <div>
        <label htmlFor="input2">Input 2:</label>
        <input
          id="input2"
          type="text"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
        />
      </div>
      <button className="button-51" onClick={async () => {

        const params = {
          'fromTokenAddress': sendingFrom.tokenAddress,
          'toTokenAddress': sendingTo.tokenAddress,
          'amount': input1,
          'fromTokenChainId': sendingFrom.chainId,
          'toTokenChainId': sendingTo.chainId, // Fuji
          'partnerId': "0",
          // 'widgetId': 0, // get your unique wdiget id by contacting us on Telegram
        }

        const quoteData = await getQuote(params);
        setQuoteData(quoteData)
        alert(quoteData.allowanceTo)

        console.log(quoteData)
      }}>Step 1: Get Quote</button>

      <button onClick={async () => {
        if (window.ethereum) {
          console.log('detected');


          //pop up metamask
          try {
            const accounts = await window.ethereum.request({
              method: "eth_requestAccounts",
            });

            console.log(accounts[0])
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();



            const txResponse = await getTransaction({
              'fromTokenAddress': sendingFrom.tokenAddress,
              'toTokenAddress': sendingTo.tokenAddress,
              'fromTokenChainId': sendingFrom.chainId,
              'toTokenChainId': sendingTo.chainId, // Fuji

              'widgetId': 0, // get your unique wdiget id by contacting us on Telegram
            }, quoteData); // params have been defined in step 1 and quoteData has also been fetched in step 1

            // sending the transaction using the data given by the pathfinder
            const tx = await signer.sendTransaction(txResponse.txn)
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
          catch (err) {
            console.log(err)
          }
        }
      }}>Submit</button>
    </div>
  );
};

export default CryptoForm;
