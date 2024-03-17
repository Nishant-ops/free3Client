import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, gql, useSubscription } from "@apollo/client";
import ServiceCardHorizontal from "../../components/service-card/ServiceCardHorizontal";
import SentMessage from "../../components/message/SentMessage";
import { useMutation } from "@apollo/client";
import "./Order.css";
// import { useState } from "react";
import Cookies from "js-cookie";
import ReceivedMessage from "../../components/message/ReceivedMessage";
import { formatDate } from "../../utils/FormatUtils";
import { useRef } from "react";
import { useContext } from "react";
import UserContext from "../../UserContext";
import ReviewInput from "../../components/review/ReviewInput";
import Review from "../../components/review/Review";
import useContractHook from "../../Hooks/useContractHook";
import ContractInterface from "../../components/Contract/ContractInterface";
import { Box, TextField } from "@mui/material";
import { useFormik } from "formik";
// import { ethers } from "ethers";
// import React, { useContext, useEffect, useState } from "react";
// import UserContext from "../UserContext";
import { RelayProvider } from "@opengsn/provider";
import { ethers } from "ethers";
const validate = (values) => {
  const errors = {};
  if (!values.amount) {
    errors.amount = "Value has to be greater than 0";
  } else if (values.amount <= 0) {
    errors.amount = "Value has to be greater than 0";
  }
  return errors;
};
const GET_ORDER = gql`
  query getOrder($orderId: ID!) {
    orderById(orderId: $orderId) {
      _id
      service {
        _id
        title
        description
        images
        rating
      }
      client {
        _id
        username
        profile_picture
        wallet_address
      }
      freelancer {
        _id
        username
        profile_picture
        wallet_address
      }
      status
      date
      deadline
      price
      contractAddress
    }
  }
`;

// const GET_CONVERSATION_BY_ORDER_ID = gql`
//   query getConversationByOrderId($orderId: ID!) {
//     conversationByOrderId(orderId: $orderId) {
//       _id
//       messages {
//         _id
//         body
//         sender {
//           _id
//         }
//       }
//       users {
//         _id
//         username
//         profile_picture
//       }
//     }
//   }
// `;

// const SEND_MESSAGE = gql`
//   mutation sendMessage($conversation: ID!, $sender: ID!, $body: String!) {
//     sendMessage(
//       message: { conversation: $conversation, sender: $sender, body: $body }
//     ) {
//       _id
//       body
//       sender {
//         _id
//       }
//     }
//   }
// `;

const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      _id
    }
  }
`;

// const MESSAGE_SUBSCRIPTION = gql`
//   subscription messageSent($conversationId: ID!) {
//     messageSent(conversationId: $conversationId) {
//       body
//       sender {
//         _id
//       }
//     }
//   }
// `;

const GET_REVIEWS_BY_ORDER_ID = gql`
  query getReviewsByOrderId($orderId: ID!) {
    reviewsByOrderId(orderId: $orderId) {
      _id
      rating
      content
      reviewer {
        _id
        username
        profile_picture
      }
    }
  }
`;
const CREATE_CONTRACT = gql`
  mutation CreateContract(
    $orderId: ID!
    $clientWalletAddress: String!
    $freelancerWalletAddress: String!
    $amount: Float!
  ) {
    createContract(
      contract: {
        orderId: $orderId
        client_wallet: $clientWalletAddress
        freelancer_wallet: $freelancerWalletAddress
        amount: $amount
      }
    )
  }
`;
// function Messages({ conversation, messages, setMessages }) {
//   const userId = useContext(UserContext).userId;

//   const containerRef = useRef(null);

//   const { data, loading, error } = useSubscription(MESSAGE_SUBSCRIPTION, {
//     variables: {
//       conversationId: conversation._id,
//     },
//     onSubscriptionData: ({ subscriptionData }) => {
//       const message = subscriptionData.data.messageSent;
//       setMessages([...messages, message]);
//     },
//   });

//   useEffect(() => {
//     // Scroll to the bottom of the container when data changes
//     containerRef.current.scrollTop = containerRef.current.scrollHeight;
//   }, [data]);

//   // if (loading) {
//   //     return <p>Loading...</p>;
//   // }

//   // if (error) {
//   //     return <p>Error!</p>;
//   // }

//   if (messages) {
//     return (
//       <div className="messages__wrapper" ref={containerRef}>
//         {messages.map((message) => {
//           const user = { _id: message.sender._id };
//           conversation.users.map((u) => {
//             if (u._id === message.sender._id) {
//               user.username = u.username;
//               user.profile_picture = u.profile_picture;
//             }
//           });
//           if (message.sender._id === userId) {
//             return <ReceivedMessage message={message} user={user} />;
//           } else {
//             return <SentMessage message={message} user={user} />;
//           }
//         })}
//       </div>
//     );
//   }
// }

function GetOrderStatus({ status }) {
  switch (status) {
    case "pending":
      return (
        <div className="order__header__status">
          <span class="material-symbols-outlined">pending</span>
          <p>PENDING</p>
        </div>
      );
    case "in_progress":
      return (
        <div className="order__header__status order__status__in-progress">
          <span class="material-symbols-outlined">sync</span>
          <p>IN PROGRESS</p>
        </div>
      );
    case "declined":
      return (
        <div className="order__header__status order__status__declined">
          <span class="material-symbols-outlined">cancel</span>
          <p>DECLINED</p>
        </div>
      );
    case "completed":
      return (
        <div className="order__header__status order__status__completed">
          <span class="material-symbols-outlined">check_circle</span>
          <p>COMPLETED</p>
        </div>
      );
    case "closed":
      return (
        <div className="order__header__status order__status__closed">
          <span class="material-symbols-outlined">check_circle</span>
          <p>CLOSED</p>
        </div>
      );
    case "cancelled":
      return (
        <div className="order__header__status order__status__cancelled">
          <span class="material-symbols-outlined">cancel</span>
          <p>CANCELLED</p>
        </div>
      );
    default:
      return (
        <div className="order__header__status">
          <span class="material-symbols-outlined">pending</span>
          <p>PENDING</p>
        </div>
      );
  }
}

function GetOrderActions({
  status,
  updateOrderStatus,
  orderId,
  connectToWeb3,
}) {
  const isFreelancer = Cookies.get("isFreelancer");

  if (isFreelancer === "true") {
    switch (status) {
      case "pending":
        return (
          <div className="order__actions row">
            <button
              onClick={() => {
                updateOrderStatus({
                  variables: { orderId: orderId, status: "DECLINED" },
                }).then(() => {
                  window.location.reload();
                });
              }}
              className="order__button decline-order__button col-xs-12 col-sm-12 col-md-4 col-lg-4"
            >
              Decline
            </button>
            <button
              onClick={() => {
                updateOrderStatus({
                  variables: { orderId: orderId, status: "ACCEPTED" },
                }).then(async () => {
                  await connectToWeb3();
                  window.location.reload();
                });
              }}
              className="order__button accept-order__button col-xs-12 col-sm-12 col-md-4 col-lg-4"
            >
              Accept
            </button>
          </div>
        );
      case "in_progress":
        return (
          <div className="order__actions row">
            <button
              onClick={() => {
                updateOrderStatus({
                  variables: { orderId: orderId, status: "CANCELLED" },
                }).then(() => {
                  window.location.reload();
                });
              }}
              className="order__button cancel-order__button col-xs-12 col-sm-12 col-md-4 col-lg-4"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                updateOrderStatus({
                  variables: { orderId: orderId, status: "COMPLETED" },
                }).then(() => {
                  window.location.reload();
                });
              }}
              className="order__button complete-order__button col-xs-12 col-sm-12 col-md-4 col-lg-4"
            >
              Mark as completed
            </button>
          </div>
        );
      default:
        return <div className="order__actions"></div>;
    }
  } else {
    switch (status) {
      case "pending":
      case "in_progress":
        return (
          <div className="order__actions row">
            <button
              onClick={() => {
                updateOrderStatus({
                  variables: { orderId: orderId, status: "CANCELLED" },
                }).then(() => {
                  window.location.reload();
                });
              }}
              className="order__button cancel-order__button col-xs-12 col-sm-12 col-md-4 col-lg-4"
            >
              Cancel
            </button>
          </div>
        );
      case "completed":
        return (
          <div className="order__actions row">
            <button
              onClick={() => {
                updateOrderStatus({
                  variables: { orderId: orderId, status: "CLOSED" },
                }).then(() => {
                  window.location.reload();
                });
              }}
              className="order__button complete-order__button col-xs-12 col-sm-12 col-md-4 col-lg-4"
            >
              Pay
            </button>
          </div>
        );
      default:
        return <div className="order__actions"></div>;
    }
  }
}

function getService(data) {
  if (data) {
    const service = { ...data.orderById.service };
    service.freelancer = data.orderById.freelancer;
    return service;
  }
  return null;
}

function Order() {
  const imp = {
    abi: [
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
    ],
    bytecode:
      "0x60c060405260008060146101000a81548160ff021916908315150217905550735fbdb2315678afecb367f032d93f642f64180aa3600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034801561007f57600080fd5b50604051610b4d380380610b4d83398181016040528101906100a191906101c6565b8273ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff16815250508173ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250506101188161012060201b60201c565b505050610219565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061019382610168565b9050919050565b6101a381610188565b81146101ae57600080fd5b50565b6000815190506101c08161019a565b92915050565b6000806000606084860312156101df576101de610163565b5b60006101ed868287016101b1565b93505060206101fe868287016101b1565b925050604061020f868287016101b1565b9150509250925092565b60805160a05161090161024c6000396000818161017801526104cd015260008181610121015261020c01526109016000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c80632f97102914610067578063572b6c0514610083578063a2ff5539146100b3578063b564e926146100bd578063ccc6bc44146100db578063ce1b815f146100f9575b600080fd5b610081600480360381019061007c91906106ea565b610117565b005b61009d600480360381019061009891906106ea565b61046a565b6040516100aa9190610732565b60405180910390f35b6100bb6104c3565b005b6100c561056e565b6040516100d29190610732565b60405180910390f35b6100e3610584565b6040516100f09190610766565b60405180910390f35b610101610627565b60405161010e9190610790565b60405180910390f35b61011f610650565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16141580156101c757507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614155b156101fe576040517f30cd747100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6000610208610650565b90507f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036102ab5760001515600060149054906101000a900460ff161515036102aa576040517f651e975200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b5b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016103089190610790565b602060405180830381865afa158015610325573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061034991906107d7565b90506000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663a9059cbb86846040518363ffffffff1660e01b81526004016103aa929190610804565b6020604051808303816000875af11580156103c9573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906103ed9190610859565b905080610426576040517ff56b0dc900000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b7f7b415b9c38bcbf52c0919db350ff1b2ee04487c30033ea0b24dd4d1dafdc6cce8330878560405161045b9493929190610886565b60405180910390a15050505050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16149050919050565b6104cb610650565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1614610550576040517f30cd747100000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6001600060146101000a81548160ff02191690831515021790555050565b60008060149054906101000a900460ff16905090565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b81526004016105e19190610790565b602060405180830381865afa1580156105fe573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061062291906107d7565b905090565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000601460003690501015801561066c575061066b3361046a565b5b1561068057601436033560601c9050610684565b3390505b90565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006106b78261068c565b9050919050565b6106c7816106ac565b81146106d257600080fd5b50565b6000813590506106e4816106be565b92915050565b600060208284031215610700576106ff610687565b5b600061070e848285016106d5565b91505092915050565b60008115159050919050565b61072c81610717565b82525050565b60006020820190506107476000830184610723565b92915050565b6000819050919050565b6107608161074d565b82525050565b600060208201905061077b6000830184610757565b92915050565b61078a816106ac565b82525050565b60006020820190506107a56000830184610781565b92915050565b6107b48161074d565b81146107bf57600080fd5b50565b6000815190506107d1816107ab565b92915050565b6000602082840312156107ed576107ec610687565b5b60006107fb848285016107c2565b91505092915050565b60006040820190506108196000830185610781565b6108266020830184610757565b9392505050565b61083681610717565b811461084157600080fd5b50565b6000815190506108538161082d565b92915050565b60006020828403121561086f5761086e610687565b5b600061087d84828501610844565b91505092915050565b600060808201905061089b6000830187610781565b6108a86020830186610781565b6108b56040830185610781565b6108c26060830184610757565b9594505050505056fea26469706673582212207cbeb56a472ae3ddc2ccbd46929f24da0f6a2cc8d60296c082c091b63997cdb864736f6c63430008120033",
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
    if (Object.keys(provider).length == 0) return;
    console.log(provider);
    // const abi = ["function transfer(address to, uint amount)"];
    let theContract = new ethers.Contract(
      "0x5eb3Bc0a489C5A8288765d2336659EbCA68FCd00",
      imp.abi,
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
  const orderId = useParams().id;

  const userData = useContext(UserContext);

  const userId = userData.userId;

  const isFreelancer = Cookies.get("isFreelancer");
  const walletAddress = useContext(UserContext).walletAddress;

  // const [messages, setMessages] = useState([]);

  // const [message, setMessage] = useState("");
  // const { contract, connectToWeb3, checkForConnection, checkForEtherium } =
  //   useContractHook("0x59b670e9fA9D0A427751Af201D676719a970857b");
  // useEffect(() => {
  //   console.log(contract);
  // }, [contract]);
  // const handleMessageChange = (event) => {
  //   setMessage(event.target.value);
  // };
  const formik = useFormik({
    initialValues: {
      amount: "",
    },
    validate,
    onChange: (values) => {
      console.log(values);
    },
    onSubmit: (values) => {
      initateTransaction(values.amount).then(() => {
        createContract({
          variables: {
            amount: values.amount,
            orderId: orderId,
            clientWalletAddress: walletAddress,
            freelancerWalletAddress: data.orderById.freelancer.wallet_address,
          },
        });
      });
    },
  });

  // const {
  //   loading: loadingConversation,
  //   error: errorConversation,
  //   data: dataConversation,
  // } = useQuery(GET_CONVERSATION_BY_ORDER_ID, {
  //   variables: { orderId: orderId },
  // });

  const {
    loading: loadingReviews,
    error: errorReviews,
    data: dataReviews,
  } = useQuery(GET_REVIEWS_BY_ORDER_ID, {
    variables: { orderId: orderId },
  });

  // useEffect(() => {
  //   if (dataConversation) {
  //     setMessages(dataConversation.conversationByOrderId.messages);
  //   }
  // }, [dataConversation]);

  // if (dataConversation)
  //     console.log(dataConversation.conversationByOrderId.messages);

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);
  const [createContract, { data: address }] = useMutation(CREATE_CONTRACT);

  // const [
  //   sendMessage,
  //   {
  //     loading: loadingSendMessage,
  //     error: errorSendMessage,
  //     data: dataSendMessage,
  //   },
  // ] = useMutation(SEND_MESSAGE);

  const { loading, error, data } = useQuery(GET_ORDER, {
    variables: { orderId: orderId },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return `Error! ${error.message}`;
  const initateTransaction = async (amount) => {
    if (!checkForEtherium()) return;
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractAddress = "0x3Aa5ebB10DC797CAC828524e59A333d0A371443c";
    const contractABI = ["function transfer(address to, uint amount)"];
    const erc20 = new ethers.Contract(contractAddress, contractABI, signer);
    const transferToAddress = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";
    amount = ethers.utils.parseUnits(amount.toString(), 18);
    await erc20.transfer(transferToAddress, amount);
  };
  return (
    data && (
      <div className="order__container row">
        <div className="order__content__wrapper col-xs-12 col-sm-12 col-md-8 col-lg-8">
          <div className="order__header">
            <div className="order__header__title">
              <h1>Order</h1>
              <h2 className="order__header__id">
                #{data.orderById._id.slice(-6)}
              </h2>
            </div>
            <GetOrderStatus status={data.orderById.status.toLowerCase()} />
          </div>
          <div className="order__body">
            <div className="order__body__service">
              <div className="order__body__client"></div>
              <ServiceCardHorizontal service={getService(data)} />
            </div>
            <div className="order__body__details">
              <h2>Details</h2>
              <div className="order__body__details__container row">
                <div className="order__body__details__info col-xs-12">
                  <div className="order__body__details__item">
                    <p className="order__body__details__item__title">Client</p>
                    <p className="order__body__details__item__content">
                      {data.orderById.client.username}
                    </p>
                  </div>
                  <div className="order__body__details__item">
                    <p className="order__body__details__item__title">
                      Deadline
                    </p>
                    <p className="order__body__details__item__content">
                      {formatDate(new Date(data.orderById.deadline))}
                    </p>
                  </div>
                  <div className="order__body__details__item">
                    <p className="order__body__details__item__title">Price</p>
                    <p className="order__body__details__item__content">
                      ${data.orderById.price}
                    </p>
                  </div>
                  <div className="order__body__details__item">
                    <p className="order__body__details__item__title">
                      Ordered on
                    </p>
                    <p className="order__body__details__item__content">
                      {formatDate(new Date(data.orderById.date))}
                    </p>
                  </div>
                </div>
              </div>
              <GetOrderActions
                status={data.orderById.status.toLowerCase()}
                updateOrderStatus={updateOrderStatus}
                orderId={data.orderById._id}
                connectToWeb3={connectToWeb3}
              />
            </div>
            <div className="order__body__chat"></div>
          </div>
          <>
            {data.orderById.status == "ACCEPTED" &&
              data.orderById.client._id == userId && (
                <form onSubmit={formik.handleSubmit}>
                  <div className="input__container">
                    <label htmlFor="amount">Price</label>
                    <input
                      id="amount"
                      name="amount"
                      type="number"
                      onChange={formik.handleChange}
                      value={formik.values.amount}
                    />
                    {formik.touched.amount && formik.errors.amount ? (
                      <p className="info__validation amount__validation">
                        {formik.errors.amount}
                      </p>
                    ) : null}
                  </div>
                  <button
                    className="create-contract__submit-button"
                    type="submit"
                  >
                    Fund the escrow
                  </button>
                </form>
              )}
          </>
          {Contract && (
            <ContractInterface contract={Contract}></ContractInterface>
          )}
          {/* <div className="order__chat">
            <div className="order__chat__container">
              <div className="order__chat__messages">
                <div className="order__chat__messages__container">
                  {dataConversation && (
                    <Messages
                      conversation={dataConversation.conversationByOrderId}
                      messages={messages}
                      setMessages={setMessages}
                    />
                  )}
                </div>
              </div>
            </div>
            {(data.orderById.status.toLowerCase() === "in_progress" ||
              data.orderById.status.toLowerCase() === "pending") && (
              <div className="order__chat__input">
                <input
                  onChange={handleMessageChange}
                  value={message}
                  type="text"
                  placeholder="Type a message..."
                />
                <button
                  onClick={() => {
                    sendMessage({
                      variables: {
                        conversation:
                          dataConversation.conversationByOrderId._id,
                        sender: userId,
                        body: message,
                      },
                    });
                    setMessage("");
                  }}
                  className="order__chat__send-button"
                >
                  <span class="material-symbols-outlined">send</span>
                </button>
              </div>
            )}
          </div> */}
        </div>
        <div className="order__reviews col-xs-12 col-sm-12 col-md-4 col-lg-4">
          <div className="order__previous-reviews__wrapper">
            {dataReviews.reviewsByOrderId &&
              dataReviews.reviewsByOrderId.map((review) => {
                return (
                  <div className="old__review__container">
                    {review.reviewer._id === userId ? (
                      <h2>Your review</h2>
                    ) : review.reviewer._id === data.orderById.client._id ? (
                      <h2>Client's review</h2>
                    ) : (
                      <h2>Freelancer's review</h2>
                    )}
                    <Review
                      key={review._id}
                      src={review.reviewer.profile_picture}
                      name={review.reviewer.username}
                      value={review.rating}
                    >
                      <p>{review.content}</p>
                    </Review>
                  </div>
                );
              })}
          </div>
          {!dataReviews.reviewsByOrderId.find(
            (review) => review.reviewer._id === userId
          ) &&
            data.orderById.status.toLowerCase() === "closed" && (
              <ReviewInput
                orderId={orderId}
                serviceId={data.orderById.service._id}
                revieweeId={
                  userId === data.orderById.client._id
                    ? data.orderById.freelancer._id
                    : data.orderById.client._id
                }
              />
            )}
        </div>
      </div>
    )
  );
}

export default Order;
