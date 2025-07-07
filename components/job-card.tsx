import React from "react";
import { Card } from "./ui/card";
import Image from "next/image";
import timeAgo from "@/lib/timeAgo";
import { Layers, MapPin, Tags, UserPlus } from "lucide-react";
import { PiBuildingsBold } from "react-icons/pi";
import { Button } from "./ui/button";
import { IJobOpening } from "@/models/JobOpenings";
import { toast } from "sonner";

interface JobCardProps {
  job: IJobOpening;
}

const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card className="flex flex-col justify-between border-0 bg-white p-4 shadow-[#D3D3D3]/30">
      <div id="card-header" className="item flex justify-between">
        <div className="flex flex-row items-center gap-4">
          <div className="h-20 w-20 rounded-lg border-2 border-white bg-linear-to-t from-[#F1F1F1] to-[#FEFEFD] shadow-sm">
            {job.companyLogo && (
              <Image
                alt={job.companyName ?? ""}
                src={job.companyLogo}
                width={80}
                height={80}
                className="h-full w-full rounded-lg object-contain"
              />
            )}
            {!job.companyLogo && (
              <span className="flex h-full w-full items-center justify-center text-2xl font-semibold">
                {job.companyName?.charAt(0)}
              </span>
            )}
          </div>
          <h2 className="font-semibold">{job.companyName}</h2>
        </div>
        <div className="flex h-fit w-fit rounded-lg bg-[#B0D9FF] p-2">
          <span className="text-sm font-semibold">
            {timeAgo(job.createdAt)}
          </span>
        </div>
      </div>
      <div id="content">
        <h2 className="text-lg font-bold md:text-xl">{job.jobTitle}</h2>
        <div
          id="company-attributes"
          className="mt-2 grid grid-cols-3 gap-1 font-semibold text-gray-500"
        >
          <span className="flex items-center gap-1 text-sm xl:text-base">
            <UserPlus className="size-5" />
            {job.experience?.replace("Years", "yr")}
          </span>
          <span className="flex items-center gap-1 text-sm xl:text-base">
            <Tags className="size-5" />
            {job.jobType}
          </span>
          <span className="flex items-center gap-1 text-sm xl:text-base">
            <Layers className="size-5" />
            {String((job.maxSalary ?? 0) * 12).slice(0, 2)}LPA
          </span>
        </div>
        <div
          id="company-attributes"
          className="mt-3 grid grid-cols-2 gap-1 font-semibold text-gray-500"
        >
          <span className="flex items-center gap-1 text-sm xl:text-base">
            <MapPin className="size-5" />
            {job.location}
          </span>

          <span className="flex items-center gap-1 text-sm xl:text-base">
            <PiBuildingsBold className="size-5" />
            {job.environment}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-500">
          {(job.description ?? "").slice(0, 150)}...
        </p>
      </div>
      <div id="footer">
        <Button
          variant="default"
          onClick={() => {
            toast.success(
              "Hello Recruiter, After Joining Cybermind works the user flow will be continued 🙏",
            );
          }}
          className="bg-btn-primary hover:bg-btn-primary/90 w-full cursor-pointer py-[22px] text-base"
        >
          Apply Now
        </Button>
      </div>
    </Card>
  );
};

export default JobCard;
