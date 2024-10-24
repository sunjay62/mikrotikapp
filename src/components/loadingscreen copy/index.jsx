import React from "react";
import { HashLoader } from "react-spinners";

const LoadingScreen = () => {
  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-full items-center justify-center bg-gray-900 bg-opacity-60">
      <HashLoader color="#2f9cf5" />
    </div>
  );
};

export default LoadingScreen;
