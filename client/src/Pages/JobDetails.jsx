import React from "react";
import { useLoaderData, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../contexts/AuthContext";
import { 
  FiBriefcase, 
  FiMapPin, 
  FiDollarSign, 
  FiClock, 
  FiUser, 
  FiCalendar,
  FiArrowRight,
  FiShare2,
  FiBookmark
} from "react-icons/fi";

const JobDetails = () => {
  const { id } = useParams();
  const job = useLoaderData();
  const { currentUser } = useAuth();

  const handleApply = async () => {
    // Check if user is logged in
    if (!currentUser) {
      await Swal.fire({
        title: 'Login Required',
        text: 'You need to be logged in to apply for jobs.',
        icon: 'warning',
        confirmButtonColor: '#0ea5e9',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl'
        }
      });
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Apply for this position',
      html: `
        <div class="space-y-4 text-left">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">LinkedIn Profile URL *</label>
            <input id="linkedin-url" class="swal2-input" placeholder="https://linkedin.com/in/your-profile" style="margin: 0; width: 100%;">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Cover Letter (Optional)</label>
            <textarea id="cover-letter" class="swal2-textarea" placeholder="Tell us why you're the perfect fit for this role..." style="margin: 0; width: 100%; min-height: 100px;"></textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Submit Application',
      confirmButtonColor: '#0ea5e9',
      cancelButtonColor: '#64748b',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      },
      preConfirm: () => {
        const linkedinUrl = document.getElementById('linkedin-url').value;
        const coverLetter = document.getElementById('cover-letter').value;
        
        if (!linkedinUrl) {
          Swal.showValidationMessage('LinkedIn profile URL is required');
          return false;
        }
        
        // Basic URL validation
        if (!linkedinUrl.includes('linkedin.com')) {
          Swal.showValidationMessage('Please enter a valid LinkedIn profile URL');
          return false;
        }
        
        return { linkedinUrl, coverLetter };
      }
    });
    
    if (formValues) {
      try {
        // Show loading state
        Swal.fire({
          title: 'Submitting Application...',
          text: 'Please wait while we process your application',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
          customClass: {
            popup: 'rounded-2xl'
          }
        });
        
        const applicationData = {
          jobId: id,
          jobTitle: job.jobTitle,
          companyName: job.companyName,
          applicantEmail: currentUser.email,
          applicantName: currentUser.displayName || currentUser.email,
          linkedinProfile: formValues.linkedinUrl,
          coverLetter: formValues.coverLetter || '',
          jobPostedBy: job.postedBy
        };
        
        const response = await fetch("/apply-job", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(applicationData),
        });
        
        const result = await response.json();
        
        if (result.status) {
          await Swal.fire({
            title: 'Application Submitted!',
            text: 'Your application has been submitted successfully. The employer will review it and get back to you soon.',
            icon: 'success',
            confirmButtonColor: '#10b981',
            customClass: {
              popup: 'rounded-2xl',
              confirmButton: 'rounded-xl'
            }
          });
        } else {
          await Swal.fire({
            title: 'Application Failed',
            text: result.message || 'Failed to submit application. Please try again.',
            icon: 'error',
            confirmButtonColor: '#ef4444',
            customClass: {
              popup: 'rounded-2xl',
              confirmButton: 'rounded-xl'
            }
          });
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        await Swal.fire({
          title: 'Error',
          text: 'An error occurred while submitting your application. Please try again.',
          icon: 'error',
          confirmButtonColor: '#ef4444',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl'
          }
        });
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job.jobTitle,
        text: `Check out this job opportunity at ${job.companyName}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        title: 'Link Copied!',
        text: 'Job link has been copied to clipboard',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: 'rounded-2xl'
        }
      });
    }
  };

  const handleBookmark = () => {
    Swal.fire({
      title: 'Job Bookmarked!',
      text: 'This job has been saved to your bookmarks',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false,
      customClass: {
        popup: 'rounded-2xl'
      }
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="card-gradient p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Job Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-4 mb-4">
                {job.companyLogo ? (
                  <img 
                    src={job.companyLogo} 
                    alt={`${job.companyName} logo`}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <FiBriefcase className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-display font-bold text-secondary-900 mb-2">
                    {job.jobTitle}
                  </h1>
                  <p className="text-lg text-secondary-600 flex items-center">
                    <FiBriefcase className="w-5 h-5 mr-2" />
                    {job.companyName}
                  </p>
                </div>
              </div>
              
              {/* Job Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-secondary-700">
                  <FiMapPin className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{job.jobLocation}</span>
                </div>
                <div className="flex items-center text-secondary-700">
                  <FiClock className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{job.employmentType}</span>
                </div>
                <div className="flex items-center text-secondary-700">
                  <FiDollarSign className="w-5 h-5 mr-2 text-primary-600" />
                  <span>${job.minPrice}k - ${job.maxPrice}k</span>
                </div>
                <div className="flex items-center text-secondary-700">
                  <FiUser className="w-5 h-5 mr-2 text-primary-600" />
                  <span>{job.postedBy}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
              <button
                onClick={handleApply}
                className="btn btn-primary px-6 py-3 flex items-center justify-center space-x-2"
              >
                <span>Apply Now</span>
                <FiArrowRight className="w-4 h-4" />
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleBookmark}
                  className="btn btn-secondary p-3 flex items-center justify-center"
                >
                  <FiBookmark className="w-4 h-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="btn btn-secondary p-3 flex items-center justify-center"
                >
                  <FiShare2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <FiBriefcase className="w-6 h-6 mr-3 text-primary-600" />
                Job Description
              </h2>
              <div className="prose prose-secondary max-w-none">
                <p className="text-secondary-700 leading-relaxed text-lg">
                  {job.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Requirements
              </h2>
              <ul className="space-y-3 text-secondary-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Bachelor&apos;s degree in relevant field or equivalent experience</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Proven experience in the role</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Strong communication and teamwork skills</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <span>Ability to work in a fast-paced environment</span>
                </li>
              </ul>
            </div>

            {/* Application Instructions */}
            <div className="card p-8 bg-gradient-to-r from-primary-50 to-accent-50 border-primary-200">
              <h3 className="text-xl font-bold text-secondary-900 mb-4">
                How to Apply
              </h3>
              <p className="text-secondary-700 mb-4">
                To apply for this position, please click the &quot;Apply Now&quot; button and submit your LinkedIn profile URL. 
                Our team will review your application and get back to you within 3-5 business days.
              </p>
              <div className="flex items-center text-sm text-secondary-600">
                <FiCalendar className="w-4 h-4 mr-2" />
                <span>Applications close in 14 days</span>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Summary */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">
                Job Summary
              </h3>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-secondary-600">Salary Range</dt>
                  <dd className="text-lg font-semibold text-secondary-900">
                    ${job.minPrice}k - ${job.maxPrice}k {job.salaryType}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-secondary-600">Employment Type</dt>
                  <dd className="text-secondary-900">{job.employmentType}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-secondary-600">Location</dt>
                  <dd className="text-secondary-900">{job.jobLocation}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-secondary-600">Posted By</dt>
                  <dd className="text-secondary-900">{job.postedBy}</dd>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">
                About {job.companyName}
              </h3>
              <p className="text-secondary-700 text-sm leading-relaxed">
                Learn more about {job.companyName} and discover why thousands of professionals 
                choose to build their careers with us. We offer competitive benefits, 
                growth opportunities, and a collaborative work environment.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-bold text-secondary-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button className="w-full btn btn-secondary text-left flex items-center justify-between">
                  <span>View Similar Jobs</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
                <button className="w-full btn btn-secondary text-left flex items-center justify-between">
                  <span>Company Profile</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
                <button className="w-full btn btn-secondary text-left flex items-center justify-between">
                  <span>Set Job Alert</span>
                  <FiArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
