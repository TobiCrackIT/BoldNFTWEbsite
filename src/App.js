import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';

import boldNFT from './utils/BoldNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please download Metamask Wallet");
    } else {
      console.log("Metamask detected");
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
      console.log("Found an authorized account:", account);

      setupEventListener();
    } else {
      console.log("No authorized account found");
    }

  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please download MetaMask!");
        return;
      }

      

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log('Connected: ', accounts[0]);
      setCurrentAccount(accounts[0]);

      setupEventListener();

    } catch (error) {
      console.log(error)
    }
  }

  // Setup our listener.
  const setupEventListener = async () => {
    const CONTRACT_ADDRESS = "0x1EF26aCF138cB5bF046dCeFf8df999A4D7ba00B7";
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, boldNFT.abi, signer);

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewBoldNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNFT = async () => {
    const CONTRACT_ADDRESS = "0x1EF26aCF138cB5bF046dCeFf8df999A4D7ba00B7";



    try {

      const { ethereum } = window;
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS,boldNFT.abi,signer);

        console.log("Going to pop wallet now to pay gas...");
        let txn= await connectedContract.mintABoldNFT();

        console.log("Mining...please wait.")
      await txn.wait();

      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`);


      }else {
      console.log("Ethereum object doesn't exist!");
    }

    } catch (error) {
      console.log(error)
    }
  }

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Bold NFT Collection</p>
          <p className="sub-text">
            Motivational NFTs for you. Discover your NFT today.
          </p>
          {currentAccount === '' ? (renderNotConnectedContainer()) : (
            <button onClick={askContractToMintNFT} className="cta-button connect-wallet-button">
              Mint NFT
            </button>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
