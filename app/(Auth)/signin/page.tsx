"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { log } from "console";

interface LoginInput {
  user: string;
  password: string;
  error_list: string[];
}

const Signin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginInput, setLogin] = useState<LoginInput>({
    user: "",
    password: "",
    error_list: [],
  });

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage("");
    setLogin({ ...loginInput, [e.target.name]: e.target.value });
  };

  const loginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPressed(true);

    const data = { user: loginInput.user, password: loginInput.password };
    let errors = [];
    if (!data.user) errors.push("Pengguna harus terisi.");
    if (!data.password) errors.push("Kata sandi harus terisi.");

    if (errors.length > 0) {
      setLogin({ ...loginInput, error_list: errors });
      setIsPressed(false);
      return;
    }

    try {
      const res = await axios.post(
        "https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/login",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data.responseCode === "2002500") {
        localStorage.setItem("auth_memberID", res.data.loginData.memberID);
        localStorage.setItem("auth_fullName", res.data.loginData.fullName);
        toast.success("Login berhasil!", { autoClose: 2000 });
        setTimeout(() => router.push("/home"), 2000);
      } else if (res.data.responseCode === "4002500") {
        toast.error("User atau password salah!", { autoClose: 2000 });
      } else if (res.data.responseCode === "4002501") {
        //Tampilkan OTP
        // const randomNumber = Math.floor(Math.random() * 900000) + 100000;
        // localStorage.setItem("otp", randomNumber.toString());

        //kirim otp ke API post
        // const response = await axios.post(
        //   `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/Verify?userAccount=${loginInput.user}`,
        //   {
        //     randomNumber: randomNumber,
        //   }
        // );

        const response = await axios.post(
          `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/Verify?userAccount=${loginInput.user}`
        );

        // console.log(response.data); // Logging response for debugging

        if (response.data.responseCode === "4002500") {
          toast.error("Nomor Telepon Tidak Terdaftar", {
            autoClose: 2000,
          });
        } else if (response.data.responseCode === "2002500") {
          const { memberID } = response.data.loginData;
          localStorage.setItem("auth_memberID", memberID);

          toast.success("Validasi Berhasil, OTP dikirim!", {
            autoClose: 2000,
          });

          setTimeout(() => {
            router.push(`/otpregister/${loginInput.user}`);
          }, 2000);
        } else {
          toast.error("Terjadi kesalahan yang tidak terduga", {
            autoClose: 2000,
          });
        }
      } else {
        setErrorMessage(res.data.responseMessage || "Terjadi kesalahan.");
      }
    } catch (error) {
      console.error("Error during login request:", error);
      toast.error(
        "Terjadi kesalahan saat melakukan masuk. Silakan coba lagi.",
        { autoClose: 3000 }
      );
    } finally {
      setIsPressed(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Masuk ke akun Member
          </h1>
          <form onSubmit={loginSubmit}>
            <div className="mb-2">
              <label htmlFor="user" className="label text-xs">
                Nomor telepon
              </label>
              <input
                type="text"
                placeholder="08123xxxxxx"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="user"
                onChange={handleInput}
                value={loginInput.user}
              />
              {loginInput.error_list.includes("Pengguna harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Telpon / Email harus terisi.
                </p>
              )}
            </div>
            <div className="mb-2 relative">
              <label htmlFor="password" className="label text-xs">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="******"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleInput}
                value={loginInput.password}
              />
              {loginInput.error_list.includes("Kata sandi harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Password harus terisi.
                </p>
              )}
              <span
                className="absolute inset-y-0 top-10 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                )}
              </span>
            </div>
            <button
              className="mt-6 bg-blue-950 text-sm text-white hover:opacity-90 font-bold py-3 rounded-lg w-full transition duration-300"
              disabled={isPressed}
            >
              {isPressed ? "Loading..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signin;
