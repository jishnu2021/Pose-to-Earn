// ethereum
// contract address = 0x2170Ed0880ac9A755fd29B2688956BD959F933F8
// rpc https://eth.llamarpc.com 1

// matic 
// contract address = 0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0
// rpc https://polygon.llamarpc.com 137

document.addEventListener('DOMContentLoaded', function () {
    const privateKey = "Enter your private key";
    const app = document.getElementById('app');
  
    let walletAddress = '';
    let EthBalance = 0;
    let matBalance = 0;
    let quoteData = null;
  
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
  
    const render = () => {
      app.innerHTML = `
        <h1>Cross-chain Crypto Wallet</h1>
        
        <input type="text" id="privateKey" placeholder="Enter Private Key">
        <button id="connectWallet" class="button">Connect Wallet</button>
        <div id="walletAddress"></div>
        <div id="balances">
          <p>Eth: <span id="EthBalance">0</span></p>
          <p>mat: <span id="matBalance">0</span></p>
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

    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const connectWallet = async () => {
      // if (window.ethereum) {
      //   try {
      //     const accounts = await window.ethereum.request({
      //       method: "eth_requestAccounts",
      //     });
      
      const accounts = new ethers.Wallet(privateKey, provider);
          walletAddress = accounts.address;
          console.log(accounts.address);
          document.getElementById('walletAddress').innerText = `Wallet: ${walletAddress}`;
          await fetchBalances();
      //   } catch (err) {
      //     console.error(err);
      //   }
      // }
    };
    
    const fetchBalances = async () => {
      try {
        //const provider = new ethers.providers.Web3Provider(window.ethereum);
        const provider1 = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com", 1);
        
        const provider2 = new ethers.providers.JsonRpcProvider("https://polygon.llamarpc.com", 137);
        const signer = provider.getSigner();
        
        const contract1 = new ethers.Contract(
          "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
          erc20_abi,
          provider1
        );
        
        const contract2 = new ethers.Contract(
          "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
          erc20_abi,
          provider2
        );
        
  
        const balance1 = await contract1.balanceOf(walletAddress);
        const balance2 = await contract2.balanceOf(walletAddress);
        console.log('error')
        EthBalance = ethers.utils.formatEther(balance1);
        matBalance = ethers.utils.formatEther(balance2);
  
        document.getElementById('Ethereum Balance').innerText = EthBalance;
        document.getElementById('Matic Balance').innerText = matBalance;
      } catch (err) {
        console.error(err);
      }
    };
  
    const handleGetQuote = async () => {
      const amount = document.getElementById('amount').value * Math.pow(10, 18);
      const params = {
        'fromTokenAddress': "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
        'toTokenAddress': "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        'amount': amount,
        'fromTokenChainId': "1",
        'toTokenChainId': "137",
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
      const fromTokenAddress = "0x2170Ed0880ac9A755fd29B2688956BD959F933F8";
  
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
          console.log(accounts[0])
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
  
          const txResponse = await getTransaction({
            'fromTokenAddress': "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
            'toTokenAddress': "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
            'fromTokenChainId': "1",
            'toTokenChainId': "137",
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
          fromTokenAddress: params.fromTokenAddress,
          toTokenAddress: params.toTokenAddress,
          slippageTolerance: 0.5,
          senderAddress: walletAddress,
          receiverAddress: walletAddress,
          widgetId: params.widgetId
        });
        return res.data;
      } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`);
      }
    };
  
    render();
  });
  
