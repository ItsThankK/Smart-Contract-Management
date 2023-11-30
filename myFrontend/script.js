import {ethers, providers} from "./ethers-5.7.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectBtn = document.getElementById("connectBtn");
connectBtn.onclick = connectWallet;
const writeBtn = document.getElementById("writeBtn");
writeBtn.onclick = setName;
const readBtn = document.getElementById("readBtn");
readBtn.onclick = getName;

 
console.log("Welcome to my DApp!!!");
  
  async function connectWallet() {
    if (typeof window.ethereum != undefined ) {
      console.log("I see a MetaMask!");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected account:", address);
      document.getElementById("accountAddress").textContent =
      "Account Address: " + address;

      await window.ethereum.request({method: "eth_requestAccounts"});
      connectBtn.innerHTML="Wallet Connected"
      console.log("Wallet Connected Successfully!!!")
    } else {
      connectBtn.innerHTML="Please install MetaMask"
      console.log("No MetaMask!");}
  }

  async function setName() {
    const name = document.getElementById("write").value;
    console.log("Writing a name to the blockchain...");
    if (typeof window.ethereum != undefined ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      try {
        const transactionResponse = await contract.setName(name);
        console.log("Setting ", name, "to the blockchain...");
        await listenForTransactionMine(transactionResponse, provider);
        console.log("Done!!!");
      } catch (error) {
        console.log(error);
      }
  } 

  }

  async function getName() {
    console.log("Fetching a name from the blockchain!");

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
      const retrievedName = await contract.getName();
      console.log(`Retrieved your name: ${retrievedName}`);
      document.getElementById("readContentName").textContent =
      "Your stored name is : " + retrievedName;
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
