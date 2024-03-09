import { createContext } from "react";

const UserContext = createContext({
  token: null,
  userId: null,
  username: null,
  profilePicture: null,
  isWeb3Connected: null,
  walletAddress: null,
});

export default UserContext;
