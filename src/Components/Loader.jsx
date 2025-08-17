import React from "react";
import "../Styles/Loader.css";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="loader-wrapper">
      <div className="loader-ring"></div>
      <span className="loader-text">{text}</span>
    </div>
  );
};

export default Loader;
