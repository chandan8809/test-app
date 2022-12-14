import React, { useState, createContext, useContext } from 'react';

const GlobalContext = createContext(null);

export const GlobalDataProvider = ({ children }) => {
  const [SRDetails, setSRDetails] = useState({});
  
  return (
    <GlobalContext.Provider
      value={{
        SRDetails,
        setSRDetails,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};

// Finally creating the custom hook
export const useGlobalData = () => useContext(GlobalContext);
