"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";

// Define the type for signupInput
interface SignupInput {
  namaLengkap: string;
  namaPanggilan: string;
  notelpon: string;
  email: string;
  password: string;
  pin: string;
  provinsi: string;
  kota: string;
  alamat: string;
  kelamin: string;
  tglLahir: string;
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
    namaLengkap: "",
    namaPanggilan: "",
    notelpon: "",
    email: "",
    password: "",
    pin: "",
    provinsi: "",
    kota: "",
    alamat: "",
    kelamin: "",
    tglLahir: "",
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
    setSignupInput({ ...signupInput, [e.target.name]: e.target.value });
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
    if (!data.namaLengkap) errors.push("Nama lengkap harus terisi.");
    if (!data.namaPanggilan) errors.push("Nama panggilan harus terisi.");
    if (!data.notelpon) errors.push("Nomor telepon harus terisi.");
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

    if (!data.provinsi) errors.push("Provinsi harus terisi.");
    if (!data.kota) errors.push("Kota harus terisi.");
    if (!data.alamat) errors.push("Alamat harus terisi.");
    if (!data.kelamin) errors.push("Jenis kelamin harus terisi.");
    if (!data.tglLahir) errors.push("Tanggal lahir harus terisi.");

    // If there are validation errors, set the error_list in state
    if (errors.length > 0) {
      setSignupInput({ ...signupInput, error_list: errors });
      setIsPressed(false);
    } else {
      try {
        // API request to register the user
        const res = await axios.post(
          "https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/register",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        if (res.data.responseMessage === "success") {
          const randomNumber = Math.floor(Math.random() * 900000) + 100000;
          localStorage.setItem("otp", randomNumber.toString());

          // API request to send OTP
          await axios.post(
            `https://golangapi-j5iu.onrender.com/api/member/mobile/dashboard/Verify?userAccount=${data.notelpon}`,
            { randomNumber }
          );

          // Store member ID in localStorage and navigate to OTP page
          localStorage.setItem("idMember", res.data.memberData.idMember);
          toast.success(`OTP terkirim ke nomor ${data.notelpon}`, {
            autoClose: 2000,
          });
          router.push(`/otpinput/${data.notelpon}`);
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
          "https://golangapi-j5iu.onrender.com/api/member/mobile/provinces"
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
    if (signupInput.provinsi) {
      axios
        .get(
          `https://golangapi-j5iu.onrender.com/api/member/mobile/cities?provID=${signupInput.provinsi}`
        )
        .then((response) => {
          setCity(response.data.citiesData);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [signupInput.provinsi]);

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md my-5">
          <form onSubmit={handleSignup}>
            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
              Daftar Member
            </h1>
            <div className="mb-2">
              <label htmlFor="fullname" className="label text-xs">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="namaLengkap"
                placeholder="Johan Saputra"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.namaLengkap}
                onChange={handleInput}
              />
              {/* Show error message for namaLengkap if it exists */}
              {signupInput.error_list.includes(
                "Nama lengkap harus terisi."
              ) && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Nama lengkap harus terisi.
                </p>
              )}
            </div>
            {/* Input for namaPanggilan */}
            <div className="mb-2">
              <label htmlFor="nickname" className="label text-xs">
                Nama Panggilan
              </label>
              <input
                type="text"
                name="namaPanggilan"
                placeholder="Johan"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.namaPanggilan}
                onChange={handleInput}
              />
              {signupInput.error_list.includes(
                "Nama panggilan harus terisi."
              ) && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Nama panggilan harus terisi.
                </p>
              )}
            </div>

            {/* Input for notelpon */}
            <div className="mb-2">
              <label htmlFor="notelpon" className="label text-xs">
                Nomor Telepon
              </label>
              <input
                type="tel"
                name="notelpon"
                placeholder="08123456789"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.notelpon}
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

            {/* Input for alamat */}
            <div className="mb-2">
              <label htmlFor="alamat" className="label text-xs">
                Alamat
              </label>
              <input
                type="text"
                name="alamat"
                placeholder="Jl. Kebon Jeruk No. 1"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.alamat}
                onChange={handleInput}
              />
              {signupInput.error_list.includes("Alamat harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Alamat harus terisi.
                </p>
              )}
            </div>

            {/* Input for tglLahir */}
            <div className="mb-2">
              <label htmlFor="tglLahir" className="label text-xs">
                Tanggal Lahir
              </label>
              <input
                type="date"
                name="tglLahir"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.tglLahir}
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

            {/* Dropdown for provinsi */}
            <div className="mb-2">
              <label htmlFor="provinsi" className="label text-xs">
                Provinsi
              </label>
              <select
                name="provinsi"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.provinsi}
                onChange={handleInput}
              >
                <option value="">Pilih Provinsi</option>
                {province.map((prov: any) => (
                  <option key={prov.prov_id} value={prov.prov_id}>
                    {prov.prov_name}
                  </option>
                ))}
              </select>
              {signupInput.error_list.includes("Provinsi harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Provinsi harus terisi.
                </p>
              )}
            </div>

            {/* Dropdown for kota */}
            <div className="mb-2">
              <label htmlFor="kota" className="label text-xs">
                Kota
              </label>
              <select
                name="kota"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.kota}
                onChange={handleInput}
              >
                <option value="">Pilih Kota</option>
                {city.map((c: any) => (
                  <option key={c.city_id} value={c.city_id}>
                    {c.city_name}
                  </option>
                ))}
              </select>
              {signupInput.error_list.includes("Kota harus terisi.") && (
                <p className="text-red-500 text-xs mt-1 ml-2">
                  Kota harus terisi.
                </p>
              )}
            </div>

            {/* Dropdown for kelamin */}
            <div className="mb-2">
              <label htmlFor="kelamin" className="label text-xs">
                Jenis Kelamin
              </label>
              <select
                name="kelamin"
                className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={signupInput.kelamin}
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
