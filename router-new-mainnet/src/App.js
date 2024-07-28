import React, { useState } from 'react';
import './App.css';
import { useWallet } from './context/WalletProvider';
import { ethers } from 'ethers';
import axios from 'axios';
 // Ensure you have the correct ABI for your ERC20 token

const PATH_FINDER_API_URL = "https://api-beta.pathfinder.routerprotocol.com/api/v2";
const erc20_abi = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "burnFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "ECDSAInvalidSignature",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "length",
        "type": "uint256"
      }
    ],
    "name": "ECDSAInvalidSignatureLength",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "ECDSAInvalidSignatureS",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "allowance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientAllowance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "needed",
        "type": "uint256"
      }
    ],
    "name": "ERC20InsufficientBalance",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "approver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidApprover",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidReceiver",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "ERC20InvalidSpender",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      }
    ],
    "name": "ERC2612ExpiredSignature",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "signer",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "ERC2612InvalidSigner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "currentNonce",
        "type": "uint256"
      }
    ],
    "name": "InvalidAccountNonce",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidShortString",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "OwnableInvalidOwner",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "OwnableUnauthorizedAccount",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "str",
        "type": "string"
      }
    ],
    "name": "StringTooLong",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "EIP712DomainChanged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "uint8",
        "name": "v",
        "type": "uint8"
      },
      {
        "internalType": "bytes32",
        "name": "r",
        "type": "bytes32"
      },
      {
        "internalType": "bytes32",
        "name": "s",
        "type": "bytes32"
      }
    ],
    "name": "permit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "eip712Domain",
    "outputs": [
      {
        "internalType": "bytes1",
        "name": "fields",
        "type": "bytes1"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "version",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "verifyingContract",
        "type": "address"
      },
      {
        "internalType": "bytes32",
        "name": "salt",
        "type": "bytes32"
      },
      {
        "internalType": "uint256[]",
        "name": "extensions",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "nonces",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
function App() {
  const { isAuthenticated, connectWallet, disconnectWallet } = useWallet();
  const [token1Address, setToken1Address] = useState('');
  const [token2Address, setToken2Address] = useState('');
  const [rpcUrlToken1, setRpcUrlToken1] = useState('');
  const [rpcUrlToken2, setRpcUrlToken2] = useState('');
  const [chainIdToken1, setChainIdToken1] = useState('');
  const [chainIdToken2, setChainIdToken2] = useState('');
  const [amount, setAmount] = useState('');
  const [token1Balance, setToken1Balance] = useState(null);
  const [token2Balance, setToken2Balance] = useState(null);
  const [quoteData, setQuoteData] = useState(null);

  const handleGetQuote = async () => {
    try {
      // Fetching balances
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const provider1 = new ethers.providers.JsonRpcProvider(rpcUrlToken1, chainIdToken1);
      const provider2 = new ethers.providers.JsonRpcProvider(rpcUrlToken2, chainIdToken2);
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      const contract1 = new ethers.Contract(token1Address, erc20_abi, provider1);
      const contract2 = new ethers.Contract(token2Address, erc20_abi, provider2);

      const balance1 = await contract1.balanceOf(walletAddress);
      const balance2 = await contract2.balanceOf(walletAddress);

      setToken1Balance(ethers.utils.formatEther(balance1));
      setToken2Balance(ethers.utils.formatEther(balance2));

      // Fetching quote
      const amountInWei = ethers.utils.parseUnits(amount, 18);
      const params = {
        fromTokenAddress: token1Address,
        toTokenAddress: token2Address,
        amount: amountInWei.toString(),
        fromTokenChainId: chainIdToken1,
        toTokenChainId: chainIdToken2,
        partnerId: "0",
      };
  
      const quote = await getQuote(params);
      setQuoteData(quote);
      console.log(quote);
    } catch (err) {
      console.error(err);
    }
  };

  const getQuote = async (params) => {
    const endpoint = "v2/quote";
    const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

    try {
      const res = await axios.get(quoteUrl, { params });
      return res.data;
    } catch (e) {
      console.error(`Fetching quote data from pathfinder: ${e}`);
      return null;
    }
  };

  const handleCheckAllowance = async () => {
    const fromTokenAddress = token1Address;
  
    if (window.ethereum && quoteData) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
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
    if (window.ethereum && quoteData) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log(accounts[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const txResponse = await getTransaction({
          fromTokenAddress: token1Address,
          toTokenAddress: token2Address,
          fromTokenChainId: chainIdToken1,
          toTokenChainId: chainIdToken2,
          widgetId: 0,
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
        fromTokenAddress: params.fromTokenAddress,
        toTokenAddress: params.toTokenAddress,
        slippageTolerance: 0.5,
        senderAddress: quoteData.senderAddress,  // Use walletAddress instead if necessary
        receiverAddress: quoteData.receiverAddress,  // Use walletAddress instead if necessary
        widgetId: params.widgetId
      });
      return res.data;
    } catch (e) {
      console.error(`Fetching tx data from pathfinder: ${e}`);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h3>Router Nitro Cross Chain wallet</h3>
        <button onClick={isAuthenticated ? disconnectWallet : connectWallet} id="wallet-connect">
          {isAuthenticated ? "Disconnect Wallet" : "Connect Wallet"}
        </button>
      </header>
      <h4 style={{color:'white'}}>Enter the details to move your tokens</h4>
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
      <input
        type="text"
        placeholder="Enter your amount"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <div className="App-body">
        <button onClick={handleGetQuote}>Get quote</button>
        <button onClick={handleCheckAllowance}>Check Allowance</button>
        <button onClick={handleExecuteTransaction}>Execute</button>
      </div>

      <div>
        <p>Token 1 Balance: {token1Balance !== null ? token1Balance : 'Not fetched'}</p>
        <p>Token 2 Balance: {token2Balance !== null ? token2Balance : 'Not fetched'}</p>
        {quoteData && <p>Quote Data: {JSON.stringify(quoteData)}</p>}
      </div>
    </div>
  );
}

export default App;
