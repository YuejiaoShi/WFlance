import Link from "next/link";

import { Monoton } from "next/font/google";
import Image from "next/image";

import logo from "@/public/logo.png";

const monoton = Monoton({
  subsets: ["latin"],
  display: "swap",
  weight: ["400"],
});

function Logo() {
  return (
    <Link
      href="/"
      className={`${monoton.className} flex items-center gap-2 z-10`}
    >
      <Image
        src={logo}
        height="60"
        width="60"
        quality={80}
        alt="WFlance"
        className="rounded-full"
      />
      <span className="text-5xl  text-primary-100">
        WFlance
      </span>
    </Link>
  );
}

export default Logo;
