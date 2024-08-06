import Link from "next/link";
import CryptoChart from "@/components/CryptoChart";

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <CryptoChart />
    </main>
  );
}