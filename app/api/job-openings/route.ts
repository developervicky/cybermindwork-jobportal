import { connectDB } from "@/lib/mongoose";
import { JobOpening } from "@/models/JobOpenings";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const JobOpenings = await JobOpening.find({}).sort({ createdAt: -1 });

    if (!JobOpenings || JobOpenings.length === 0) {
      return new NextResponse("No job openings found", { status: 404 });
    }

    return new NextResponse(JSON.stringify(JobOpenings), {
      status: 200,
    });
  } catch (error) {
    console.log("JOB_OPENINGS_GET", error);
    return new NextResponse("[JOB_OPENINGS_GET]", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      companyLogo,
      jobTitle,
      companyName,
      location,
      jobType,
      minSalary,
      maxSalary,
      yearlySalary,
      experience,
      environment,
      applicationDeadline,
      description,
    } = await req.json();

    if (!jobTitle) {
      return new NextResponse("Job title is required", { status: 400 });
    }
    if (!companyName) {
      return new NextResponse("Company Name is required", { status: 400 });
    }
    if (!location) {
      return new NextResponse("Location is required", { status: 400 });
    }
    if (!jobType) {
      return new NextResponse("JobType is required", { status: 400 });
    }
    if (!minSalary) {
      return new NextResponse("minSalary is required", { status: 400 });
    }
    if (!maxSalary) {
      return new NextResponse("maxSalary is required", { status: 400 });
    }
    if (!experience) {
      return new NextResponse("Experience is required", { status: 400 });
    }
    if (!environment) {
      return new NextResponse("Environment is required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Description is required", { status: 400 });
    }

    const newJobOpening = {
      companyLogo,
      jobTitle,
      companyName,
      location,
      jobType,
      minSalary,
      maxSalary,
      yearlySalary,
      experience,
      environment,
      applicationDeadline: new Date(applicationDeadline),
      description,
    };

    await connectDB();

    const existingJob = await JobOpening.findOne({
      jobTitle,
      companyName,
      location,
    });

    if (existingJob) {
      return new NextResponse(
        "Job opening for this role, company, and location already exists",
        {
          status: 400,
        },
      );
    }

    await JobOpening.create(newJobOpening);

    return new NextResponse("Job opening created successfully", {
      status: 200,
    });
  } catch (error) {
    console.log("JOB_CREATION", error);
    return new NextResponse("[JOB_CREATION]", { status: 500 });
  }
}
