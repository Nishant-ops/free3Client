import LoadingIcons from "react-loading-icons";
import "./LoadingIndicator.css";
import React from "react";

function LoadingIndicator() {
  return (
    <div className="loading-icon__wrapper">
      <LoadingIcons.Puff stroke="#2DB67C" />
    </div>
  );
}

export default LoadingIndicator;
