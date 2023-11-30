import {ethers, providers} from "./ethers-5.7.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectBtn = document.getElementById("connectBtn");
connectBtn.onclick = connectWallet;
const depositBtn = document.getElementById("depositBtn");
depositBtn.onclick = deposit;
const withdrawBtn = document.getElementById("withdrawBtn");
withdrawBtn.onclick = withdraw;
const balanceBtn = document.getElementById("balanceBtn");
balanceBtn.onclick = getBalance;

 
console.log("Welcome to metacrafters ATM!!!");
  
  async function connectWallet() {
    if (typeof window.ethereum != undefined ) {
      console.log("I see a MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected account:", address);
      console.log("\n");
      document.getElementById("accountAddress").textContent =
      "Connected Account: " + address;

      await window.ethereum.request({method: "eth_requestAccounts"});
      connectBtn.innerHTML="Wallet Connected"
      console.log("Wallet Connected Successfully!!!")
    } else {
      connectBtn.innerHTML="Please install MetaMask"
      console.log("No MetaMask!");}
  }

  async function deposit() {
    const amount = document.getElementById("deposit").value;
    console.log("Depositing...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.deposit(amount);
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Deposited ", amount, "!!!");
        console.log("Done!!!");
      console.log("\n");
      } catch (error) {
        console.log(error);
      }
  } 

  }

  async function withdraw() {
    const amount = document.getElementById("withdraw").value;
    console.log("Withdrawing...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.withdraw(amount);
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Withdrawn ", amount, "!!!");
        console.log("Done!!!");
      console.log("\n");
      } catch (error) {
        console.log(error);
      }
  }
  }

  async function getBalance() {
    console.log("Getting balance...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const balance = await contract.getBalance()
      console.log(ethers.utils.formatEther(balance) / 0.000000000000000001);
      console.log("\n");
      document.getElementById('balances').innerHTML= "Your balance is " + ethers.utils.formatEther(balance) / 0.000000000000000001;
    }
  }



  function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);
    return new Promise((resolve, reject) => {
      provider.once(transactionResponse.hash, (transactionReciept) => {
        console.log(`Completed with ${transactionReciept.confirmations} confirmations`);
        resolve()
      })
    });
  }
