import React, { useContext, useEffect, useState } from "react";
import UserContext from "../UserContext";
import { RelayProvider } from "@opengsn/provider";
import { ethers } from "ethers";

function useContractHook(address) {
  // console.log(address);
  let work = {
    abi: [
      {
        inputs: [
          {
            internalType: "address",
            name: "_tokenAddress",
            type: "address",
          },
          {
            internalType: "address",
            name: "_forwarder",
            type: "address",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: false,
            internalType: "address",
            name: "payer",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "TokenPayment",
        type: "event",
      },
      {
        inputs: [],
        name: "getTrustedForwarder",
        outputs: [
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "forwarder",
            type: "address",
          },
        ],
        name: "isTrustedForwarder",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "receiveToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "tokenAddress",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_recipient",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_amount",
            type: "uint256",
          },
        ],
        name: "withdrawTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ],
  };
  const [provider, setProvider] = useState({});
  const [Contract, SetContract] = useState({});

  useEffect(() => {
    checkForConnection();
  }, []);
  useEffect(() => {
    connectProviderToContract();
  }, [provider]);
  const connectProviderToContract = () => {
    console.log(address);
    if (
      Object.keys(provider).length == 0 ||
      address == undefined ||
      address.length <= 0
    )
      return;
    console.log(provider);
    // const abi = ["function transfer(address to, uint amount)"];
    let theContract = new ethers.Contract(
      address,
      work.abi,
      provider.getSigner()
    );
    // console.log(theContract);
    SetContract(theContract);
  };
  const checkForConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        console.log("connected");
        connectToRelayer();
      } else {
        console.log("notConnected");
      }
    }
  };
  const connectToWeb3 = async () => {
    if (!checkForEtherium()) return;
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);

    connectToRelayer();
  };
  const checkForEtherium = () => {
    if (typeof window.ethereum !== "undefined") {
      return true;
    } else {
      console.log("Please install MetaMask");
      return false;
    }
  };
  const connectToRelayer = async () => {
    let gsnProvider = await RelayProvider.newProvider({
      provider: window.ethereum,
      config: {
        paymasterAddress: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
      },
    }).init();
    const provider = new ethers.providers.Web3Provider(gsnProvider);
    setProvider(provider);
  };
  return {
    connectToWeb3,
    provider,
    checkForEtherium,
    checkForConnection,
  };
}

export default useContractHook;
