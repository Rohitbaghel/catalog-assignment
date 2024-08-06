"use client"

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
// import NavLinks from "./NavLinks";

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

const generateDummyData = (currentPrice: number) => {
  const data = [];
  const today = new Date();
  let price = currentPrice;

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Add some random fluctuation to the price
    const change = (Math.random() - 0.5) * 500; // Random change between -250 and 250
    price += change;
    
    data.push({
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      price: Math.max(0, price) // Ensure price doesn't go negative
    });
  }

  return data;
};

const CryptoChart = () => {
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);
  const fullScreenHandle = useFullScreenHandle();
  const [activeTimeframe, setActiveTimeframe] = useState('1w');

  const timeframes = ["1d", "3d", "1w", "1m", "6m", "1y", "max"];

  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe);
    // Here you would typically fetch new data based on the selected timeframe
    // For now, we'll just log the change
    console.log(`Timeframe changed to ${timeframe}`);
  };

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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  if (!bitcoinData) return null;

  const currentPrice = bitcoinData.bpi.USD.rate_float;
  const priceChange = previousPrice ? currentPrice - previousPrice : 0;
  const percentChange = previousPrice ? (priceChange / previousPrice) * 100 : 0;

  // Generate dummy data
  const data = generateDummyData(currentPrice);

  // Determine the color based on price change
  const priceChangeColor = priceChange >= 0 ? 'text-green-500' : 'text-red-500';

  return (
		<FullScreen handle={fullScreenHandle}>
			<div className='crypto-chart bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto'>
				<div className='mb-6'>
					<div className='flex items-start gap-x-2'>
						<h1
							className={`text-[70px] font-normal ${priceChangeColor}`}
						>
							{currentPrice.toLocaleString("en-US", {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							})}
						</h1>
						<p className='text-[24px] font-normal text-[#BDBEBF] pt-4'>
							USD
						</p>
					</div>
					<p
						style={{
							color:
								priceChange >= 0
									? "rgb(34, 197, 94)"
									: "rgb(239, 68, 68)"
						}}
						className={`text-lg font-semibold mt-2 ${priceChangeColor}`}
					>
						{priceChange >= 0 ? "+" : "-"}
						{Math.abs(priceChange).toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}{" "}
						({Math.abs(percentChange).toFixed(2)}%)
					</p>
				</div>

				{/* <NavLinks /> */}

				<div className='flex justify-between items-center mb-6'>
					<div className='flex space-x-3'>
						<button
							onClick={fullScreenHandle.enter}
							className='px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out flex items-center'
						>
							<svg
								className='w-4 h-4 mr-1'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4'
								/>
							</svg>
							Fullscreen
						</button>
						<button className='px-3 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out flex items-center'>
							<svg
								className='w-4 h-4 mr-1'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
								/>
							</svg>
							Compare
						</button>
					</div>
					<div className='flex space-x-1 text-sm'>
						{timeframes.map(timeframe => (
							<button
								key={timeframe}
								onClick={() => handleTimeframeChange(timeframe)}
								className={`px-3 py-1 rounded-md transition duration-150 ease-in-out ${
									timeframe === activeTimeframe
										? "bg-blue-600 text-white shadow-md"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
							>
								{timeframe}
							</button>
						))}
					</div>
				</div>

				<div className='h-80 w-full bg-gradient-to-b from-gray-50 to-white rounded-xl shadow-md p-4 border border-gray-100'>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart data={data}>
							<XAxis
								dataKey='date'
								tickFormatter={tick =>
									new Date(tick).toLocaleDateString()
								}
								interval={"preserveStartEnd"}
								axisLine={false}
								tickLine={false}
								tick={false}
							/>
							<YAxis
								domain={["auto", "auto"]}
								axisLine={false}
								tickLine={false}
								tick={false}
							/>
							<Tooltip
								contentStyle={{
									background: "rgba(255, 255, 255, 0.9)",
									border: "none",
									borderRadius: "8px",
									boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
									padding: "8px 12px"
								}}
								cursor={{ stroke: "#4F46E5", strokeWidth: 1 }}
							/>
							<Line
								type='monotone'
								dataKey='price'
								stroke='#4F46E5'
								strokeWidth={2}
								dot={false}
								activeDot={{
									r: 6,
									fill: "#4F46E5",
									stroke: "#fff",
									strokeWidth: 2
								}}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>
		</FullScreen>
  );
};

export default CryptoChart;