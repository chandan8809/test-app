import React, { useState, createContext, useContext } from 'react';

const GlobalContext = createContext(null);

export const GlobalDataProvider = ({ children }) => {
  const [SRDetails, setSRDetails] = useState({});
  const [depositRequestDetails,setDepositeRequestDetails]=useState({})
  
  return (
    <GlobalContext.Provider
      value={{
        SRDetails,
        setSRDetails,
        depositRequestDetails,
        setDepositeRequestDetails
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Finally creating the custom hook
export const useGlobalData = () => useContext(GlobalContext);
