import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { 
  FiBriefcase, 
  FiUser, 
  FiMail, 
  FiExternalLink,
  FiCalendar,
  FiFileText,
  FiSearch,
  FiFilter
} from "react-icons/fi";
import Swal from "sweetalert2";

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchApplications();
  }, [currentUser]);

  const fetchApplications = async () => {
    if (!currentUser?.email) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/my-applications/${currentUser.email}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error fetching applications:", error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load applications. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleViewLinkedIn = (linkedinUrl) => {
    if (linkedinUrl) {
      window.open(linkedinUrl, '_blank');
    }
  };

  const handleViewCoverLetter = (coverLetter, applicantName) => {
    if (coverLetter) {
      Swal.fire({
        title: `Cover Letter - ${applicantName}`,
        html: `<div class="text-left p-4 bg-gray-50 rounded-lg"><p class="whitespace-pre-wrap text-gray-700">${coverLetter}</p></div>`,
        confirmButtonColor: '#0ea5e9',
        customClass: {
          popup: 'rounded-2xl max-w-2xl',
          confirmButton: 'rounded-xl'
        }
      });
    } else {
      Swal.fire({
        title: 'No Cover Letter',
        text: 'This applicant did not submit a cover letter.',
        icon: 'info',
        confirmButtonColor: '#0ea5e9',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl'
        }
      });
    }
  };

  // Filter applications based on search term and selected job
  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicantEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesJob = selectedJob === "" || app.jobTitle === selectedJob;
    
    return matchesSearch && matchesJob;
  });

  // Get unique job titles for filter
  const uniqueJobs = [...new Set(applications.map(app => app.jobTitle))];

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-4 text-secondary-600 font-medium">Loading applications...</p>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <FiUser className="w-12 h-12 text-secondary-400" />
      </div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">
        No applications found
      </h3>
      <p className="text-secondary-600 mb-6">
        {applications.length === 0 
          ? "You haven't received any job applications yet." 
          : "No applications match your current filters."}
      </p>
      {applications.length === 0 && (
        <Link to="/post-job">
          <button className="btn btn-primary">
            Post a Job
          </button>
        </Link>
      )}
    </div>
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBriefcase className="w-12 h-12 text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-secondary-900 mb-2">
              Please log in to view applications
            </h3>
            <p className="text-secondary-600 mb-6">
              You need to be logged in to access job applications.
            </p>
            <Link to="/login">
              <button className="btn btn-primary">
                Go to Login
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mb-6">
            <FiUser className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
            Job Applications
          </h1>
          <p className="text-xl text-secondary-600">
            Manage applications for your posted jobs
          </p>
        </div>

        {/* Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by applicant name, email, or job title..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
            
            {/* Job Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 w-5 h-5" />
                <select
                  value={selectedJob}
                  onChange={(e) => setSelectedJob(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-secondary-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent appearance-none"
                >
                  <option value="">All Jobs</option>
                  {uniqueJobs.map((jobTitle, index) => (
                    <option key={index} value={jobTitle}>
                      {jobTitle}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="mt-4 flex items-center justify-between text-sm text-secondary-600">
            <span>
              Showing {filteredApplications.length} of {applications.length} applications
            </span>
            <span>
              {uniqueJobs.length} job{uniqueJobs.length !== 1 ? 's' : ''} with applications
            </span>
          </div>
        </div>

        {/* Applications List */}
        <div className="card">
          {isLoading ? (
            <LoadingSpinner />
          ) : filteredApplications.length > 0 ? (
            <div className="overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden lg:block">
                <table className="w-full">
                  <thead className="bg-secondary-50 border-b border-secondary-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Job Applied
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Applied Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    {filteredApplications.map((application, index) => (
                      <tr key={index} className="hover:bg-secondary-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mr-4">
                              <span className="text-white font-semibold text-sm">
                                {application.applicantName?.charAt(0).toUpperCase() || 'A'}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-secondary-900">
                                {application.applicantName || 'Anonymous'}
                              </div>
                              <div className="text-sm text-secondary-500 flex items-center">
                                <FiMail className="w-4 h-4 mr-1" />
                                {application.applicantEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-secondary-900">
                              {application.jobTitle}
                            </div>
                            <div className="text-sm text-secondary-500">
                              {application.companyName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-secondary-900 flex items-center">
                            <FiCalendar className="w-4 h-4 mr-2 text-secondary-400" />
                            {formatDate(application.appliedAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewLinkedIn(application.linkedinProfile)}
                              className="btn btn-secondary text-xs px-3 py-2 flex items-center space-x-1"
                            >
                              <FiExternalLink className="w-3 h-3" />
                              <span>LinkedIn</span>
                            </button>
                            <button
                              onClick={() => handleViewCoverLetter(application.coverLetter, application.applicantName)}
                              className="btn btn-secondary text-xs px-3 py-2 flex items-center space-x-1"
                            >
                              <FiFileText className="w-3 h-3" />
                              <span>Cover Letter</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredApplications.map((application, index) => (
                  <div key={index} className="bg-white border border-secondary-200 rounded-xl p-4 shadow-sm">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {application.applicantName?.charAt(0).toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-secondary-900 truncate">
                          {application.applicantName || 'Anonymous'}
                        </h3>
                        <p className="text-sm text-secondary-500 flex items-center">
                          <FiMail className="w-4 h-4 mr-1" />
                          {application.applicantEmail}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <FiBriefcase className="w-4 h-4 mr-2 text-secondary-400" />
                        <span className="font-medium">{application.jobTitle}</span>
                      </div>
                      <div className="flex items-center text-sm text-secondary-600">
                        <FiCalendar className="w-4 h-4 mr-2 text-secondary-400" />
                        {formatDate(application.appliedAt)}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewLinkedIn(application.linkedinProfile)}
                        className="btn btn-secondary text-xs px-3 py-2 flex items-center space-x-1 flex-1"
                      >
                        <FiExternalLink className="w-3 h-3" />
                        <span>LinkedIn</span>
                      </button>
                      <button
                        onClick={() => handleViewCoverLetter(application.coverLetter, application.applicantName)}
                        className="btn btn-secondary text-xs px-3 py-2 flex items-center space-x-1 flex-1"
                      >
                        <FiFileText className="w-3 h-3" />
                        <span>Cover Letter</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};

export default JobApplications;