import React from "react";
import Footer from "../../components/user/Footer";

const ContactUs = () => {
  return (
    <div className="pt-28">
      <div className="flex flex-wrap justify-between items-center">
        {/* Left section: Text */}
        <div className="w-full md:w-1/2 text-center md:text-center mb-10 md:mb-0">
          <p className="font-extrabold text-4xl dark:text-lightText">
            <span className="text-primary block">Hi there....</span>
          </p>
          <p className="font-extrabold text-4xl dark:text-lightText">
            How can we <span className="text-primary block">Help</span> you
          </p>
        </div>

        {/* Right section: Form */}
        <div className="w-full md:w-1/2 flex justify-center">
          <form className="bg-white dark:bg-darkBackground p-8 rounded-lg shadow-2xl  w-full max-w-lg">
            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-lightText font-semibold mb-2"
                htmlFor="name"
              >
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  dark:bg-darkBackground dark:text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-lightText font-semibold mb-2"
                htmlFor="email"
              >
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent  dark:bg-darkBackground dark:text-white"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 dark:text-lightText font-semibold mb-2"
                htmlFor="message"
              >
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none dark:bg-darkBackground dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-primaryDark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="flex justify-center items-center w-full px-4 mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
