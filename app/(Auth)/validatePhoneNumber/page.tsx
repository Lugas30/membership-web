"use client";
import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

const ValidatePhoneNumber = () => {
  const router = useRouter();
  const [data, setData] = useState({
    userAccount: "",
  });
  const [isPressed, setIsPressed] = useState(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleValidation = async (e: any) => {
    e.preventDefault();
    setIsPressed(true); // Set loading state while processing

    const randomNumber = Math.floor(Math.random() * 900000) + 100000;
    localStorage.setItem("otp", randomNumber.toString());

    try {
      const response = await axios.post(
        `https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/Verify?userAccount=${data.userAccount}`,
        {
          randomNumber: randomNumber,
        }
      );

      console.log(response.data); // Logging respons untuk debugging

      if (response.data.responseCode === "4002500") {
        toast.error("Nomor Telepon Tidak Terdaftar", {
          autoClose: 2000,
        });
      } else if (response.data.responseCode === "2002500") {
        const { idMember, nama } = response.data.loginData;
        localStorage.setItem("auth_idMember", idMember);

        // console.log("Nama:", nama); // Jika ingin menampilkan nama
        // console.log("ID Member:", idMember); // Jika ingin menampilkan ID Member

        toast.success("Validasi Berhasil", {
          autoClose: 2000,
        });

        setTimeout(() => {
          router.push(`/otpinput/${data.userAccount}`);
          // router.push(`/otpinput`);
        }, 2000);
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga", {
          autoClose: 2000,
        });
      }
    } catch (error) {
      console.error("Error posting data:", error);
      toast.error("Terjadi kesalahan saat memvalidasi. Silakan coba lagi.", {
        autoClose: 2000,
      });
    } finally {
      setIsPressed(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <form onSubmit={handleValidation}>
            <h1 className="text-3xl font-bold mb-8 text-gray-800">
              Validasi Nomor
            </h1>
            <p className="text-xs text-gray-500 mb-10">
              Pastikan memasukan nomor yang telah terdaftar dan aktif. Kode OTP
              akan dikirimkan ke WhatsApp anda.
            </p>
            <div>
              <label
                htmlFor="userAccount"
                className="block text-sm font-medium text-gray-700"
              >
                Nomor telepon
              </label>
              <input
                type="text"
                id="Nomor telepon"
                name="userAccount"
                placeholder="08123xxxxxx"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
                value={data.userAccount}
                onChange={handleChange}
              />
            </div>
            <button
              disabled={isPressed}
              className="mt-5 bg-blue-950 text-white text-sm font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300"
            >
              {isPressed ? "Loading..." : "Validasi"}
            </button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default ValidatePhoneNumber;
