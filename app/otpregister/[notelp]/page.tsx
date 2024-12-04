"use client";
import React, { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const Otpregister = () => {
  const router = useRouter();
  const params = useParams();
  const notelp = params.notelp;

  const [isPressed, setIsPressed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isWaiting, setIsWaiting] = useState(false);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const inputRefs = [
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
    useRef<HTMLInputElement | null>(null),
  ];

  const focusNextInput = (index: number) => {
    if (index < inputRefs.length - 1 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const focusPreviousInput = (index: number) => {
    if (index > 0 && inputRefs[index - 1].current) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const val = e.target.value;
    const updatedValues = [...otpValues];
    updatedValues[index] = val;
    setOtpValues(updatedValues);

    if (val.length === 1 && index < inputRefs.length - 1) {
      focusNextInput(index);
    } else if (val.length === 0 && index > 0) {
      focusPreviousInput(index);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsPressed(true);

  //   const otpInput = otpValues.join("");
  //   const getOtp = localStorage.getItem("otp"); // Hapus ganti pake respon yang dari server heru

  //   if (getOtp === otpInput) {
  //     toast.success("Validasi OTP Berhasil!", { autoClose: 2000 });

  //     const memberID = localStorage.getItem("auth_memberID");
  //     if (memberID) {
  //       try {
  //         await axios.post(
  //           `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/validate?memberID=${memberID}`
  //         );
  //         toast.success("Member ID berhasil dikirim!", { autoClose: 2000 });
  //         setTimeout(() => {
  //           router.push("/home");
  //         }, 2000);
  //       } catch (error) {
  //         console.error(error);
  //         toast.error("Gagal mengirim Member ID!", { autoClose: 2000 });
  //       }
  //     } else {
  //       toast.error("Member ID tidak ditemukan!", { autoClose: 2000 });
  //     }
  //   } else {
  //     toast.error("OTP Tidak Valid!", { autoClose: 2000 });
  //   }

  //   setIsPressed(false);
  // };

  // Buat handelSubmit yang berfungsi mengirim no telp dan inputan OTP ke API dan bila respons berhasil maka akan diarahkan ke halaman home

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPressed(true);

    const otpInput = otpValues.join("");

    // Kirim otpInput dan notelp ke API jika responseCode === 2002500 maka diarahkan ke halaman home
    try {
      const response = await axios.post(
        `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/register/validate?userAccount=${notelp}&otp=${otpInput}`,
        {
          userAccount: notelp,
          otp: otpInput,
        }
      );

      if (response.data.responseCode === "2002500") {
        toast.success("Validasi OTP Berhasil!", { autoClose: 2000 });
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        toast.error("OTP Tidak Valid!", { autoClose: 2000 });
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim OTP!", { autoClose: 2000 });
    }

    setIsPressed(false);
  };

  // Diatas ini baru diupdate

  const handleOTP = async () => {
    try {
      // const randomNumber = Math.floor(Math.random() * 900000) + 100000;
      // localStorage.setItem("otp", randomNumber.toString());

      // await axios.post(
      //   `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/Verify?userAccount=${notelp}`,
      //   { randomNumber: randomNumber }
      // );

      await axios.post(
        `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/Verify?userAccount=${notelp}`
      );

      toast.success("OTP Berhasil terkirim", { autoClose: 2000 });

      setCountdown(30);
      setIsWaiting(true);

      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(timer);
            setIsWaiting(false);
            return null;
          }
          return prevCountdown ? prevCountdown - 1 : null;
        });
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengirim OTP, coba lagi!", { autoClose: 2000 });
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="font-bold text-center mb-8 text-gray-800">
            Anda belum menyelesaikan proses register.
          </h1>
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Masukan kode OTP
          </h2>
          <p className="text-center text-xs text-zinc-500">
            Kode OTP akan dikirimkan melalui WA.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="flex justify-center my-5">
              {inputRefs.map((ref, index) => (
                <input
                  key={index}
                  ref={ref}
                  type="tel"
                  maxLength={1}
                  value={otpValues[index]}
                  className="border-2 rounded-md border-gray-200 text-center w-10 mx-2 p-2 max-w-screen mt-2 focus:outline-none focus:border-primary"
                  onChange={(e) => handleChange(e, index)}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
              ))}
            </div>

            <button
              type="submit"
              className="mt-5 bg-blue-950 text-sm text-white font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300"
              disabled={isPressed}
            >
              {isPressed ? "Memvalidasi OTP..." : "Kirim"}
            </button>

            <div className="text-center text-xs mt-4">
              <p>
                Tidak menerima kode OTP?{" "}
                {isWaiting ? (
                  <span className="text-gray-500">
                    Kirim ulang dalam {countdown} detik
                  </span>
                ) : (
                  <span
                    onClick={handleOTP}
                    className="text-blue-500 cursor-pointer"
                  >
                    Kirim ulang OTP.
                  </span>
                )}
              </p>
            </div>
          </form>
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default Otpregister;
