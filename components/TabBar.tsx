import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function TabBar() {
  return (
    <div className="flex justify-between items-center px-8 py-5 bg-white fixed bottom-0 w-full border-t-2 border-t-slate-300">
      <Link href={"/store"} className="flex flex-col items-center">
        <Image
          src="/images/store.svg"
          width={30}
          height={30}
          alt="toko"
          className="w-auto h-auto"
        />
        <span className="text-xs">Toko</span>
      </Link>
      <Link href={"/rewards"} className="flex flex-col items-center">
        <Image
          src="/images/rewards.svg"
          width={30}
          height={30}
          alt="reward"
          className="w-auto h-auto"
        />
        <span className="text-xs">Reward</span>
      </Link>
      <Link href={"/home"} className="flex flex-col items-center">
        <Image
          src="/images/home.svg"
          width={30}
          height={30}
          alt="home"
          className="w-auto h-auto"
        />
        <span className="text-xs">Beranda</span>
      </Link>
      <Link
        href={"/history-transaction"}
        className="flex flex-col items-center"
      >
        <Image
          src="/images/history.svg"
          width={30}
          height={30}
          alt="history"
          className="w-auto h-auto"
        />
        <span className="text-xs">Pesanan</span>
      </Link>
      <Link href={"/account"} className="flex flex-col items-center">
        <Image
          src="/images/account.svg"
          width={30}
          height={30}
          alt="akun"
          className="w-auto h-auto"
        />
        <span className="text-xs">Akun</span>
      </Link>
    </div>
  );
}