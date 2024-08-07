'use client'
import { useState, useRef, useEffect } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, Bar, ComposedChart } from 'recharts';
import { useBitcoinData } from "@/app/hooks/useBitcoin";

const CryptoChart = () => {
  const [activeTimeframe, setActiveTimeframe] = useState("7");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { bitcoinData, isLoading, error } = useBitcoinData(parseInt(activeTimeframe));
  const chartRef = useRef(null);

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
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const addGapsBetweenBars = (data: any) => {
    return data.flatMap((item: any, index: any) => [
      item,
      { ...item, volume: 0, isGap: true }
    ]);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;
  if (!bitcoinData) return null;

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
					{timeframes.map(({ label, value }) => (
						<button
							key={value}
							onClick={() => handleTimeframeChange(value)}
							className={`px-3 py-1 rounded-md transition duration-150 ease-in-out ${
								value === activeTimeframe
									? "bg-[#4F46E5] text-[#ffffff]"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							} focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:ring-opacity-50 ${
								isFullscreen ? "text-[#ffffff]" : ""
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			<div
				className={`${
					isFullscreen ? "h-[calc(100vh-120px)] bg-white" : "h-80"
				} w-full bg-white rounded-xl`}
			>
				<div className="chart-container relative">
					<ResponsiveContainer width="100%" height={400}>
						<ComposedChart
							data={addGapsBetweenBars(bitcoinData)}
							margin={{ top: 5, right: 30, left: -50, bottom: 5 }}
						>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis 
								dataKey="date" 
								axisLine={false}
								tickLine={false}
								tick={{ fill: 'transparent' }}
							/>
							<YAxis 
								yAxisId="left" 
								domain={["auto", "auto"]} 
								axisLine={false}
								tickLine={false}
								tick={{ fill: 'transparent' }}
							/>
							<YAxis 
								yAxisId="right" 
								orientation="right" 
								domain={[0, (dataMax: any) => dataMax * 2]} 
								axisLine={false}
								tickLine={false}
								tick={{ fill: 'transparent' }}
							/>
							<Tooltip
								contentStyle={{
									background: "rgba(255, 255, 255, 0.95)",
									border: "1px solid rgba(0, 0, 0, 0.1)",
									borderRadius: "8px",
									boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
									padding: "8px 12px"
								}}
								cursor={{ stroke: "#4F46E5", strokeWidth: 1 }}
								content={(props: any) => {
									const { payload, label } = props;
									if (payload && payload.length) {
										const priceData = payload.find((p: any) => p.dataKey === 'price');
										const volumeData = payload.find((p: any) => p.dataKey === 'volume');
										const date = new Date(label).toLocaleDateString();
										return (
											<div className="custom-tooltip bg-white bg-opacity-95 p-3 rounded-lg shadow-md border border-gray-200">
												<p className="text-sm text-gray-500 mb-1">{date}</p>
												{priceData && (
													<p className="text-lg font-bold text-[#4F46E5]">
														${priceData.value.toFixed(2)}
													</p>
												)}
												{volumeData && (
													<p className="text-sm text-gray-600">
														Volume: {volumeData.value.toLocaleString()}
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
								yAxisId='left'
								type='monotone'
								dataKey='price'
								stroke='#4F46E5'
								fillOpacity={0.1}
								fill='url(#colorPrice)'
							/>
							<Bar
								yAxisId='right'
								dataKey='volume'
								fill='#E6E8EB'
								opacity={0.5}
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