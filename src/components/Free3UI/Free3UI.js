import React, { useEffect, useState } from "react";
import { Button, Typography, Box } from "@mui/material";
import { RelayProvider, ether } from "@opengsn/provider";
import { ethers } from "ethers";
import axios from "axios";
function Free3UI() {
  const abi = [
    {
      inputs: [
        {
          internalType: "address",
          name: "_client",
          type: "address",
        },
        {
          internalType: "address",
          name: "_freelancer",
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
      inputs: [],
      name: "FundsNotReleased",
      type: "error",
    },
    {
      inputs: [],
      name: "NotOwner",
      type: "error",
    },
    {
      inputs: [],
      name: "unableToTransfer",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "address",
          name: "currentSender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          indexed: false,
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "price",
          type: "uint256",
        },
      ],
      name: "FundHasBeenTransfer",
      type: "event",
    },
    {
      inputs: [],
      name: "checkAmount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "fundsReleased",
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
      name: "releaseFund",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "walletAddress",
          type: "address",
        },
      ],
      name: "withdrawMoney",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ];
  const [isWeb3Connected, setIsWeb3Connected] = useState(false);
  const [provider, setProvider] = useState({});
  const [contract, SetContract] = useState({});
  const [amount, setAmount] = useState("");
  const [isFundsReleased, setIsFundsReleased] = useState(false);
  const [address, setAddress] = useState("");
  useEffect(() => {
    getContractAddress();
    isConnected();
  }, []);
  useEffect(() => {
    connectProviderToContract();
  }, [provider]);
  const getContractAddress = async () => {
    try {
      const res = await axios.get("http://localhost:8080/getContract");
      setAddress(res.data.message);
    } catch (err) {
      console.log(err);
    }
  };
  const checkForEtherium = () => {
    if (typeof window.ethereum !== "undefined") {
      return true;
    } else {
      console.log("Please install MetaMask");
      return false;
    }
  };
  const isConnected = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length > 0) {
        setIsWeb3Connected(true);
        console.log("connected");
        connectToRelayer();
      } else {
        setIsWeb3Connected(false);
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
    setIsWeb3Connected(true);
    connectToRelayer();
  };
  const connectToRelayer = async () => {
    let gsnProvider = await RelayProvider.newProvider({
      provider: window.ethereum,
      config: {
        paymasterAddress: "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
      },
    }).init();
    const provider = new ethers.providers.Web3Provider(gsnProvider);
    setProvider(provider);
  };
  const connectProviderToContract = () => {
    if (Object.keys(provider).length == 0 || address.length <= 0) return;

    let theContract = new ethers.Contract(address, abi, provider.getSigner());
    SetContract(theContract);
  };
  const handleCheckContractAmount = async () => {
    let val = await contract.checkAmount().catch((err) => {
      console.log(err);
    });
    val = ethers.utils.formatEther(val);
    console.log(val);
    setAmount(val);
  };
  const handleReleaseFundsFromContract = async () => {
    await contract.releaseFund().catch((err) => {
      console.log(err);
    });
    const val = await contract.fundsReleased();
    console.log(val);
    setIsFundsReleased(val);
  };
  const handleWindrawFundsFromContract = async () => {
    await contract
      .withdrawMoney("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266")
      .catch((err) => {
        console.log(err);
      });
    handleCheckContractAmount();
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          sx={{ backgroundColor: isWeb3Connected ? "green" : "blue" }}
          variant={"contained"}
          onClick={connectToWeb3}
        >
          {isWeb3Connected ? (
            <Typography>{"Connected to Web3"}</Typography>
          ) : (
            <Typography>{"Connect to Web3"}</Typography>
          )}
        </Button>
        <Button variant={"contained"} onClick={handleCheckContractAmount}>
          Check Amount
        </Button>
        {amount.length > 0 && (
          <Typography>{`Contract Amount ${amount}`}</Typography>
        )}
        <Button variant={"contained"} onClick={handleReleaseFundsFromContract}>
          Release Funds
        </Button>
        {isFundsReleased && (
          <Typography>{`Funds has been released`}</Typography>
        )}
        <Button variant={"contained"} onClick={handleWindrawFundsFromContract}>
          Withdraw Funds
        </Button>
      </Box>
    </>
  );
}

export default Free3UI;
