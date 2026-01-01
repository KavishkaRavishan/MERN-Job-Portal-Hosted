import React from "react";
import { Link } from "react-router-dom";
import { 
  FiCalendar, 
  FiClock, 
  FiDollarSign, 
  FiMapPin, 
  FiArrowRight,
  FiBookmark,
  FiTrendingUp,
  FiUsers
} from "react-icons/fi";

const Card = ({ data }) => {
  const {
    _id,
    companyName,
    companyLogo,
    jobTitle,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    employmentType,
    postingDate,
    description,
  } = data;
  
  // Helper function to format posting date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };
  
  // Get employment type color
  const getEmploymentTypeColor = (type) => {
    const colors = {
      'Full-time': 'bg-accent-100 text-accent-800 border-accent-200',
      'Part-time': 'bg-warning-100 text-warning-800 border-warning-200',
      'Contract': 'bg-primary-100 text-primary-800 border-primary-200',
      'Freelance': 'bg-secondary-100 text-secondary-800 border-secondary-200',
      'Remote': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return colors[type] || 'bg-secondary-100 text-secondary-800 border-secondary-200';
  };

  return (
    <article className="group relative">
      <Link
        to={`/job/${_id}`}
        className="block p-0 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-2xl"
      >
        <div className="card-gradient group-hover:shadow-glow-lg transition-all duration-300 p-6 h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              {/* Company Logo */}
              <div className="relative">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-secondary-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  {companyLogo ? (
                    <img 
                      src={companyLogo} 
                      alt={`${companyName} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {companyName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                {/* New job indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-500 rounded-full animate-pulse"></div>
              </div>
              
              {/* Company Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-secondary-600 mb-1 truncate">
                  {companyName}
                </h4>
                <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors duration-200 leading-tight">
                  {jobTitle}
                </h3>
              </div>
            </div>
            
            {/* Bookmark Button */}
            <button className="p-2 rounded-xl bg-secondary-50 hover:bg-secondary-100 transition-colors duration-200 opacity-0 group-hover:opacity-100">
              <FiBookmark className="w-4 h-4 text-secondary-600" />
            </button>
          </div>
          
          {/* Job Details */}
          <div className="space-y-3 mb-4">
            {/* Employment Type Badge */}
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getEmploymentTypeColor(employmentType)}`}>
                <FiClock className="w-3 h-3 mr-1" />
                {employmentType}
              </span>
              {salaryType === 'Remote' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  <FiTrendingUp className="w-3 h-3 mr-1" />
                  Remote
                </span>
              )}
            </div>
            
            {/* Location and Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center text-secondary-600">
                <FiMapPin className="w-4 h-4 mr-2 text-secondary-500" />
                <span className="truncate">{jobLocation}</span>
              </div>
              <div className="flex items-center text-secondary-600">
                <FiDollarSign className="w-4 h-4 mr-2 text-secondary-500" />
                <span className="font-medium text-secondary-900">
                  ${minPrice}k - ${maxPrice}k
                </span>
                <span className="text-xs text-secondary-500 ml-1">/{salaryType}</span>
              </div>
            </div>
            
            {/* Posting Date */}
            <div className="flex items-center text-sm text-secondary-500">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span>{formatDate(postingDate)}</span>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-secondary-700 text-sm leading-relaxed mb-6 line-clamp-3">
            {description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-secondary-200/50">
            <div className="flex items-center text-xs text-secondary-500">
              <FiUsers className="w-4 h-4 mr-1" />
              <span>25+ applicants</span>
            </div>
            
            <div className="flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700 transition-colors duration-200">
              <span className="mr-2">Apply Now</span>
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

export default Card;
