'use client'
import { useState, useRef, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Bar, ComposedChart } from 'recharts';
import { useBitcoinData } from "@/app/hooks/useBitcoin";

const CryptoChart = ({ 
  activeTimeframe, 
  setActiveTimeframe 
}: { 
  activeTimeframe: string, 
  setActiveTimeframe: (timeframe: string) => void 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { bitcoinData, isLoading, error } = useBitcoinData(parseInt(activeTimeframe));
	const chartRef = useRef(null);
	
	const processedData = bitcoinData.map((item, index) => ({
		...item,
		index
	}));

  const timeframes = [
    { label: "1d", value: "1" },
    { label: "7d", value: "7" },
    { label: "30d", value: "30" },
    { label: "90d", value: "90" },
    { label: "1y", value: "365" },
    { label: "max", value: "max" }
  ];
	

  const handleTimeframeChange = (timeframe: string) => {
    setActiveTimeframe(timeframe);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (chartRef.current && chartRef.current as any) {
        const chartElement = chartRef.current as HTMLElement & {
          requestFullscreen(): Promise<void>;
        };
        chartElement.requestFullscreen().catch((err: Error) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      }
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      if (document.fullscreenElement) {
        document.documentElement.style.setProperty('background-color', 'white', 'important');
      } else {
        document.documentElement.style.removeProperty('background-color');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.documentElement.style.removeProperty('background-color');
    };
  }, []);

  const addGapsBetweenBars = (data: any) => {
    return data.flatMap((item: any, index: any) => [
      item,
      { ...item, volume: 0, isGap: true }
    ]);
  };

   if (isLoading) {
		return (
			<div className='flex justify-center items-center h-[400px]'>
				<div className='animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500'></div>
			</div>
		);
   }
  if (error) return <div>Error fetching data</div>;
  if (!bitcoinData) return null;

  return (
		<div
			ref={chartRef}
			className={`crypto-chart bg-white p-6 rounded-xl shadow-sm fullscreen-bg-white ${
				isFullscreen
					? "fixed inset-0 z-50 w-screen h-screen"
					: "max-w-4xl mx-auto"
			}`}
		>
			<div
				className={`flex flex-col h-full ${
					isFullscreen ? "justify-between" : ""
				}`}
			>
				<div className='flex justify-between items-center mb-6'>
					<div className='flex space-x-3'>
						<button
							onClick={toggleFullscreen}
							className='px-3 py-2 text-[#6F7177] text-lg font-normal bg-gray-100 rounded-md hover:bg-gray-200 transition duration-150 ease-in-out flex items-center'
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
						<button className='px-3 py-2 bg-gray-100 text-[#6F7177] text-lg font-normal rounded-md hover:bg-gray-200 transition duration-150 ease-in-out flex items-center'>
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
						{timeframes.map(({ label, value }) => (
							<button
								key={value}
								onClick={() => handleTimeframeChange(value)}
								className={`px-3 py-1 rounded-md transition duration-150 ease-in-out  text-lg font-normal ${
									value === activeTimeframe
										? "bg-[#4F46E5] text-[#ffffff]"
										: "bg-gray-100 text-[#6F7177] hover:bg-gray-200"
								} focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-opacity-50 `}
							>
								{label}
							</button>
						))}
					</div>
				</div>

				<div
					className={`${
						isFullscreen ? "flex-grow" : "h-80"
					} w-full bg-white rounded-xl`}
				>
					<ResponsiveContainer width='100%' height='100%'>
						<ComposedChart
							data={addGapsBetweenBars(processedData)}
							margin={{
								top: 5,
								right: -50,
								left: -50,
								bottom: 5
							}}
						>
							<CartesianGrid strokeDasharray='3 3' />
							<XAxis
								dataKey='date'
								axisLine={false}
								tickLine={false}
								tick={{ fill: "transparent" }}
							/>
							<YAxis
								yAxisId='left'
								domain={["auto", "auto"]}
								axisLine={false}
								tickLine={false}
								tick={{ fill: "transparent" }}
							/>
							<YAxis
								yAxisId='right'
								orientation='right'
								domain={[0, (dataMax: any) => dataMax * 2]}
								axisLine={false}
								tickLine={false}
								tick={{ fill: "transparent" }}
							/>
							<Tooltip
								contentStyle={{
									background: "white",
									border: "1px solid rgba(0, 0, 0, 0.1)",
									borderRadius: "8px",
									boxShadow: "0 4px 6px rgba(0,0,0,1)",
									padding: "8px 12px"
								}}
								cursor={{ stroke: "#4F46E5", strokeWidth: 1 }}
								content={(props: any) => {
									const { payload, label } = props;
									if (payload && payload.length) {
										const currentPrice = payload.find(
											(p: any) => p.dataKey === "price"
										);
										const volumeData = payload.find(
											(p: any) => p.dataKey === "volume"
										);
										const date = new Date(
											label
										).toLocaleDateString();

										// Calculate price change
										const currentIndex =
											payload[0].payload.index;
										const previousPrice =
											currentIndex > 0
												? bitcoinData[currentIndex - 1]
														.price
												: currentPrice.value;
										const priceChange =
											currentPrice.value - previousPrice;
										const priceChangePercentage =
											(priceChange / previousPrice) * 100;

										return (
											<div
												className='custom-tooltip bg-white  p-3 rounded-lg shadow-md border border-gray-200'
												style={{
													background:
														"rgba(255, 255, 255, 0.95)"
												}}
											>
												<p className='text-sm font-normal text-gray-500 mb-1'>
													{date}
												</p>
												{currentPrice && (
													<>
														<p
															style={{
																color:
																	priceChange >=
																	0
																		? "rgb(34, 197, 94)"
																		: "rgb(239, 68, 68)"
															}}
															className={`text-lg font-normal`}
														>
															$
															{currentPrice.value.toFixed(
																2
															)}
														</p>
														<p
															style={{
																color:
																	priceChange >=
																	0
																		? "rgb(34, 197, 94)"
																		: "rgb(239, 68, 68)"
															}}
															className={`text-sm font-normal`}
														>
															{priceChange >= 0
																? "+"
																: ""}
															{priceChange.toFixed(
																2
															)}{" "}
															(
															{priceChangePercentage.toFixed(
																2
															)}
															%)
														</p>
													</>
												)}
												{volumeData && (
													<p className='text-sm text-gray-600 font-normal'>
														Volume:{" "}
														{volumeData.value.toLocaleString()}
													</p>
												)}
											</div>
										);
									}
									return null;
								}}
								labelFormatter={() => ""}
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
										offset='0%'
										stopColor='#4F46E5'
										stopOpacity={0.2}
									/>
									<stop
										offset='100%'
										stopColor='#4F46E5'
										stopOpacity={0.05}
									/>
								</linearGradient>
							</defs>
							<Area
								yAxisId='left'
								type='monotone'
								dataKey='price'
								stroke='#4F46E5'
								fillOpacity={1}
								fill='url(#colorPrice)'
							/>
							<Bar
								yAxisId='right'
								dataKey='volume'
								fill='#E6E8EB'
								opacity={1}
								barSize={4}
							/>
							<Line
								yAxisId='left'
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
						</ComposedChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
  );
};

export default CryptoChart;