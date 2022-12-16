import React, { useState, createContext, useContext } from 'react';

const GlobalContext = createContext(null);

export const GlobalDataProvider = ({ children }) => {
  const [SRDetails, setSRDetails] = useState({});
  const [depositeRequestDataAvailable,setDepositeRequestDataAvailable]=useState({})
  const [moneyDepositeUrl,setMoneyDepositeUrl]=useState(null)
  const [globalLoader,setGlobalLoader]=useState(false)
  


  return (
    <GlobalContext.Provider
      value={{
        SRDetails,
        setSRDetails,
        depositeRequestDataAvailable,
        setDepositeRequestDataAvailable,
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
