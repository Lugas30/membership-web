import Image from "next/image";
import Link from "next/link";
import logo from "../public/ams_color.svg";
import logo1 from "../public/celcius.svg";
import logo2 from "../public/celcius_woman.svg";
import logo3 from "../public/mississippi.svg";
import logo4 from "../public/queensland.svg";
import maintain from "../public/website-maintenance.svg";

export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      {/* <div className="bg-white px-6 md:px-16 py-8 rounded-lg shadow-lg w-full max-w-md">
        <Image
          src={logo}
          alt="Logo"
          width={120}
          height={200}
          className="mx-auto"
        />

        <div className="py-6">
          <p className="text-2xl fontgeo text-center mb-5">Masuk akun</p>
          <p className="text-xs text-center mx-2 md:mx-0 text-gray-600">
            Terimakasih telah bergabung dalam loyalty program kami. Perbaharui
            data, klik "Validasi Member".
          </p>
          <Link href="/validatePhoneNumber">
            <button className="mt-5 text-xs uppercase tracking-widest bg-blue-950 text-white py-5 w-full hover:opacity-90 transition duration-300 shadow-lg">
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
              <button className="text-xs uppercase tracking-widest bg-zinc-400 text-black py-5 w-full hover:opacity-90 transition duration-300 shadow-lg">
                Masuk Akun
              </button>
            </Link>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-gray-500">Belum menjadi member?</span>
            <Link href="/signup">
              <button className="text-xs bg-zinc-100 uppercase tracking-wider py-5 w-full hover:opacity-90 transition duration-300 shadow-lg">
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
      </div> */}
      <div className="bg-white px-10 py-12 rounded-lg shadow-2xl w-full max-w-lg text-center space-y-8">
        <h1 className="text-3xl font-semibold text-blue-900">Sorry!</h1>
        <div>
          <Image
            src={maintain}
            alt="Logo"
            width={600}
            height={600}
            className="mx-auto"
          />
        </div>
        <p className="text-gray-500 text-xs">
          Saat ini website sedang dalam perbaikan. <br />
          Jika ingin mendaftar member, anda dapat mengunjungi store kami.
        </p>

        {/* <div className="flex items-center justify-center space-x-4">
          <button className="bg-blue-600 text-white py-2 px-4 rounded-full hover:bg-blue-700 transition duration-300">
            Kunjungi Store Kami
          </button>
        </div> */}

        <p className="text-xs text-gray-500 mt-4">
          Terima kasih atas kesabaran Anda!
        </p>

        <Image
          src={logo}
          alt="Logo"
          width={100}
          height={100}
          className="mx-auto"
        />
      </div>
    </div>
  );
}
