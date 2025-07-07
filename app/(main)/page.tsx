"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import JobCard from "@/components/job-card";
import { IJobOpening } from "@/models/JobOpenings";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [jobOpenings, setJobOpenings] = useState<IJobOpening[]>([]);

  useEffect(() => {
    const getJobOpenings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/job-openings");
        setJobOpenings(res.data);
      } catch (error) {
        console.error("Error fetching job openings:", error);
      } finally {
        setLoading(false);
      }
    };

    getJobOpenings();
  }, []);

  return (
    <>
      {loading && (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching for jobs...</p>
        </div>
      )}
      {jobOpenings.length > 0 && (
        <section className="m-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobOpenings.map((job) => (
            <JobCard key={job._id.toString()} job={job} />
          ))}
        </section>
      )}
    </>
  );
};

export default Home;
