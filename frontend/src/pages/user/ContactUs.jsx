import React from "react";
import Footer from "../../components/user/Footer";
import ContactForm from "../../components/user/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BrudCrump from "../../components/BrudCrump";
import { Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";

const ContactUs = () => {

    const brudCrumpList = [
      {
        name: "Home",
        icon: <FontAwesomeIcon icon="fa-solid fa-house" />,
        path: "/user",
      },
      {
        name: "contact-us",
        icon: <FontAwesomeIcon icon="fa-solid fa-phone" />,
        path: "/user/contact",
      },
    ];
      


  return (
    <div className="">
      <div className="bg-gradient-to-r bg-indigo-500 shadow-md fixed w-full z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-white">
            <Link
              to="/user"
              className="text-white hover:text-white/80 transition-colors flex items-center"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-white/60" />
            <span className="font-medium">Contact Us</span>
          </div>
        </div>
      </div>
      <div className="pt-20 flex flex-wrap justify-between items-center">
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
          <ContactForm />
        </div>
      </div>

      <div className="flex justify-center items-center w-full px-4 mt-20">
        <Footer />
      </div>
    </div>
  );
};

export default ContactUs;
