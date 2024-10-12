"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const OtpInput = () => {
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

  const handleChange = (e: { target: { value: string } }, index: number) => {
    const val = e.target.value;
    let updatedValues = [...otpValues];
    updatedValues[index] = val;
    setOtpValues(updatedValues);

    if (val.length === 1 && index < inputRefs.length - 1) {
      focusNextInput(index);
    } else if (val.length === 0 && index > 0) {
      focusPreviousInput(index);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPressed(true); // Set isPressed to true when submitting

    const otpInput = otpValues.join("");
    const getOtp = localStorage.getItem("otp");

    // Validate the OTP
    if (getOtp === otpInput) {
      toast.success("Validasi OTP Berhasil!", { autoClose: 2000 });
      setTimeout(() => {
        router.push("/validateFormData");
      }, 2000);
    } else {
      toast.error("OTP Tidak Valid!", { autoClose: 2000 });
    }

    setIsPressed(false); // Reset isPressed after validation
  };

  const handleOTP = async () => {
    try {
      const randomNumber = Math.floor(Math.random() * 900000) + 100000;
      localStorage.setItem("otp", randomNumber.toString());

      // Send OTP via API
      await axios.post(
        `https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/Verify?userAccount=${notelp}`,
        { randomNumber: randomNumber }
      );

      toast.success("OTP Berhasil terkirim", { autoClose: 2000 });

      // Start countdown
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
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
            Masukan kode OTP
          </h1>
          <p className="text-center text-sm text-zinc-500">
            Kode OTP akan dikirimkan melalui WA, periksa WA anda!
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
              className="mt-5 bg-gradient-to-tr from-blue-950 to-blue-700 text-white font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300"
              disabled={isPressed} // Disable button when pressed
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
                    Kirim ulang OTP!
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

export default OtpInput;
