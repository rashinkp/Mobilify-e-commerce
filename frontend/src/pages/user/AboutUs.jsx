import React from "react";
import Footer from "../../components/user/Footer";

const AboutUs = () => {
  return (
    <div className="pt-28 bg-lightBackground dark:bg-darkBackground min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-16 px-6">
        <p className="font-extrabold text-4xl dark:text-lightText mb-4">
          <span className="text-primary">About</span> Us
        </p>
        <p className="text-lg dark:text-gray-300 text-gray-700 max-w-3xl mx-auto leading-relaxed">
          We are a passionate team committed to delivering excellence through
          our products and services. Our goal is to create innovative solutions
          that add value to our customers’ lives.
        </p>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-16 px-8 md:px-20">
        {/* Core Values Section */}
        <div className="w-full md:w-1/2 bg-white dark:bg-darkBackground p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold dark:text-lightText mb-4">
            Our Core Values
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Integrity and Honesty</li>
            <li>Customer Satisfaction</li>
            <li>Innovation and Creativity</li>
            <li>Teamwork and Collaboration</li>
            <li>Commitment to Quality</li>
          </ul>
        </div>

        {/* Mission Section */}
        <div className="w-full md:w-1/2 bg-white dark:bg-darkBackground p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold dark:text-lightText mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            To empower our clients through exceptional services and solutions
            that exceed expectations. We strive to create impactful and
            innovative results that drive success and growth.
          </p>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default AboutUs;
