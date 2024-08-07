import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface BitcoinData {
  time: {
    updated: string;
  };
  bpi: {
    USD: {
      rate_float: number;
    };
  };
}

const fetchBitcoinData = async (): Promise<BitcoinData> => {
  const response = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useBitcoinData = () => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  const { data: bitcoinData, isLoading, error } = useQuery<BitcoinData>({
    queryKey: ['bitcoinPrice'],
    queryFn: fetchBitcoinData,
    refetchInterval: 60000, // Refetch every minute
  });

  useEffect(() => {
    if (bitcoinData) {
      if (previousPrice === null) {
        setPreviousPrice(bitcoinData.bpi.USD.rate_float);
      } else {
        setPreviousPrice((prev) => (prev !== null ? prev : bitcoinData.bpi.USD.rate_float));
      }
    }
  }, [bitcoinData, previousPrice]);

  const currentPrice = bitcoinData?.bpi.USD.rate_float ?? 0;
  const priceChange = previousPrice ? currentPrice - previousPrice : 0;
  const percentChange = previousPrice ? (priceChange / previousPrice) * 100 : 0;

  return {
    bitcoinData,
    isLoading,
    error,
    currentPrice,
    priceChange,
    percentChange,
  };
};
