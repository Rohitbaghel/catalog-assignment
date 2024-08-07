import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface BitcoinData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

const fetchBitcoinData = async (days: number): Promise<BitcoinData> => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useBitcoinData = (days: number = 30) => {
  const { data, isLoading, error } = useQuery<BitcoinData>({
    queryKey: ['bitcoinData', days],
    queryFn: () => fetchBitcoinData(days),
    refetchInterval: 60000, // Refetch every minute
  });

  const formattedData = data?.prices.map(([timestamp, price]) => ({
    date: new Date(timestamp).toISOString().split('T')[0],
    price: price,
    volume: data.total_volumes.find(vol => vol[0] === timestamp)?.[1] || 0
  })) || [];

  const currentPrice = formattedData[formattedData.length - 1]?.price || 0;
  const previousPrice = formattedData[formattedData.length - 2]?.price || 0;
  const priceChange = currentPrice - previousPrice;
  const percentChange = (priceChange / previousPrice) * 100;

  return {
    bitcoinData: formattedData,
    isLoading,
    error,
    currentPrice,
    priceChange,
    percentChange,
  };
};