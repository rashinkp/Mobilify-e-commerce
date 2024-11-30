import React, { useState, useEffect, useRef } from "react";
import IconMain from "../../assets/Icon_Main.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close the menu when the screen size is increased beyond a certain breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <div className="flex items-center justify-between px-8 py-4 lg:px-16 lg:py-5 font-medium relative">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img src={IconMain} alt="Logo" />
        </div>

        {/* Middle Section - Hidden on smaller screens */}
        <div className="hidden lg:flex items-center justify-center flex-grow gap-8 lg:gap-12">
          <ul className="flex gap-8 lg:gap-12">
            <li className="cursor-pointer text-black font-bold hover:text-purple-700">
              HOME
            </li>
            <li className="cursor-pointer text-gray-500 hover:text-purple-700">
              PRODUCTS
            </li>
            <li className="cursor-pointer text-gray-500 hover:text-purple-700">
              CONTACT
            </li>
            <li className="cursor-pointer text-gray-500 hover:text-purple-700">
              ABOUT US
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-4 lg:gap-6">
          {/* Updated icons to prevent errors and ensure they appear */}
          <FontAwesomeIcon
            icon={["far", "heart"]}
            size="2x"
            className="cursor-pointer hover:text-purple-700"
          />
          <FontAwesomeIcon
            icon={["fas", "cart-shopping"]}
            size="2x"
            className="cursor-pointer hover:text-purple-700"
          />
          <div className="flex items-center gap-2 cursor-pointer relative">
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <FontAwesomeIcon
              onClick={() => setDropdownOpen(!dropdownOpen)}
              icon={faChevronDown}
              size="sm"
              className="text-gray-500"
            />
            {/* Dropdown Menu for Profile */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 bg-white shadow-lg rounded-md w-52 flex justify-center py-4 z-50"
              >
                <ul className="flex flex-col gap-2 px-4">
                  <li className="cursor-pointer hover:text-purple-700">
                    Profile
                  </li>
                  <li className="cursor-pointer hover:text-purple-700">
                    Orders
                  </li>
                  <li className="cursor-pointer hover:text-purple-700">
                    Favorite
                  </li>
                  <li className="cursor-pointer hover:text-purple-700">
                    Wallet
                  </li>
                  <li className="cursor-pointer text-red-700 hover:text-red-900">
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Menu Icon for Small Screens */}
        <div className="block lg:hidden">
          <FontAwesomeIcon
            icon={faBars}
            size="2x"
            className="cursor-pointer hover:text-gray-700"
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* Dropdown Menu for Small Screens */}
        {menuOpen && (
          <div className="absolute flex top-full right-0 bg-white shadow-lg rounded-md w-full py-7 z-50 justify-center">
            <ul className="flex flex-col gap-6 px-4">
              <li className="cursor-pointer hover:text-purple-700">HOME</li>
              <li className="cursor-pointer hover:text-purple-700">PRODUCTS</li>
              <li className="cursor-pointer hover:text-purple-700">CONTACT</li>
              <li className="cursor-pointer hover:text-purple-700">ABOUT US</li>
              <div className="flex items-center gap-3 mt-2">
                {/* Updated icons to prevent errors and ensure they appear */}
                <FontAwesomeIcon
                  icon={["far", "heart"]}
                  size="xl"
                  className="cursor-pointer hover:text-purple-700"
                />
                <FontAwesomeIcon
                  icon={["fas", "cart-shopping"]}
                  size="xl"
                  className="cursor-pointer hover:text-purple-700"
                />
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden">
                    <img
                      src="https://via.placeholder.com/150"
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
