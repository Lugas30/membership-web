"use client";
import React from "react";
import Link from "next/link";

const WelcomeMember = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2 text-center">
          Selamat!
        </h1>
        <p className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-6 text-center">
          Anda telah menjadi member.
        </p>
        <p className="text-sm text-gray-500 mb-6 px-2 text-center">
          Anda kini dapat menikmati semua keuntungan eksklusif kami.
          <br /> masuk akun untuk melihat point anda
        </p>

        <div className="text-center border p-6 space-y-6">
          <div className="space-y-2">
            <Link href="/signin">
              <button className=" bg-blue-600 text-white font-bold py-3 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-lg">
                Masuk Akun
              </button>
            </Link>
          </div>

          <div className="space-y-2">
            <Link href="/">
              <button className=" bg-blue-600 text-white font-bold py-3 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-lg">
                Ke halaman Awal
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMember;
