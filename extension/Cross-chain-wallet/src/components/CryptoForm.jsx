import React, { useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
// import 'bootstrap/dist/css/bootstrap.min.css';

const CryptoForm = () => {
    const [crypto1, setCrypto1] = useState('Fuji');
    const [crypto2, setCrypto2] = useState('Matic');
    const [input1, setInput1] = useState('');
    const [input2, setInput2] = useState('');
    const [account, setAccount] = useState('Connect Wallet');
    const [quoteData, setQuoteData] = useState(null);
    const [step1, setStep1] = useState('');
    const [step2, setStep2] = useState('');
    const [step3, setStep3] = useState('');

    const tokenDetails = {
        'Fuji': {
            address: "0xb452b513552aa0B57c4b1C9372eFEa78024e5936",
            chainId: "43113",
        },
        'Matic': {
            address: "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054",
            chainId: "80001",
        }
    };

    const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api";

    const ERC20_ABI = [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function allowance(address owner, address spender) public view returns (uint256)"
    ];

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);
            } catch (error) {
                console.error("Could not connect to wallet:", error);
                alert('Failed to connect wallet');
            }
        } else {
            alert("Please install MetaMask!");
        }
    };

    const getQuote = async (amount) => {
        const from = "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054";
        const to = "0xb452b513552aa0B57c4b1C9372eFEa78024e5936";
        const params = {
            'fromTokenAddress': account,
            'toTokenAddress': to,
            'amount': amount,
            'fromTokenChainId': "80001",
            'toTokenChainId': "43113", // Fuji
            'partnerId': "0",
        }
        console.log("params ->", params)
        const endpoint = "v2/quote";
        const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

        try {
            const response = await axios.get(quoteUrl, { params });
            setQuoteData(response.data);
            setInput2(response.data.amountTo.toString());
            setStep1('✅');
        } catch (error) {
            console.error("Error fetching quote data:", error);
            setInput2('Error fetching data');
        }
    };

    const checkAndSetAllowance = async () => {
        if (!window.ethereum) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const token = new ethers.Contract(tokenDetails[crypto1].address, ERC20_ABI, signer);
        const allowance = await token.allowance(account, quoteData.allowanceTo);

        if (allowance.lt(ethers.BigNumber.from(input1))) {
            const tx = await token.approve(quoteData.allowanceTo, ethers.constants.MaxUint256);
            await tx.wait();
            setStep2('✅ Approved');
        } else {
            setStep2('✅ Already approved');
        }
    };

    const executeTransaction = async () => {
        if (!window.ethereum || !quoteData) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const tx = await signer.sendTransaction({
            to: quoteData.to,
            from: quoteData.from,
            value: quoteData.value,
        });

        const receipt = await tx.wait();
        console.log(`Transaction successful: ${receipt.transactionHash}`);
        setStep3('✅ Transaction successful');
    };

    const handleInput1Change = (e) => {
        const amount = e.target.value;
        setInput1(amount);
        if (amount.trim() !== '') {
            getQuote(amount);
        } else {
            setInput2('');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">

                <div className="card-body">
                    <button className="btn btn-primary mb-3" onClick={connectWallet}>
                        {account === 'Connect Wallet' ? 'Connect Wallet' : 'Connected: ' + account.substring(0, 6) + '...' + account.substring(38)}
                    </button>
                    <div className="form-group">
                        <label>Select Source Cryptocurrency:</label>
                        <select className="form-control" value={crypto1} onChange={(e) => setCrypto1(e.target.value)}>
                            <option value="Fuji">Fuji</option>
                            <option value="Matic">Matic</option>
                        </select>
                    </div>
                    <div className="form-group mt-3">
                        <label>Select Destination Cryptocurrency:</label>
                        <select className="form-control" value={crypto2} onChange={(e) => setCrypto2(e.target.value)}>
                            <option value="Fuji">Fuji</option>
                            <option value="Matic">Matic</option>
                        </select>
                    </div>
                    <div className="form-group mt-3">
                        <label>Input Amount:</label>
                        <input className="form-control" type="text" value={input1} onChange={handleInput1Change} />
                    </div>
                    <div className="form-group mt-3">
                        <label>Converted Amount:</label>
                        <input className="form-control" type="text" value={input2} readOnly />
                    </div>
                    <button className="btn btn-success mt-3" onClick={() => { getQuote(input1) }}>Get Quote {step1}</button>
                    <button className="btn btn-warning mt-3" onClick={checkAndSetAllowance}>Check Allowance {step2}</button>
                    <button className="btn btn-danger mt-3" onClick={executeTransaction}>Execute {step3}</button>
                </div>
            </div>
        </div>
    );
};

export default CryptoForm;
