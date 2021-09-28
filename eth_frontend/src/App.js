import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import contractABI from './utils/WavePortal.json';
import waveportal from './utils/WavePortal.json';

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  /*
   * All state property to store all waves
   */
  const [allWaves, setAllWaves] = useState([]);
  const contractAddress = "0x5fCBEBb67Fb3664A3FEa61C6a7156F02043B94Ac"
  var message = "No message? Aww."
  /*
   * Create a method that gets all waves from your contract
   */
  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contractAddress, waveportal.abi, signer);

        /*
         * Call the getAllWaves method from your Smart Contract
         */
        const waves = await waveportalContract.getAllWaves();
        

        /*
         * We only need address, timestamp, and message in our UI so let's
         * pick those out
         */
        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        /*
         * Store our data in React State
         */
        setAllWaves(wavesCleaned);
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
    } catch (error) {
      console.log(error)
    }
  }
const setMessage = async() => {
  message = document.getElementById('waveTxt').value;
}
const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const waveportalContract = new ethers.Contract(contractAddress, contractABI.abi, signer);

        let count = await waveportalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await waveportalContract.wave(message);
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined -- ", waveTxn.hash);

        count = await waveportalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    checkIfWalletIsConnected();
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <div className="header">
        Hi there! 
        </div>

        <div className="bio">
          My name is Joe Parker, and I'm a sophomore studying Computer Science at Columbia University. Connect your Ethereum wallet and give me a wave! 😎
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me! 👋
        </button>
        
        {/*
        * If there is no currentAccount render this button
        */}
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet. 🔌
          </button>
        )}

        {/*
        * If there is no currentAccount render this button
        */}
        {currentAccount && (
          <button className="connectedButton">
            Wallet Connected.
          </button>

        )}
        <p></p>
        <input name="waveTxt" id="waveTxt" type="text" maxlength="64" class="searchField" placeholder="Send a nice message with your wave! :)" onInput={setMessage}></input>
        
        {allWaves.map((wave, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>)
        })}

        <p></p>
          <center><h2>What's this About? 🤔</h2></center>
          <div id="aboutBlock" className="aboutBlock">
          This website uses Ethereum's <strong>blockchain</strong> to facilitate waves. A wave is an Ethereum <strong>smart contract</strong> that executes automatically. To send a wave, you must have a <a href='https://metamask.io/'>MetaMask</a> wallet. The button above will turn green when your wallet is connected to this website. 
          <p></p>
          This project has expandable functionality--smart contracts can be used for purchasing NFTs, placing Money Orders, etc. 
          <p></p>
          This project was made by Joe Parker, with help from _buildspace. Please see the GitHub repo below. (NOTE: all private API keys have been expunged).
          <p></p>
          <a href="githublinkHERE">GitHub</a>
          </div>
          <p>
           
          </p>
     
        <div className="attribution" >
        Go see the awesome people at <a href="https://buildspace.so/">_buildspace</a> for project information!
        </div>

        <p></p>
        <p></p>
        <p></p>

      </div>
    </div>
  );
}

export default App