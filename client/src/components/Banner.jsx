import { useState } from "react";
import { FiSearch, FiBriefcase, FiUsers, FiStar, FiTrendingUp } from "react-icons/fi";

const Banner = ({ query, handleInputChange, handleSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleSearch) {
      handleSearch();
    }
  };
  
  const stats = [
    { icon: FiBriefcase, number: "10K+", label: "Active Jobs" },
    { icon: FiUsers, number: "50K+", label: "Happy Users" },
    { icon: FiStar, number: "4.9", label: "Rating" },
    { icon: FiTrendingUp, number: "95%", label: "Success Rate" },
  ];
  
  const popularSearches = [
    "Frontend Developer", "Product Manager", "UI/UX Designer", 
    "Data Scientist", "DevOps Engineer", "Marketing Specialist"
  ];
  
  return (
    <div className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Light Blue Background with Subtle Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Subtle decorative elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-20 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Heading */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Find Your
            <span className="block text-blue-600">Dream Job</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Connect with top companies and discover opportunities that match your skills and ambitions.
          </p>
        </div>

        {/* Search Form */}
        <div className="mb-16">
          <form className="max-w-4xl mx-auto" onSubmit={handleSubmit}>
            <div className="relative">
              <div className={`flex items-center bg-white rounded-2xl shadow-xl overflow-hidden border transition-all duration-300 ${
                isSearchFocused ? 'border-blue-400 shadow-2xl scale-105' : 'border-gray-200 hover:shadow-2xl'
              }`}>
                {/* Search Input */}
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="What position are you looking for?"
                    className="w-full pl-14 pr-6 py-5 text-lg bg-transparent border-0 focus:outline-none text-gray-800 placeholder-gray-500"
                    onChange={handleInputChange}
                    value={query}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
                
                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-5 font-semibold text-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Search Jobs
                </button>
              </div>
            </div>
          </form>
          
          {/* Popular Searches */}
          <div className="mt-8">
            <p className="text-gray-600 text-sm mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-700 text-sm rounded-full border border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 hover:scale-105 shadow-sm"
                  onClick={() => handleInputChange({ target: { value: search } })}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-100 hover:bg-white hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <div className="flex justify-center mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <stat.icon className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Banner;
