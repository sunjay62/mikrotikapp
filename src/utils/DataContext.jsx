import React, { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filterConfiguration, setFilterConfiguration] = useState("");
  const [siteId, setSiteId] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSearch, setFilterSearch] = useState("");

  return (
    <DataContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        itemsPerPage,
        setItemsPerPage,
        filterConfiguration,
        setFilterConfiguration,
        siteId,
        setSiteId,
        filterStatus,
        setFilterStatus,
        filterSearch,
        setFilterSearch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
