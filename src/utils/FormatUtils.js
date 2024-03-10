export function formatDate(date) {
  const currentDate = new Date();

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year:
      date.getFullYear() === currentDate.getFullYear() ? undefined : "numeric",
  };

  return date.toLocaleDateString(undefined, options);
}
export const checkForConnection = async () => {
  if (typeof window.ethereum !== "undefined") {
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      console.log("connected");
      return true;
    } else {
      console.log("notConnected");
      return false;
    }
  }
};
