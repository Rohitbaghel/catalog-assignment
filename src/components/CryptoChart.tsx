"use client";

import { useState } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
	Area
} from "recharts";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { useBitcoinData } from "@/app/hooks/useBitcoin";

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
			date: date.toISOString().split("T")[0], // Format as YYYY-MM-DD
			price: Math.max(0, price) // Ensure price doesn't go negative
		});
	}

	return data;
};

const CryptoChart = () => {
	const fullScreenHandle = useFullScreenHandle();
	const [activeTimeframe, setActiveTimeframe] = useState("1w");
	const { bitcoinData, isLoading, error, currentPrice } = useBitcoinData();

	const timeframes = ["1d", "3d", "1w", "1m", "6m", "1y", "max"];

	const handleTimeframeChange = (timeframe: string) => {
		setActiveTimeframe(timeframe);
	};

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error fetching data</div>;
	if (!bitcoinData) return null;

	const data = generateDummyData(currentPrice);

	return (
		<FullScreen handle={fullScreenHandle}>
			<div className='crypto-chart bg-white p-6 rounded-xl shadow-sm max-w-4xl mx-auto'>
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
										? "bg-[#4F46E5] text-white"
										: "bg-gray-100 text-gray-700 hover:bg-gray-200"
								} focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-opacity-50`}
							>
								{timeframe}
							</button>
						))}
					</div>
				</div>

				<div className='h-80 w-full bg-white rounded-xl'>
					<ResponsiveContainer width='100%' height='100%'>
						<LineChart
							data={data}
							margin={{ top: 5, right: 0, left: -40, bottom: 5 }}
						>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='#f0f0f0'
							/>
							<XAxis
								dataKey='date'
								tickFormatter={tick => new Date(tick).toLocaleDateString()}
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
								formatter={(value: number) => [`$${value.toFixed(0)}`, 'Price']}
								labelFormatter={(label) => new Date(label).toLocaleDateString()}
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
										stopOpacity={0.1}
									/>
									<stop
										offset='95%'
										stopColor='#4F46E5'
										stopOpacity={0.01}
									/>
								</linearGradient>
							</defs>
							<Area
								type='monotone'
								dataKey='price'
								stroke='none'
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
		</FullScreen>
	);
};

export default CryptoChart;