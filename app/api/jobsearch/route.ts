import { connectDB } from "@/lib/mongoose";
import { JobOpening } from "@/models/JobOpenings";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title");
    const location = searchParams.get("location");
    const jobType = searchParams.get("jobType");
    const minSal = searchParams.get("minSal");
    const maxSal = searchParams.get("maxSal");

    const query: Record<string, unknown> = {};

    if (title) {
      query.jobTitle = {
        $regex: title,
        $options: "i",
      };
    }

    if (location) {
      const locationWords = location
        .split(" ")
        .filter((word) => word.length > 0);

      if (locationWords.length > 0) {
        query.location = {
          $regex: locationWords.map((word) => `(?=.*${word})`).join(""),
          $options: "i",
        };
      }
    }

    if (jobType) {
      query.jobType = jobType;
    }
    if (minSal || maxSal) {
      query.maxSalary = {} as { $gte?: number; $lte?: number };

      if (minSal) {
        (query.maxSalary as { $gte?: number }).$gte = parseInt(minSal);
      }

      if (maxSal) {
        (query.maxSalary as { $lte?: number }).$lte = parseInt(maxSal);
      }
    }

    const jobs = await JobOpening.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      jobs,
    });
  } catch (error) {
    console.log("JOB_SEARCH", error);
    return new NextResponse("[JOB_SEARCH]", { status: 500 });
  }
}
