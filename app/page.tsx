import Image from "next/image";
import Link from "next/link";
import logo from "../public/ams_color.svg";
import logo1 from "../public/celcius.svg";
import logo2 from "../public/celcius_woman.svg";
import logo3 from "../public/mississippi.svg";
import logo4 from "../public/queensland.svg";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="bg-white px-6 md:px-16 py-8 rounded-lg shadow-lg w-full max-w-md">
        <Image
          src={logo}
          alt="Logo"
          width={120}
          height={200}
          className="mx-auto"
        />

        <div className="py-6">
          <p className="text-xs text-center mx-2 md:mx-0 text-gray-600">
            Terimakasih telah bergabung dalam loyalty program kami. Perbaharui
            data, klik "Validasi Member".
          </p>
          <Link href="/validatePhoneNumber">
            {/* <button className="mt-5 text-sm bg-gradient-to-tr from-blue-950 to-blue-700 text-white font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300 shadow-lg">
              Validasi Member
            </button> */}
            <button className="mt-5 text-sm bg-blue-950 text-white font-bold py-5 rounded-lg w-full hover:opacity-90 transition duration-300 shadow-lg">
              Validasi Member
            </button>
          </Link>
        </div>

        <div className="text-center border p-6 space-y-3">
          <div className="space-y-2">
            <span className="text-xs text-gray-500">
              Masuk akun untuk cek poin.
            </span>
            <Link href="/signin">
              <button className="text-sm bg-zinc-400 text-white font-bold py-3 rounded-lg w-full hover:opacity-90 transition duration-300 shadow-lg">
                Masuk Akun
              </button>
            </Link>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-gray-500">Belum menjadi member?</span>
            <Link href="/signup">
              <button className="text-sm bg-blue-500 text-white font-bold py-3 rounded-lg w-full hover:opacity-90 transition duration-300 shadow-lg">
                Daftar Member
              </button>
            </Link>
          </div>
        </div>
        <div className="flex justify-between mt-5">
          <Image src={logo1} alt="Logo" width={75} height={200} />
          <Image src={logo2} alt="Logo" width={75} height={200} />
          <Image src={logo3} alt="Logo" width={75} height={200} />
          <Image src={logo4} alt="Logo" width={75} height={200} />
        </div>
      </div>
    </div>
  );
}
