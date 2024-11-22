"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import logo from "../../public/ams_color.svg";

interface MemberInfoData {
  memberID: string;
  fullName: string;
  phone: string;
  points: number;
}

const Home = () => {
  const router = useRouter();
  const [memberData, setMemberData] = useState<MemberInfoData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const id = localStorage.getItem("auth_memberID");
    if (!id) {
      router.push("/");
      return;
    }

    const fetchMemberInfo = async () => {
      try {
        const response = await axios.get(
          `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/info?memberID=${id}`
        );
        const { memberID, fullName, phone, points } =
          response.data.memberInfoData;
        setMemberData({
          memberID,
          fullName,
          phone,
          points: points || 0,
        });
      } catch (error) {
        console.error("Error fetching member info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberInfo();
  }, [router]);

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 5) return phoneNumber;
    const formattedPhoneNumber = `${phoneNumber.slice(
      0,
      4
    )}-${phoneNumber.slice(4, 8)}`;
    return phoneNumberLength < 9
      ? formattedPhoneNumber
      : `${formattedPhoneNumber}-${phoneNumber.slice(8, 12)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen items-center">
        Loading...
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
        <Image
          src={logo}
          alt="Logo"
          width={120}
          height={200}
          className="mx-auto mb-10"
        />
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Hi, {memberData?.fullName}
        </h1>
        <small className="block text-center text-sm mb-4 text-gray-500">
          ID Member: {memberData?.memberID}
        </small>

        <hr></hr>

        <p className="text-center text-sm font-bold mt-4 mb-2 ">Poin Aktif</p>
        <span className="block text-center text-3xl font-bold text-blue-500">
          {memberData?.points}
        </span>

        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
          <small className="block text-gray-500 text-xs mb-1 text-center">
            Nomor Telepon Anda
          </small>
          <small className="block text-center text-sm text-gray-800">
            {formatPhoneNumber(memberData?.phone || "")}
          </small>
        </div>

        <button
          className="mt-6 w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors duration-300 focus:outline-none"
          onClick={handleLogout}
        >
          Keluar
        </button>
      </div>
    </div>
  );
};

export default Home;
