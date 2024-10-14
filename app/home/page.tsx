"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import logo from "../../public/logo.png";

interface ProfileData {
  id_member: string;
  namaLengkap: string;
  namaPanggilan: string;
  notelpon: string;
  email: string;
  provinsi: string;
  kota: string;
  alamat: string;
  kelamin: string;
  tglLahir: string;
  minatKategori: string;
}

const Home = () => {
  const router = useRouter();
  const [idMember, setIdMember] = useState<string | null>(null);

  const [dataProfile, setDataProfile] = useState<ProfileData>({
    id_member: "",
    namaLengkap: "",
    namaPanggilan: "",
    notelpon: "",
    email: "",
    provinsi: "",
    kota: "",
    alamat: "",
    kelamin: "",
    tglLahir: "",
    minatKategori: "-",
  });

  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // This effect will run on the client side to set the idMember from localStorage
  useEffect(() => {
    const id = localStorage.getItem("auth_idMember");
    if (id) {
      setIdMember(id);
    } else {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    if (!idMember) return;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://golangapi-j5iu.onrender.com/api/member/mobile/profile?id_member=${idMember}`
        );
        const memberData = response.data.memberData;
        setDataProfile({
          ...dataProfile,
          id_member: idMember,
          namaLengkap: memberData.nama,
          namaPanggilan: memberData.namaPanggilan,
          notelpon: memberData.notelpon,
          email: memberData.email,
          provinsi: memberData.idProvinsi,
          kota: memberData.idKota,
          alamat: memberData.alamat,
          kelamin: memberData.jenisKelamin === "PRIA" ? "l" : "p",
          tglLahir: memberData.tanggalLahir,
          minatKategori: "-",
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPoints = async () => {
      try {
        const response = await axios.get(
          `https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/info?id_member=${idMember}`
        );
        setPoints(response.data.memberInfoData.sisaPoint || 0);
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };

    fetchProfile();
    fetchPoints();
  }, [idMember]);

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;

    const phoneNumber = value.replace(/[^\d]/g, "");
    const phoneNumberLength = phoneNumber.length;

    if (phoneNumberLength < 5) return phoneNumber;

    const formattedPhoneNumber = `${phoneNumber.slice(
      0,
      4
    )}-${phoneNumber.slice(4, 8)}`;

    if (phoneNumberLength < 9) return formattedPhoneNumber;

    return `${formattedPhoneNumber}-${phoneNumber.slice(8, 12)}`;
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
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition duration-500 hover:scale-105">
          <Image
            src={logo}
            alt="Logo"
            width={200}
            height={200}
            className="mx-auto mb-10"
          />
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Hi, {dataProfile.namaLengkap}
          </h1>
          <small className="block text-center text-sm mb-4 text-gray-500">
            ID Member: {dataProfile.id_member}
          </small>

          <hr></hr>

          <p className="text-center text-lg mt-4">Point Anda Saat Ini:</p>
          <span className="block text-center text-3xl font-bold text-indigo-500">
            {points} Point
          </span>

          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
            <small className="block text-gray-500 text-xs mb-1 text-center">
              Nomor Telepon Anda
            </small>
            <small className="block text-center text-sm text-gray-800">
              {formatPhoneNumber(dataProfile.notelpon)}
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
    </>
  );
};

export default Home;
