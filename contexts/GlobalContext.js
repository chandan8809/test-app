import React, { useState, createContext, useContext } from 'react';

const GlobalContext = createContext(null);

export const GlobalDataProvider = ({ children }) => {
  const [SRDetails, setSRDetails] = useState({});
  const [depositRequestDetails,setDepositeRequestDetails]=useState({})
  const [moneyDepositeUrl,setMoneyDepositeUrl]=useState(null)
  const [globalLoader,setGlobalLoader]=useState(false)
  

  console.log("ads",SRDetails)
  return (
    <GlobalContext.Provider
      value={{
        SRDetails,
        setSRDetails,
        depositRequestDetails,
        setDepositeRequestDetails,
        moneyDepositeUrl,
        setMoneyDepositeUrl,
        globalLoader,
        setGlobalLoader
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Finally creating the custom hook
export const useGlobalData = () => useContext(GlobalContext);
