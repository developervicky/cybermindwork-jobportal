"use client";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-hook";

const Navbar = () => {
  const router = useRouter();

  const { onOpen } = useModal();

  return (
    <>
      <nav className="flex w-full items-center justify-center">
        <div className="sticky top-0 z-50 mx-4 mt-5 flex w-full max-w-5xl items-center justify-between rounded-full bg-white px-4 py-3 shadow-md shadow-[#7F7F7F]/20 sm:p-5 sm:px-7">
          <Image
            onClick={() => (window.location.href = "/")}
            className="cursor-pointer"
            src="/cmwlogo.png"
            alt="logo"
            height={35}
            width={35}
            priority
          />
          <Button
            variant="link"
            onClick={() => router.push("/home")}
            className="hidden cursor-pointer text-base font-semibold transition hover:no-underline md:flex"
          >
            Home
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/")}
            className="hidden cursor-pointer text-base font-semibold transition hover:no-underline md:flex"
          >
            Find Jobs
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/findtalents")}
            className="hidden cursor-pointer text-base font-semibold transition hover:no-underline md:flex"
          >
            Find Talents
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/aboutus")}
            className="hidden cursor-pointer text-base font-semibold transition hover:no-underline md:flex"
          >
            About us
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/testimonials")}
            className="hidden cursor-pointer text-base font-semibold transition hover:no-underline md:flex"
          >
            Testimonials
          </Button>
          <Button
            variant="link"
            onClick={() => onOpen("createJobModal")}
            className="cursor-pointer rounded-full bg-linear-to-t from-[#6100AD] from-0% to-[#A128FF] to-100% text-sm font-semibold text-white transition hover:no-underline sm:text-base"
          >
            Create Jobs
          </Button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
