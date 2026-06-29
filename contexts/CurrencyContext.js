import React, { createContext, useState } from "react";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState({ region: "United States", currency: "USD" });
  const [currencyRates, setCurrencyRates] = useState({ USD: 1 });

  return (
    <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, currencyRates, setCurrencyRates }}>
      {children}
    </CurrencyContext.Provider>
  );
};
