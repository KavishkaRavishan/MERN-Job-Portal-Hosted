import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiSearch, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiBriefcase,
  FiMapPin,
  FiDollarSign
} from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [allJobs, setAllJobs] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    fetch(`/myJobs/${currentUser.email}`)
      .then((res) => res.json())
      .then((data) => {
        setJobs(data || []);
        setAllJobs(data || []);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setJobs([]);
        setAllJobs([]);
        setIsLoading(false);
      });
  }, [currentUser]);

  const handleSearch = () => {
    const filter = allJobs.filter(
      (job) =>
        job.jobTitle.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
    setJobs(filter);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setJobs(allJobs);
  };

  const handleDelete = (id, jobTitle) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to delete "${jobTitle}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl',
        cancelButton: 'rounded-xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`/job/${id}`, {
          method: "DELETE",
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.acknowledged === true) {
              const updatedJobs = jobs.filter((job) => job._id !== id);
              setJobs(updatedJobs);
              setAllJobs(updatedJobs);
              Swal.fire({
                title: 'Deleted!',
                text: 'Job has been deleted successfully.',
                icon: 'success',
                confirmButtonColor: '#10b981',
                customClass: {
                  popup: 'rounded-2xl',
                  confirmButton: 'rounded-xl'
                }
              });
            }
          })
          .catch((error) => {
            console.error("Error deleting job:", error);
            Swal.fire({
              title: 'Error!',
              text: 'There was an error deleting the job.',
              icon: 'error',
              confirmButtonColor: '#ef4444',
              customClass: {
                popup: 'rounded-2xl',
                confirmButton: 'rounded-xl'
              }
            });
          });
      }
    });
  };

  // Loading Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-4 text-secondary-600 font-medium">Loading your jobs...</p>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-secondary-900 flex items-center">
                <FiBriefcase className="w-8 h-8 mr-3 text-primary-600" />
                My Jobs
              </h1>
              <p className="text-lg text-secondary-600 mt-2">
                {currentUser ? (
                  <>
                    Welcome back, <span className="font-medium text-secondary-900">{currentUser.displayName || currentUser.email}</span>! 
                    {!isLoading && (
                      <span className="block sm:inline">
                        {allJobs.length === 0 
                          ? "Ready to post your first job?" 
                          : `You have ${allJobs.length} job${allJobs.length === 1 ? '' : 's'} posted.`
                        }
                      </span>
                    )}
                  </>
                ) : (
                  'Manage and track your job postings'
                )}
              </p>
            </div>
            <Link to="/post-job">
              <button className="btn btn-primary flex items-center space-x-2">
                <FiPlus className="w-4 h-4" />
                <span>Post New Job</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-secondary-400" />
              </div>
              <input
                type="text"
                placeholder="Search jobs by title..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="input pl-10 pr-4"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="btn btn-primary px-6"
              >
                Search
              </button>
              {searchText && (
                <button
                  onClick={handleClearSearch}
                  className="btn btn-secondary"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="card">
          {!currentUser ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-12 h-12 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Please log in to view your jobs
              </h3>
              <p className="text-secondary-600 mb-6">
                You need to be logged in to access your job postings.
              </p>
              <Link to="/login">
                <button className="btn btn-primary">
                  Go to Login
                </button>
              </Link>
            </div>
          ) : isLoading ? (
            <LoadingSpinner />
          ) : jobs.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-hidden">
                <table className="w-full">
                  <thead className="bg-secondary-50 border-b border-secondary-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                        Job Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-secondary-600 uppercase tracking-wider">
                        Salary
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-secondary-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    {jobs.map((job, index) => (
                      <tr key={job._id} className="hover:bg-secondary-50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                              <FiBriefcase className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-secondary-900">
                                {job.jobTitle}
                              </div>
                              <div className="text-sm text-secondary-500">
                                {job.employmentType}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiBriefcase className="w-4 h-4 text-secondary-400 mr-2" />
                            <span className="text-sm text-secondary-900">{job.companyName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiMapPin className="w-4 h-4 text-secondary-400 mr-2" />
                            <span className="text-sm text-secondary-900">{job.jobLocation}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <FiDollarSign className="w-4 h-4 text-secondary-400 mr-2" />
                            <span className="text-sm font-medium text-secondary-900">
                              ${job.minPrice}k - ${job.maxPrice}k
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link to={`edit-job/${job._id}`}>
                              <button className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200">
                                <FiEdit3 className="w-4 h-4" />
                              </button>
                            </Link>
                            <button 
                              onClick={() => handleDelete(job._id, job.jobTitle)}
                              className="p-2 text-secondary-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden p-4 space-y-4">
                {jobs.map((job, index) => (
                  <div key={job._id} className="bg-secondary-50 rounded-xl p-4 border border-secondary-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mr-3">
                          <FiBriefcase className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-secondary-900">{job.jobTitle}</h3>
                          <p className="text-sm text-secondary-600">{job.companyName}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link to={`edit-job/${job._id}`}>
                          <button className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-white rounded-lg transition-colors duration-200">
                            <FiEdit3 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(job._id, job.jobTitle)}
                          className="p-2 text-secondary-600 hover:text-red-600 hover:bg-white rounded-lg transition-colors duration-200"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-secondary-600">
                        <FiMapPin className="w-4 h-4 mr-2" />
                        {job.jobLocation}
                      </div>
                      <div className="flex items-center text-secondary-600">
                        <FiDollarSign className="w-4 h-4 mr-2" />
                        ${job.minPrice}k - ${job.maxPrice}k
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Results Summary */}
              <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-200">
                <p className="text-sm text-secondary-600">
                  Showing {jobs.length} of {allJobs.length} jobs
                  {searchText && (
                    <span> matching "{searchText}"</span>
                  )}
                </p>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiBriefcase className="w-12 h-12 text-secondary-400" />
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                {searchText ? 'No jobs found' : 'No jobs posted yet'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {searchText 
                  ? `No jobs match your search for "${searchText}"`
                  : 'Start by posting your first job to attract talented candidates.'
                }
              </p>
              {searchText ? (
                <button 
                  onClick={handleClearSearch}
                  className="btn btn-secondary"
                >
                  Clear Search
                </button>
              ) : (
                <Link to="/post-job">
                  <button className="btn btn-primary flex items-center space-x-2 mx-auto">
                    <FiPlus className="w-4 h-4" />
                    <span>Post Your First Job</span>
                  </button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyJobs;
