"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import JobCard from "@/components/job-card";
import { IJobOpening } from "@/models/JobOpenings";

const Home = () => {
  const [jobOpenings, setJobOpenings] = useState<IJobOpening[]>([]);

  useEffect(() => {
    const getJobOpenings = async () => {
      try {
        const res = await axios.get("/api/job-openings");
        setJobOpenings(res.data);
      } catch (error) {
        console.error("Error fetching job openings:", error);
      }
    };

    getJobOpenings();
  }, []);

  return (
    <>
      {jobOpenings.length > 0 && (
        <div className="m-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobOpenings.map((job) => (
            <JobCard key={job._id.toString()} job={job} />
          ))}
        </div>
      )}
    </>
  );
};

export default Home;
