"use client";

import React, { useEffect, useState } from "react";
import { GiBullHorns } from "react-icons/gi";
import { FiMapPin, FiClock, FiCalendar } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HerosSectionCommon from "@/components/common/HerosSectionCommon";
import JobApplyModal from "@/components/Carrier/JobApplyModal";
import bannerImage from "../../public/farmerfieldimg.jpeg";

interface JobCompany {
  id: number;
  slug: string;
  name: string;
  tagline: string;
}

interface Job {
  reference_no: string;
  title: string;
  company: JobCompany;
  location: string;
  job_type: string;
  job_type_display: string;
  description: string;
  tags: string[];
  posted_at: string;
  deadline: string;
  status: string;
  is_open: boolean;
  apply_url: string;
}

interface JobsApiResponse {
  status: string;
  message: string;
  data: Job[];
}

const formatDate = (value: string) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CarrierPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/?company=insurecow&show=all`
        );
        const result: JobsApiResponse = await response.json();
        if (result.status === "success") {
          setJobs(result.data);
        } else {
          setError(result.message || "Failed to load job postings.");
        }
      } catch (err) {
        console.error("Error fetching job postings:", err);
        setError("Failed to load job postings.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="w-full">
      <HerosSectionCommon
        title="Join Our Team"
        description="Explore career opportunities and help us build financial resilience for smallholder farmers."
        bannerUrl={bannerImage.src}
      />

      <section className="w-full container mx-auto px-4 py-16 flex flex-col items-center space-y-10">
        <div className="max-w-4xl text-center">
          <div className="flex items-center justify-center">
            <GiBullHorns className="w-auto text-3xl text-green-700 mb-3 pl-2 pr-2" />
          </div>
          <span className="pl-2 pr-2 text-sm text-[#687469] uppercase font-semibold">
            Careers
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-[#334b35] mt-2 pl-2 pr-2 leading-8">
            Open Positions
          </h2>
        </div>

        {isLoading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading job postings...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-20">
            <p className="text-gray-600">{error}</p>
          </div>
        )}

        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600">
              There are no open positions at the moment. Please check back later.
            </p>
          </div>
        )}

        {!isLoading && !error && jobs.length > 0 && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job.reference_no}
                className="bg-white p-6 lg:p-8 rounded-lg shadow-md border border-gray-100 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[#334b35]">
                      {job.title}
                    </h3>
                    <span
                      className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${
                        job.is_open
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {job.is_open ? "Open" : "Closed"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">
                    {job.reference_no} &middot; {job.job_type_display}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <FiMapPin className="text-green-700" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiClock className="text-green-700" />
                      Posted {formatDate(job.posted_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiCalendar className="text-green-700" />
                      Deadline {formatDate(job.deadline)}
                    </span>
                  </div>

                  <div
                    className="text-gray-600 mb-4 [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_li]:mb-1 [&_strong]:text-[#334b35] [&_hr]:my-3 [&_hr]:border-gray-200"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />

                  {job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-3 py-1 rounded-full bg-[#F6F4EC] text-[#687469]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {job.is_open ? (
                  <button
                    type="button"
                    onClick={() => setSelectedJob(job)}
                    className="inline-block text-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors"
                  >
                    Apply Now
                  </button>
                ) : (
                  <span className="inline-block text-center px-4 py-2 bg-gray-200 text-gray-500 font-semibold rounded-md cursor-not-allowed">
                    Applications Closed
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {selectedJob && (
        <JobApplyModal
          jobTitle={selectedJob.title}
          applyUrl={selectedJob.apply_url}
          onClose={() => setSelectedJob(null)}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default CarrierPage;
