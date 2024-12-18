"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

// Define the type for signupInput
interface SignupInput {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  pin: string;
  province: string;
  city: string;

  gender: string;
  dateofBirth: string;
  minatKategori: string;
  error_list: string[]; // Explicitly define this as a string array
}

const Signup = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Initialize the state for signup input fields and errors
  const [signupInput, setSignupInput] = useState<SignupInput>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    pin: "",
    province: "",
    city: "",
    gender: "",
    dateofBirth: "",
    minatKategori: "-",
    error_list: [], // Initialize as an empty array of strings
  });

  // Clear localStorage when the component mounts
  useEffect(() => {
    localStorage.clear();
  }, []);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // Regex to disallow quotes (single and double) and percent signs
    const forbiddenChars = /['"%;:]/g;

    // Remove forbidden characters from the input value
    const sanitizedValue = value.replace(forbiddenChars, "");

    setSignupInput({ ...signupInput, [name]: sanitizedValue });
  };

  const clearErrorMessage = () => {
    setErrorMessage("");
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPressed(true);

    const data = { ...signupInput };
    const errors: string[] = []; // Array to hold validation errors

    // Validation checks for each required field
    if (!data.fullName) errors.push("Nama lengkap harus terisi.");
    if (!data.phone) errors.push("Nomor telepon harus terisi.");
    if (!data.email) errors.push("Email harus terisi.");

    // Password validation: must be exactly 6 digits
    if (!data.password) {
      errors.push("Kata sandi harus terisi.");
    }

    if (!data.pin) {
      errors.push("Nomor PIN harus terisi.");
    } else if (!/^\d{6}$/.test(data.pin)) {
      // Check if password is exactly 6 digits
      errors.push("Nomor PIN harus terdiri dari 6 digit angka.");
    }

    if (!data.province) errors.push("Provinsi harus terisi.");
    if (!data.city) errors.push("Kota harus terisi.");
    if (!data.gender) errors.push("Jenis gender harus terisi.");
    if (!data.dateofBirth) errors.push("Tanggal lahir harus terisi.");

    // If there are validation errors, set the error_list in state
    if (errors.length > 0) {
      setSignupInput({ ...signupInput, error_list: errors });
      setIsPressed(false);
    } else {
      try {
        const res = await axios.post(
          "https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/register",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data.responseCode === "2002500") {
          // const randomNumber = Math.floor(Math.random() * 900000) + 100000;
          // localStorage.setItem("otp", randomNumber.toString());

          // const response = await axios.post(
          //   `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/Verify?userAccount=${data.phone}`,
          //   { randomNumber }
          // );

          const response = await axios.post(
            `https://golangapi-j5iu.onrender.com/api/v1.0/member/mobile/dashboard/Verify?userAccount=${data.phone}`
          );

          if (response.data.responseCode === "2002500") {
            const { memberID } = response.data.loginData || {};
            localStorage.setItem("auth_memberID", memberID || "");
            toast.success(`OTP terkirim ke nomor ${data.phone}`, {
              autoClose: 2000,
            });
            router.push(`/otpregister/${data.phone}`);
          } else {
            toast.error("Terjadi kesalahan yang tidak terduga", {
              autoClose: 2000,
            });
          }
        } else {
          const message =
            res.data.responseMessage === "User Exists"
              ? "Nomor telepon atau email sudah digunakan!"
              : "Terjadi kesalahan saat mendaftarkan data!";
          toast.error(message, { autoClose: 2000 });
          setIsPressed(false);
        }
      } catch (error) {
        setErrorMessage(
          "Terjadi kesalahan saat mendaftarkan data. Silakan coba lagi."
        );
        setIsPressed(false);
      }
    }
  };

  // Fetch provinces when component mounts
  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await axios.get(
          "https://golangapi-j5iu.onrender.com/api/v2.0/member/mobile/provinces"
        );
        setProvince(response.data.provincesData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProvince();
  }, []);

  // Fetch cities when a province is selected
  useEffect(() => {
    if (signupInput.province) {
      axios
        .get(
          `https://golangapi-j5iu.onrender.com/api/v2.0/member/mobile/cities?provID=${signupInput.province}`
        )
        .then((response) => {
          setCity(response.data.citiesData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [signupInput.province]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md my-5">
          <form onSubmit={handleSignup}>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Daftar Member
            </h1>
            <div className="mb-2">
              <label htmlFor="fullName" className="label text-xs">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="fullName"
                placeholder="Johan Saputra"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.fullName}
                onChange={handleInput}
              />
              {/* Show error message for fullName if it exists */}
              {signupInput.error_list.includes(
                "Nama lengkap harus terisi."
              ) && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Nama lengkap harus terisi.
                </p>
              )}
            </div>

            {/* Input for phone */}
            <div className="mb-2">
              <label htmlFor="phone" className="label text-xs">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="08123456789"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.phone}
                onChange={handleInput}
              />
              {signupInput.error_list.includes(
                "Nomor telepon harus terisi."
              ) && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Nomor telepon harus terisi.
                </p>
              )}
            </div>

            {/* Input for email */}
            <div className="mb-2">
              <label htmlFor="email" className="label text-xs">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="example@mail.com"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.email}
                onChange={handleInput}
              />
              {signupInput.error_list.includes("Email harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Email harus terisi.
                </p>
              )}
            </div>

            {/* Input for dateofBirth */}
            <div className="mb-2">
              <label htmlFor="dateofBirth" className="label text-xs">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="dateofBirth"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.dateofBirth}
                onChange={handleInput}
              />
              {signupInput.error_list.includes(
                "Tanggal lahir harus terisi."
              ) && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Tanggal lahir harus terisi.
                </p>
              )}
            </div>

            {/* Dropdown for province */}
            <div className="mb-2">
              <label htmlFor="province" className="label text-xs">
                Provinsi
              </label>
              <select
                name="province"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.province}
                onChange={handleInput}
              >
                <option value="">Pilih provinsi</option>
                {province.map((prov: any) => (
                  <option key={prov.prov_id} value={prov.prov_id}>
                    {prov.prov_name}
                  </option>
                ))}
              </select>
              {signupInput.error_list.includes("province harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Provinsi harus terisi.
                </p>
              )}
            </div>

            {/* Dropdown for city */}
            <div className="mb-2">
              <label htmlFor="city" className="label text-xs">
                Kota
              </label>
              <select
                name="city"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.city}
                onChange={handleInput}
              >
                <option value="">Pilih kota</option>
                {city.map((c: any) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.city_name}
                  </option>
                ))}
              </select>
              {signupInput.error_list.includes("city harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Kota harus terisi.
                </p>
              )}
            </div>

            {/* Dropdown for gender */}
            <div className="mb-2">
              <label htmlFor="gender" className="label text-xs">
                Jenis kelamin
              </label>
              <select
                name="gender"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.gender}
                onChange={handleInput}
              >
                <option value="">Pilih Jenis Kelamin</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
              {signupInput.error_list.includes(
                "Jenis kelamin harus terisi."
              ) && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Jenis kelamin harus terisi.
                </p>
              )}
            </div>

            {/* Password field */}
            <div className="mb-2 relative">
              <label htmlFor="password" className="label text-xs">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="**********"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.password}
                onChange={handleInput}
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 pt-2 flex items-center text-gray-500 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <small className="label text-xs">Hide</small>
                ) : (
                  <small className="label text-xs">Show</small>
                )}
              </span>
              <small className="label text-xs text-zinc-500 italic mb-5">
                Digunakan untuk masuk akun member AMSCORP
              </small>
            </div>

            {/* PIN field */}
            <div className="mb-2 relative">
              <label htmlFor="pin" className="label text-xs">
                PIN {"(6 digit angka)"}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="pin"
                placeholder="******"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.pin}
                onChange={handleInput}
                maxLength={6} // Limit input length to 6 digits
                pattern="\d{6}" // Regex pattern to allow only 6 digits
                title="PIN must be 6 digits long and contain only numbers." // Tooltip for validation
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 pt-2 flex items-center text-gray-500 cursor-pointer"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <small className="label text-xs">Hide</small>
                ) : (
                  <small className="label text-xs">Show</small>
                )}
              </span>
              <small className="label text-xs text-zinc-500 italic mb-5">
                Digunakan untuk redeem saat transaksi
              </small>
            </div>

            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isPressed}
              className="mt-5 bg-blue-950 text-sm text-white font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300"
            >
              {isPressed ? "Processing..." : "Daftar"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Signup;
