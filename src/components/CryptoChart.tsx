'use client'
import React, { useState, useRef, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area
} from 'recharts';
import { useBitcoinData } from "@/app/hooks/useBitcoin";
import { generateDummyData } from '@/app/generateDummyData'; // Ensure this import is correct

const CryptoChart = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("1w");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { bitcoinData, isLoading, error, currentPrice } = useBitcoinData();
  const chartRef = useRef(null);

  const timeframes = ["1d", "3d", "1w", "1m", "6m", "1y", "max"];

  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (chartRef.current && chartRef?.current as any) {
        const chartElement = chartRef.current as HTMLElement;
        chartElement.requestFullscreen().catch((err: Error) => {
					console.error(
						`Error attempting to enable full-screen mode: ${err.message}`
					);
				});
			}
		} else {
			document.exitFullscreen();
		}
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  if (!bitcoinData) return null;

  const data = generateDummyData(currentPrice);

  return (
		<div
			ref={chartRef}
			className={`crypto-chart bg-white p-6 rounded-xl shadow-sm ${
				isFullscreen ? "fixed inset-0 z-50" : "max-w-4xl mx-auto"
			}`}
		>
			<div className='flex justify-between items-center mb-6'>
				<div className='flex space-x-3'>
					<button
						onClick={toggleFullscreen}
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
						{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
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
								d='M12 6v6m0 0v6m0-6h6m-6 0H6'
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
									? "bg-[#4F46E5] text-[#ffffff]"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							} focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-opacity-50 ${isFullscreen ? "text-[#ffffff]" : ""}`}
						>
							{timeframe}
						</button>
					))}
				</div>
			</div>

			<div
				className={`${
					isFullscreen ? "h-[calc(100vh-120px)] bg-white" : "h-80"
				} w-full bg-white rounded-xl`}
			>
				<ResponsiveContainer width='100%' height='100%'>
					<LineChart
						data={data}
						margin={{ top: 5, right: 0, left: -40, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
						<XAxis
							dataKey='date'
							tickFormatter={tick =>
								new Date(tick).toLocaleDateString()
							}
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
								background: "white",
								border: "none",
								borderRadius: "8px",
								boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
								padding: "8px 12px"
							}}
							cursor={{ stroke: "#4F46E5", strokeWidth: 1 }}
							formatter={(value: number) => [
								`$${value.toFixed(0)}`,
								"Price"
							]}
							labelFormatter={label =>
								new Date(label).toLocaleDateString()
							}
						/>
						<defs>
							<linearGradient
								id='colorPrice'
								x1='0'
								y1='0'
								x2='0'
								y2='1'
							>
								<stop
									offset='5%'
									stopColor='#4F46E5'
									stopOpacity={0.8}
								/>
								<stop
									offset='95%'
									stopColor='#4F46E5'
									stopOpacity={0.1}
								/>
							</linearGradient>
						</defs>
						<Area
							type='monotone'
							dataKey='price'
							stroke='#4F46E5'
							fillOpacity={1}
							fill='url(#colorPrice)'
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
  );
};

export default CryptoChart;