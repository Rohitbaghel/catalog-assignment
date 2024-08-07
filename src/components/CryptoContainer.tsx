"use client"
import React, { useState, useEffect } from 'react';
import { Crypto } from './Crypto';
import CryptoChart from './CryptoChart';

export const CryptoContainer = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("7");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds delay

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-48 w-48 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Crypto timeframe={activeTimeframe} />
      <CryptoChart 
        activeTimeframe={activeTimeframe} 
        setActiveTimeframe={setActiveTimeframe} 
      />
    </div>
  );
};