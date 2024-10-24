import React from "react";
import { PuffLoader } from "react-spinners";

const LoadingTable = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <PuffLoader color="#2f9cf5" />
    </div>
  );
};

export default LoadingTable;
