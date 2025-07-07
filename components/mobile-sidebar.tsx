"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MoveUpRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MobileSidebar = () => {
  const router = useRouter();
  return (
    <Sheet>
      <SheetTrigger className="fixed bottom-6 left-6 z-[200]" asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full border-1 cursor-pointer bg-[#A128FF] text-white hover:bg-[#A128FF]/90 hover:text-white md:hidden"
        >
          <MoveUpRight />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex w-7/12 flex-col p-0 md:hidden">
        <SheetTitle>
          <SheetClose>
            <Button variant="ghost" className="mt-3">
              <Image
                src="/cmwlogo.png"
                alt="logo"
                height={35}
                width={35}
                priority
              />
            </Button>
          </SheetClose>
        </SheetTitle>
        <div className="flex flex-col  gap-4">
          <Button
            variant="link"
            onClick={() => router.push("/home")}
            className="text-base flex md:hidden font-semibold cursor-pointer transition hover:no-underline"
          >
            Home
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/")}
            className="text-base flex md:hidden font-semibold cursor-pointer transition hover:no-underline"
          >
            Find Jobs
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/findtalents")}
            className="text-base flex md:hidden font-semibold cursor-pointer transition hover:no-underline"
          >
            Find Talents
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/aboutus")}
            className="text-base flex md:hidden font-semibold cursor-pointer transition hover:no-underline"
          >
            About us
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/testimonials")}
            className="text-base flex md:hidden font-semibold cursor-pointer transition hover:no-underline"
          >
            Testimonials
          </Button>
          <Button
            variant="link"
            onClick={() => router.push("/createjobs")}
            className="text-base text-white hover:no-underline w-fit mx-auto font-semibold rounded-full bg-linear-to-t to-[#A128FF] from-0% from-[#6100AD] to-100% cursor-pointer transition"
          >
            Create Jobs
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
