"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";

// Define types for province and city data
interface Province {
  prov_id: string;
  prov_name: string;
}

interface City {
  city_id: string;
  city_name: string;
}

interface FormData {
  id_member: string;
  namaLengkap: string;
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
}

const ValidateFormData = () => {
  const router = useRouter();
  const idMember =
    typeof window !== "undefined"
      ? localStorage.getItem("auth_idMember")
      : null;

  if (typeof window !== "undefined" && idMember == null) {
    window.location.href = "/";
  }

  const [isPressed, setIsPressed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [province, setProvince] = useState<Province[]>([]);
  const [city, setCity] = useState<City[]>([]);
  const [data, setData] = useState<FormData>({
    id_member: "",
    namaLengkap: "",
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
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `https://golangapi-j5iu.onrender.com/api/member/mobile/profile?id_member=${idMember}`
        );
        const memberData = response.data.memberData;
        setData({
          ...data,
          id_member: idMember ?? "",
          namaLengkap: memberData.nama,
          notelpon: memberData.notelpon,
          email: memberData.email,
          provinsi: memberData.idProvinsi,
          kota: memberData.idKota,
          alamat: memberData.alamat,
          kelamin: memberData.jenisKelamin === "PRIA" ? "L" : "P",
          tglLahir: memberData.tanggalLahir,
          minatKategori: "-",
        });
        console.log(memberData);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    if (idMember) fetchProfile();
  }, [idMember]); // Add idMember as a dependency

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const response = await axios.get(
          "https://golangapi-j5iu.onrender.com/api/member/mobile/provinces"
        );
        setProvince(response.data.provincesData);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProvince();
  }, []);

  useEffect(() => {
    if (data.provinsi) {
      axios
        .get(
          `https://golangapi-j5iu.onrender.com/api/member/mobile/cities?provID=${data.provinsi}`
        )
        .then((response) => {
          setCity(response.data.citiesData);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [data.provinsi]);

  // const handleChange = (
  //   e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setData({ ...data, [name]: value });
  // };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // For password field, ensure it only accepts numbers and is 6 digits long
    if (name === "pin") {
      if (/^\d{0,6}$/.test(value)) {
        // Allow only numeric input and limit to 6 digits
        setData({ ...data, [name]: value });
      }
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validate input
    for (const key in data) {
      if ((data as any)[key] === "" || (data as any)[key] === null) {
        toast.error(`Field ${key} harus diisi!`, { autoClose: 2000 });
        return;
      }
    }

    const updatedData = { ...data };
    if (data.pin === "") {
      updatedData.pin;
    }

    if (data.password === "") {
      updatedData.password;
    }

    let url = "https://golangapi-j5iu.onrender.com/api/member/mobile/profile";
    axios({
      method: "PUT",
      url: url,
      data: updatedData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((response) => {
        if (response.data.responseCode === "2002500") {
          toast.success("Validasi Data Berhasil!", { autoClose: 2000 });
          setTimeout(() => {
            router.push("/home");
          }, 2000);
        } else {
          toast.error("Validasi Data Gagal!");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (loading) {
    return (
      <div className="flex justify-center min-h-screen items-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <div className="">
            <h1 className="text-2xl font-bold text-center mb-3">
              Validasi Data
            </h1>
            <p className="text-center italic text-xs text-gray-500 mb-5">
              Harap lengkapi data diri anda, pastikan data yang anda masukkan
              benar.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label htmlFor="fullname" className="label text-xs">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="namaLengkap"
                  placeholder="Johan Saputra"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.namaLengkap}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="phonenumber" className="label text-xs">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  name="notelpon"
                  placeholder="08123xxxxxx"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.notelpon}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-2">
                <label htmlFor="email" className="label text-xs">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  placeholder="Johan@gmail.com"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password field */}
              <div className="mb-2 relative">
                <label htmlFor="password" className="label text-xs">
                  Password{" "}
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="**********"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={handleChange}
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
                  type={showPassword ? "text" : "password"} // Change to 'text' for better control
                  name="pin"
                  placeholder="******"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.pin}
                  onChange={handleChange}
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

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="provinsi" className="label text-xs">
                    Provinsi
                  </label>
                  <select
                    name="provinsi"
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.provinsi}
                    onChange={handleChange}
                  >
                    <option>Pilih Provinsi</option>
                    {province.map((prov) => (
                      <option key={prov.prov_id} value={prov.prov_id}>
                        {prov.prov_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="kota" className="label text-xs">
                    Kota
                  </label>
                  <select
                    name="kota"
                    className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={data.kota}
                    onChange={handleChange}
                  >
                    <option>Pilih Kota</option>
                    {city.map((cit) => (
                      <option key={cit.city_id} value={cit.city_id}>
                        {cit.city_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-2">
                <label htmlFor="alamat" className="label text-xs">
                  Alamat Lengkap
                </label>
                <textarea
                  name="alamat"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.alamat}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-2">
                <label htmlFor="kelamin" className="label text-xs">
                  Jenis Kelamin
                </label>
                <select
                  name="kelamin"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.kelamin}
                  onChange={handleChange}
                >
                  <option value="l">Laki-Laki</option>
                  <option value="p">Perempuan</option>
                </select>
              </div>
              <div className="mb-2">
                <label htmlFor="tglLahir" className="label text-xs">
                  Tanggal Lahir
                </label>
                <input
                  type="date"
                  name="tglLahir"
                  className="mt-2 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={data.tglLahir}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-2">
                <button
                  disabled={isPressed}
                  className="mt-5 bg-gradient-to-tr from-blue-950 to-blue-700 text-white font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300"
                >
                  {isPressed ? "Loading..." : "Submit"}
                </button>
              </div>
              <ToastContainer />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ValidateFormData;
