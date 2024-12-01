import React from "react";
import IconMain from "../../assets/Icon_Main.svg";
import IconMainWhite from "../../assets/Icon_Main_white.svg";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => {
  const theme = useSelector((state) => state.theme.theme);

  return (
    <footer className="w-full dark:bg-darkBackground py-10">
      <div className="container mx-auto px-6 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="flex flex-col lg:flex-row gap-10 justify-between items-start">
          {/* Logo and Description */}
          <div className="flex-1 mb-8 lg:mb-0">
            <img
              src={theme === "light" ? IconMain : IconMainWhite}
              alt="Logo"
              className="mb-4 w-32 lg:w-40 mx-auto lg:mx-0"
            />
            <p className="text-gray-600 dark:text-gray-300 max-w-md text-center lg:text-left">
              Explore a wide range of premium products tailored to your needs,
              all at unbeatable prices. Your satisfaction is our priority.
            </p>
          </div>

          {/* Links Section */}
          <div className="flex flex-wrap gap-10 justify-between">
            {/* Company Links */}
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
                Company
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Information Links */}
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
                Information
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Links */}
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-4">
                Contact
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors duration-300"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Media Links */}
          <div className="mt-8 lg:mt-0">
            <h3 className="font-bold text-lg text-gray-800 dark:text-lightText mb-4">
              Follow Us
            </h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors duration-300"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-facebook "
                  className="dark:text-lightText"
                />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors duration-300"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-twitter"
                  className="dark:text-lightText"
                />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors duration-300"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-instagram"
                  className="dark:text-lightText"
                />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors duration-300"
              >
                <FontAwesomeIcon
                  icon="fa-brands fa-linkedin"
                  className="dark:text-lightText"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Information */}
        <div className="mt-10 text-center text-gray-600 dark:text-gray-300">
          <p>
            &copy; {new Date().getFullYear()} Your Company. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
