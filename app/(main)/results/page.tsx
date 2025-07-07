"use client";
import React, { useEffect, useState } from "react";
import qs from "query-string";
import { IJobOpening } from "@/models/JobOpenings";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import JobCard from "@/components/job-card";
import { Button } from "@/components/ui/button";

async function fetchJobs(searchParams: {
  title?: string;
  location?: string;
  jobType?: string;
  minSal?: string;
  maxSal?: string;
}) {
  try {
    const queryString = qs.stringify(
      {
        title: searchParams.title || undefined,
        location: searchParams.location || undefined,
        jobType: searchParams.jobType || undefined,
        minSal: searchParams.minSal || undefined,
        maxSal: searchParams.maxSal || undefined,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );

    console.log("API Query:", queryString);

    const response = await axios.get(`/api/jobsearch?${queryString}`);

    console.log(response.data.jobs);

    const data = response.data.jobs;
    return data || [];
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

const JobSearchResultsPage = () => {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<IJobOpening[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const title = searchParams.get("title") || "";
  const location = searchParams.get("location") || "";
  const jobType = searchParams.get("jobType") || "";
  const minSal = searchParams.get("minSal") || "";
  const maxSal = searchParams.get("maxSal") || "";

  const searchJobs = async () => {
    setLoading(true);
    setError(null);

    try {
      const jobResults = await fetchJobs({
        title,
        location,
        jobType,
        minSal,
        maxSal,
      });
      console.log(jobResults);
      setJobs(jobResults);
    } catch (err) {
      setError("Failed to fetch jobs. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasSearchParams = title || location || jobType || minSal || maxSal;

    if (hasSearchParams) {
      searchJobs();
    } else {
      setJobs([]);
      setLoading(false);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  return (
    <>
      {loading && (
        <div className="py-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Searching for jobs...</p>
        </div>
      )}

      {error && !loading && (
        <div className="py-16 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
              <svg
                className="h-12 w-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-red-900">Error</h3>
            <p className="mb-4 text-red-600">{error}</p>
            <button
              onClick={searchJobs}
              className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="m-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {jobs.map((job) => (
            <JobCard key={job._id.toString()} job={job} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && !error && jobs.length === 0 && (
        <div className="py-16 text-center">
          <div className="mx-auto max-w-md">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gray-200">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="mb-2 font-semibold text-gray-900 md:text-xl">
              No jobs found
            </h3>
            <p className="mb-4 text-sm text-gray-600 md:text-base">
              We couldn&apos;t find any jobs matching your search criteria.
            </p>
            <div className="  text-sm text-gray-500">
              <p>Try:</p>
              <ul className="mt-2 space-y-1">
                <li>• Removing some filters</li>
                <li>• Using different keywords</li>
                <li>• Checking your spelling</li>
                <li>• Expanding your location search</li>
              </ul>
            </div>
            <Button
              onClick={searchJobs}
              className="bg-btn-primary hover:bg-btn-primary/90 mt-4"
            >
              Refresh Search
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default JobSearchResultsPage;
