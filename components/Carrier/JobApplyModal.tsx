"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";

interface JobApplyModalProps {
  jobTitle: string;
  applyUrl: string;
  onClose: () => void;
}

const JobApplyModal: React.FC<JobApplyModalProps> = ({
  jobTitle,
  applyUrl,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_note: "",
  });
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResume(e.target.files?.[0] ?? null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resume) {
      toast.error("Please attach your resume.");
      return;
    }

    setIsSubmitting(true);

    const submission = new FormData();
    submission.append("full_name", formData.full_name);
    submission.append("email", formData.email);
    submission.append("phone", formData.phone);
    submission.append("cover_note", formData.cover_note);
    submission.append("resume", resume);

    try {
      const response = await fetch(applyUrl, {
        method: "POST",
        body: submission,
      });
      const result = await response.json();

      if (response.ok && result.status === "success") {
        toast.success(
          result.message || "Your application has been submitted successfully."
        );
        setFormData({ full_name: "", email: "", phone: "", cover_note: "" });
        setResume(null);
        onClose();
      } else {
        toast.error(result.message || "Failed to submit your application.");
      }
    } catch (err) {
      console.error("Error submitting job application:", err);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-[#334b35]">
              Apply for {jobTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          <div>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={formData.full_name}
              onChange={handleChange}
              className="block w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="block w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              required
            />
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              required
            />
          </div>
          <div>
            <textarea
              name="cover_note"
              placeholder="Cover Note"
              value={formData.cover_note}
              onChange={handleChange}
              rows={4}
              className="block w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#687469] mb-1">
              Resume
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-green-100 file:text-green-700 file:font-semibold hover:file:bg-green-200"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-gray-600 font-semibold hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold rounded-md transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobApplyModal;
