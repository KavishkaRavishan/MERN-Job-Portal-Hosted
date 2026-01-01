import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import CreatableSelect from "react-select/creatable";
import { 
  FiBriefcase, 
  FiDollarSign, 
  FiMapPin, 
  FiUser,
  FiFileText,
  FiSave,
  FiAlertCircle,
  FiEdit3
} from "react-icons/fi";
import Swal from "sweetalert2";

const UpdateJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    _id,
    companyName,
    experienceLevel,
    companyLogo,
    jobTitle,
    minPrice,
    maxPrice,
    salaryType,
    jobLocation,
    employmentType,
    postingDate,
    description,
    postedBy,
    skills,
  } = useLoaderData();

  const [selectedOption, setSelectedOption] = useState(skills);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    data.skills = selectedOption
      ? selectedOption.map((option) => option.value || option)
      : [];
    
    try {
      const response = await fetch(`/update-job/${id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (result.acknowledged === true) {
        await Swal.fire({
          title: 'Updated!',
          text: 'Job updated successfully!',
          icon: 'success',
          confirmButtonColor: '#10b981',
          customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'rounded-xl'
          }
        });
        // Redirect to My Jobs page
        navigate('/my-job');
      }
    } catch (error) {
      console.error("Error updating job:", error);
      await Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the job. Please try again.',
        icon: 'error',
        confirmButtonColor: '#ef4444',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const options = [
    { value: "JavaScript", label: "JavaScript" },
    { value: "C++", label: "C++" },
    { value: "HTML", label: "HTML" },
    { value: "CSS", label: "CSS" },
    { value: "React", label: "React" },
    { value: "Node", label: "Node" },
    { value: "MongoDB", label: "MongoDB" },
    { value: "Redux", label: "Redux" },
    { value: "Python", label: "Python" },
    { value: "Java", label: "Java" },
    { value: "TypeScript", label: "TypeScript" },
    { value: "Vue", label: "Vue" },
  ];

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #d1d5db',
      borderRadius: '0.75rem',
      padding: '0.5rem',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#0ea5e9'
      }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0f2fe',
      borderRadius: '0.5rem'
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#0369a1'
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#0369a1',
      '&:hover': {
        backgroundColor: '#0ea5e9',
        color: 'white'
      }
    })
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl flex items-center justify-center mb-6">
            <FiEdit3 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-display font-bold text-secondary-900 mb-4">
            Update Job
          </h1>
          <p className="text-xl text-secondary-600">
            Modify job details to attract the right candidates
          </p>
        </div>

        {/* Form */}
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <FiBriefcase className="w-6 h-6 mr-3 text-primary-600" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    defaultValue={jobTitle}
                    {...register("jobTitle", { required: "Job title is required" })}
                    className={`input ${errors.jobTitle ? 'border-red-500' : ''}`}
                  />
                  {errors.jobTitle && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.jobTitle.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    defaultValue={companyName}
                    {...register("companyName", { required: "Company name is required" })}
                    className={`input ${errors.companyName ? 'border-red-500' : ''}`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.companyName.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <FiDollarSign className="w-6 h-6 mr-3 text-primary-600" />
                Salary Information
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Minimum Salary *
                  </label>
                  <input
                    type="number"
                    defaultValue={minPrice}
                    {...register("minPrice", { required: "Minimum salary is required" })}
                    className={`input ${errors.minPrice ? 'border-red-500' : ''}`}
                  />
                  {errors.minPrice && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.minPrice.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Maximum Salary *
                  </label>
                  <input
                    type="number"
                    defaultValue={maxPrice}
                    {...register("maxPrice", { required: "Maximum salary is required" })}
                    className={`input ${errors.maxPrice ? 'border-red-500' : ''}`}
                  />
                  {errors.maxPrice && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.maxPrice.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Salary Type *
                  </label>
                  <select 
                    {...register("salaryType", { required: "Salary type is required" })} 
                    className={`input ${errors.salaryType ? 'border-red-500' : ''}`}
                    defaultValue={salaryType}
                  >
                    <option value="Hourly">Hourly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                  {errors.salaryType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.salaryType.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Location & Date */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <FiMapPin className="w-6 h-6 mr-3 text-primary-600" />
                Location & Timeline
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Job Location *
                  </label>
                  <input
                    type="text"
                    defaultValue={jobLocation}
                    {...register("jobLocation", { required: "Job location is required" })}
                    className={`input ${errors.jobLocation ? 'border-red-500' : ''}`}
                  />
                  {errors.jobLocation && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.jobLocation.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Job Posting Date *
                  </label>
                  <input
                    type="date"
                    defaultValue={postingDate}
                    {...register("postingDate", { required: "Posting date is required" })}
                    className={`input ${errors.postingDate ? 'border-red-500' : ''}`}
                  />
                  {errors.postingDate && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.postingDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Job Details */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <FiUser className="w-6 h-6 mr-3 text-primary-600" />
                Job Details
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Experience Level *
                  </label>
                  <select
                    {...register("experienceLevel", { required: "Experience level is required" })}
                    className={`input ${errors.experienceLevel ? 'border-red-500' : ''}`}
                    defaultValue={experienceLevel}
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Internship">Internship</option>
                    <option value="Any experience">Any experience</option>
                    <option value="Work remotely">Work remotely</option>
                  </select>
                  {errors.experienceLevel && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.experienceLevel.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Employment Type *
                  </label>
                  <select
                    {...register("employmentType", { required: "Employment type is required" })}
                    className={`input ${errors.employmentType ? 'border-red-500' : ''}`}
                    defaultValue={employmentType}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Temporary">Temporary</option>
                  </select>
                  {errors.employmentType && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.employmentType.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Required Skills
              </label>
              <p className="text-sm text-secondary-600 mb-4">
                Select or add the skills required for this position
              </p>
              <CreatableSelect
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
                isMulti
                styles={customSelectStyles}
                placeholder="Select or type skills..."
                className="text-sm"
              />
            </div>

            {/* Company Logo & Description */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <FiFileText className="w-6 h-6 mr-3 text-primary-600" />
                Additional Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Company Logo URL
                  </label>
                  <input
                    type="url"
                    defaultValue={companyLogo}
                    {...register("companyLogo")}
                    className="input"
                  />
                  <p className="mt-1 text-sm text-secondary-600">
                    Provide a URL to your company logo (optional)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    className={`input min-h-32 ${errors.description ? 'border-red-500' : ''}`}
                    rows={6}
                    defaultValue={description}
                    {...register("description", { required: "Job description is required" })}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.description.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Posted By (Your Email) *
                  </label>
                  <input
                    type="email"
                    defaultValue={postedBy}
                    {...register("postedBy", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`input ${errors.postedBy ? 'border-red-500' : ''}`}
                  />
                  {errors.postedBy && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="w-4 h-4 mr-1" />
                      {errors.postedBy.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-secondary-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full btn btn-primary py-4 text-lg font-semibold flex items-center justify-center space-x-3 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Updating Job...</span>
                  </>
                ) : (
                  <>
                    <FiSave className="w-5 h-5" />
                    <span>Update Job</span>
                  </>
                )}
              </button>
              <p className="text-center text-sm text-secondary-600 mt-4">
                Changes will be reflected immediately after update.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateJob;
