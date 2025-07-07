"use client";
import React, { useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { RiUserVoiceLine } from "react-icons/ri";
import { MapPin } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import qs from "query-string";
import { useDebounce } from "@/lib/useDebounce";
import { useRouter, useSearchParams } from "next/navigation";

const SearchFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState(searchParams.get("title") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [range, setRange] = useState<[number, number]>(() => {
    const minSal = searchParams.get("minSal");
    const maxSal = searchParams.get("maxSal");
    return [
      minSal ? Math.floor(Number(minSal) / 1000) : 0,
      maxSal ? Math.floor(Number(maxSal) / 1000) : 100,
    ];
  });

  const [isFirstRender, setIsFirstRender] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const debouncedTitle = useDebounce(title, 500);
  const debouncedLocation = useDebounce(location, 500);
  const debouncedRange = useDebounce(range, 500);

  useEffect(() => {
    const urlTitle = searchParams.get("title") || "";
    const urlLocation = searchParams.get("location") || "";
    const urlJobType = searchParams.get("jobType") || "";
    const urlMinSal = searchParams.get("minSal");
    const urlMaxSal = searchParams.get("maxSal");

    if (!title && urlTitle) setTitle(urlTitle);
    if (!location && urlLocation) setLocation(urlLocation);
    if (!jobType && urlJobType) setJobType(urlJobType);

    if ((urlMinSal || urlMaxSal) && range[0] === 0 && range[1] === 100) {
      setRange([
        urlMinSal ? Math.floor(Number(urlMinSal) / 1000) : 0,
        urlMaxSal ? Math.floor(Number(urlMaxSal) / 1000) : 100,
      ]);
    }

    setIsInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const sliderMoved = debouncedRange[0] !== 0 || debouncedRange[1] !== 100;

  const hasSearchInput =
    debouncedTitle || debouncedLocation || jobType || sliderMoved;

  const query = hasSearchInput
    ? qs.stringifyUrl({
        url: "/results",
        query: {
          title: debouncedTitle || undefined,
          location: debouncedLocation || undefined,
          jobType: jobType || undefined,
          minSal: sliderMoved ? debouncedRange[0] * 1000 : undefined,
          maxSal: sliderMoved ? debouncedRange[1] * 1000 : undefined,
        },
      })
    : null;

  useEffect(() => {
    if (isFirstRender || !isInitialized) {
      setIsFirstRender(false);
      return;
    }

    if (query) {
      router.replace(query);
    } else {
      router.replace("/");
    }
  }, [
    debouncedTitle,
    debouncedLocation,
    jobType,
    debouncedRange,
    router,
    isFirstRender,
    isInitialized,
    query,
  ]);

  return (
    <div className="mt-4 w-full items-end pb-2 shadow-md shadow-[#7F7F7F]/20">
      <div className="flex w-full flex-col items-center justify-between px-3 md:px-12 lg:flex-row">
        <div className="flex w-full items-center justify-center">
          <div className="relative flex flex-1 items-center p-2 md:p-4">
            <Input
              value={title}
              placeholder="Search by Job Title, Role"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-0 py-4 pr-3 pl-8 text-xs font-semibold shadow-none ring-0 placeholder:font-semibold focus-visible:ring-0 md:py-7 md:pr-8 md:pl-16 md:!text-base"
            />
            <IoSearchOutline
              className="pointer-events-none absolute left-4 text-gray-600 select-none md:left-7"
              size={20}
            />
          </div>
          <Separator orientation="vertical" className="!h-12 !w-[2px]" />
          <div className="relative flex flex-1 items-center p-2 md:p-4">
            <Input
              value={location}
              placeholder="Preferred Location"
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border-0 py-4 pr-3 pl-8 text-xs font-semibold shadow-none ring-0 placeholder:font-semibold focus-visible:ring-0 md:py-7 md:pr-8 md:pl-16 md:!text-base"
            />
            <MapPin
              className="pointer-events-none absolute left-4 text-gray-600 select-none md:left-7"
              size={20}
            />
          </div>
        </div>
        <Separator
          orientation="vertical"
          className="hidden !h-12 !w-[2px] lg:block"
        />
        <div className="flex w-full items-center justify-center">
          <div className="relative flex flex-1 items-center p-2 md:p-4">
            <Select
              value={jobType }
              onValueChange={(value) =>
                setJobType(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full border-0 py-4 pr-3 pl-8 text-xs !font-semibold shadow-none ring-0 focus-visible:ring-0 md:py-7 md:pr-8 md:pl-16 md:!text-base">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent className="[&_[data-slot=select-item]]:text-xs [&_[data-slot=select-item]]:focus:bg-[#A128FF]/10 [&_[data-slot=select-item]]:md:p-4 [&_[data-slot=select-item]]:md:text-base">
                <SelectItem value="all">All Experiences</SelectItem>
                <SelectItem value="Full-Time">Full-Time</SelectItem>
                <SelectItem value="Part-Time">Part-Time</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
              </SelectContent>
            </Select>
            <RiUserVoiceLine
              className="pointer-events-none absolute left-4 text-gray-600 select-none md:left-7"
              size={20}
            />
          </div>
          <Separator orientation="vertical" className="!h-12 !w-[2px]" />
          <div className="relative flex flex-1 flex-col items-center p-2 md:p-4">
            <div className="mb-7 flex w-full items-center justify-between text-xs font-medium md:text-base">
              <span>Salary Per Month</span>
              <span>
                ₹{range[0]}k&nbsp;-&nbsp;₹{range[1]}k
              </span>
            </div>

            <Slider
              value={range}
              onValueChange={(v) => setRange(v as [number, number])}
              min={0}
              max={100}
              step={1}
              className="w-full [&_[data-slot=slider-thumb]]:border-5 [&_[data-slot=slider-track]]:h-0.5 [&_[data-slot=slider-track]]:bg-gray-300"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
