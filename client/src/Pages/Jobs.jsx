import React from "react";

const Jobs = ({ result, viewMode = 'grid' }) => {
  return (
    <section className={`${
      viewMode === 'grid' 
        ? 'grid grid-cols-1 md:grid-cols-2 gap-6' 
        : 'space-y-4'
    } animate-fade-in`}>
      {result}
    </section>
  );
};

export default Jobs;
