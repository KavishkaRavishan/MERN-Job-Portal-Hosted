import React, { useEffect, useState } from "react";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Jobs from "./Jobs";
import Sidebar from "../sidebar/Sidebar";
import { FiSearch, FiFilter } from "react-icons/fi";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentpage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    setIsLoading(true);
    fetch("/all-jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
        setIsLoading(false);
      });
  }, []);

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setCurrentpage(1); // Reset to first page when searching
  };

  const handleSearch = () => {
    setCurrentpage(1); // Reset to first page when searching
  };

  //filter jobs by title
  const filteredItems = jobs.filter(
    (job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );

  //-----Radio base filtering-----
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  //-----button based filtering-----
  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  //calculate the index range
  const caclulatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  //function for the next page
  const nextPage = () => {
    if (currentPage < Math.ceil(totalFilteredItems / itemsPerPage)) {
      setCurrentpage(currentPage + 1);
    }
  };

  //function for the previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentpage(currentPage - 1);
    }
  };

  //main function
  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;
    //filtering input items
    if (query) {
      filteredJobs = filteredJobs.filter(
        (job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }

    //category filtering (removed location filtering)
    if (selected) {
      filteredJobs = filteredJobs.filter(
        ({ maxPrice, salaryType, employmentType }) => {
          const matchesPrice = parseInt(maxPrice) <= parseInt(selected);
          const matchesSalaryType =
            salaryType.toLowerCase() === selected.toLowerCase();
          const matchesEmploymentType =
            employmentType.toLowerCase() === selected.toLowerCase();

          return (
            matchesPrice ||
            matchesSalaryType ||
            matchesEmploymentType
          );
        }
      );
    }
    //slice the data based on current page
    const { startIndex, endIndex } = caclulatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);
    return filteredJobs.map((data, i) => <Card key={i} data={data} />);
  };

  const result = filteredData(jobs, selectedCategory, query);
  
  // Calculate total filtered items for pagination
  const getTotalFilteredItems = () => {
    let filteredJobs = jobs;
    if (query) {
      filteredJobs = filteredJobs.filter(
        (job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1
      );
    }
    if (selectedCategory) {
      filteredJobs = filteredJobs.filter(
        ({ maxPrice, salaryType, employmentType }) => {
          const matchesPrice = parseInt(maxPrice) <= parseInt(selectedCategory);
          const matchesSalaryType =
            salaryType.toLowerCase() === selectedCategory.toLowerCase();
          const matchesEmploymentType =
            employmentType.toLowerCase() === selectedCategory.toLowerCase();
          return (
            matchesPrice ||
            matchesSalaryType ||
            matchesEmploymentType
          );
        }
      );
    }
    return filteredJobs.length;
  };
  
  const totalFilteredItems = getTotalFilteredItems();

  // Loading Spinner Component
  const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-accent-600 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="mt-4 text-secondary-600 font-medium">Finding amazing opportunities for you...</p>
    </div>
  );

  // Empty State Component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
        <FiSearch className="w-12 h-12 text-secondary-400" />
      </div>
      <h3 className="text-xl font-semibold text-secondary-900 mb-2">No jobs found</h3>
      <p className="text-secondary-600 text-center max-w-md">
        We couldn't find any jobs matching your criteria. Try adjusting your filters or search terms.
      </p>
      <button 
        onClick={() => {
          setQuery('');
          setSelectedCategory(null);
          setCurrentpage(1);
        }}
        className="btn btn-primary mt-4"
      >
        Clear Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen">
      <Banner query={query} handleInputChange={handleInputChange} handleSearch={handleSearch} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <FiFilter className="w-4 h-4" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:col-span-1`}>
            <div className="sidebar p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-secondary-900 mb-6">Filter Jobs</h2>
              <Sidebar handleChange={handleChange} handleClick={handleClick} />
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-white rounded-2xl shadow-soft border border-secondary-200/50 p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-900 mb-2">
                    {isLoading ? 'Loading...' : `${totalFilteredItems} Jobs Found`}
                  </h2>
                  {query && (
                    <p className="text-secondary-600">
                      Results for <span className="font-medium text-secondary-900">"{query}"</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Results */}
            <div className="bg-white rounded-2xl shadow-soft border border-secondary-200/50 p-6">
              {isLoading ? (
                <LoadingSpinner />
              ) : result.length > 0 ? (
                <div>
                  <div className="space-y-4">
                    <Jobs result={result} viewMode="list" />
                  </div>
                  
                  {/* Pagination */}
                  {result.length > 0 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-secondary-200">
                      <div className="text-sm text-secondary-600 mb-4 sm:mb-0">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalFilteredItems)} of {totalFilteredItems} results
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className="btn btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.ceil(totalFilteredItems / itemsPerPage) }, (_, i) => i + 1)
                            .filter(page => {
                              const totalPages = Math.ceil(totalFilteredItems / itemsPerPage);
                              return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                            })
                            .map((page, index, array) => (
                              <React.Fragment key={page}>
                                {index > 0 && array[index - 1] !== page - 1 && (
                                  <span className="px-2 text-secondary-400">...</span>
                                )}
                                <button
                                  onClick={() => setCurrentpage(page)}
                                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                    currentPage === page
                                      ? 'bg-primary-600 text-white'
                                      : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                                  }`}
                                >
                                  {page}
                                </button>
                              </React.Fragment>
                            ))
                          }
                        </div>
                        
                        <button
                          onClick={nextPage}
                          disabled={currentPage === Math.ceil(totalFilteredItems / itemsPerPage)}
                          className="btn btn-secondary px-4 py-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
