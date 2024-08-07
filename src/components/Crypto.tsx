"use client";
import { usePathname } from 'next/navigation';
import { useBitcoinData } from "../app/hooks/useBitcoin";

export const Crypto = ({ timeframe }: { timeframe: string }) => {
  const { currentPrice, priceChange, percentChange, isLoading, error } = useBitcoinData(parseInt(timeframe));

  const pathname = usePathname();

 

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (currentPrice === undefined) {
    return <div>No data available</div>;
  }

  return (
		<div className='w-full max-w-4xl px-9 py-6'>
			<div className='mb-6'>
				<div className='flex items-start gap-x-2'>
					<h1 className='text-[70px] font-normal text-[#1E293B]'>
						{currentPrice.toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</h1>
					<p className='text-[24px] font-normal text-[#64748B] mt-6'>
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
					className={`text-lg font-normal mt-2`}
				>
					{priceChange >= 0 ? "+" : "-"}
					{Math.abs(priceChange).toLocaleString("en-US", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2
					})}{" "}
					(
					{percentChange !== undefined
						? Math.abs(percentChange).toFixed(2)
						: "0.00"}
					%)
				</p>
			</div>
			<nav>
				<ul className='flex space-x-8'>
					{[
						{ href: "/summary", label: "Summary" },
						{ href: "/", label: "Chart" },
						{ href: "/statistics", label: "Statistics" },
						{ href: "/analysis", label: "Analysis" },
						{ href: "/settings", label: "Settings" }
					].map(({ href, label }) => (
						<li key={href}>
							<div
								className={`text-[#6F7177] hover:text-[#1E293B] pb-4 border-b-2 text-[24px] font-normal ${
									pathname === href
										? "border-[#4F46E5] text-[#1A243A] "
										: "border-transparent "
								}`}
							>
								{label}
							</div>
						</li>
					))}
				</ul>
			</nav>
		</div>
  );
};