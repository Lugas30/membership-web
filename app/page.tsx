import Image from "next/image";
import Link from "next/link";
import logo from "../public/logo.png";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <Image
          src={logo}
          alt="Logo"
          width={200}
          height={200}
          className="mx-auto"
        />
        <h1 className="text-3xl font-extrabold text-center my-5 text-gray-800">
          <span className="text-blue-600 ">Validasi Member</span>
          <br></br>AMSCORP
        </h1>

        <div className="py-6">
          <p className="text-sm text-center text-gray-600">
            Untuk Validasi / Pembaharuan data member, pilih menu "Validasi"
          </p>
          <Link href="/validatePhoneNumber">
            <button className="mt-5 bg-gradient-to-tr from-blue-950 to-blue-700 text-white font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300">
              Validasi Member
            </button>
          </Link>
        </div>

        <div className="text-center border p-6 space-y-3">
          <div className="space-y-2">
            <span className="text-xs text-gray-500">
              Masuk akun untuk cek poin anda
            </span>
            <Link href="/signin">
              <button className=" bg-blue-600 text-white font-bold py-3 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-lg">
                Masuk Akun
              </button>
            </Link>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-gray-500">
              Belum pernah mendaftar?
            </span>
            <Link href="/signup">
              <button className=" bg-blue-600 text-white font-bold py-3 rounded-full w-full hover:bg-blue-700 transition duration-300 shadow-lg">
                Daftar Member
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
