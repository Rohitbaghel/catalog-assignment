"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useBitcoinData } from "../app/hooks/useBitcoin";

export const Crypto = () => {
  const { currentPrice, priceChange, percentChange } = useBitcoinData();
  const pathname = usePathname();

  // Format the percentage change, handling potential NaN values
  const formattedPercentChange = isNaN(percentChange) ? '0.00' : Math.abs(percentChange).toFixed(2);

  return (
    <div className='w-full max-w-4xl px-9 py-6'>
      <div className='mb-6'>
        <div className='flex items-start gap-x-2'>
          <h1 className='text-[56px] font-bold text-[#1E293B]'>{currentPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h1>
          <p className='text-[24px] font-normal text-[#64748B] mt-4'>USD</p>
        </div>
        <p
          style={{
            color:
              priceChange >= 0
                ? "rgb(34, 197, 94)"
                : "rgb(239, 68, 68)"
          }}
          className={`text-lg font-semibold mt-2`}
        >
          {priceChange >= 0 ? "+" : "-"}
          {Math.abs(priceChange).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}{" "}
          ({formattedPercentChange}%)
        </p>
      </div>
      <nav >
        <ul className='flex space-x-8'>
          {[
            { href: '/summary', label: 'Summary' },
            { href: '/', label: 'Chart' },
            { href: '/statistics', label: 'Statistics' },
            { href: '/analysis', label: 'Analysis' },
            { href: '/settings', label: 'Settings' }
          ].map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className={`text-[#64748B] hover:text-[#1E293B] pb-4 border-b-2 ${
                  pathname === href
                    ? 'border-[#4F46E5] text-[#1E293B] font-medium'
                    : 'border-transparent'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};