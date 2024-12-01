import React, { useState, useEffect, useRef } from "react";
import IconMain from "../../assets/Icon_Main.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/slices/themeSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);

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
      <div className="flex items-center justify-between px-8 py-4 lg:px-16 lg:py-5 font-medium relative dark:bg-darkBackground ">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img src={IconMain} alt="Logo" className="text-lightBackground" />
        </div>

        {/* Middle Section - Hidden on smaller screens */}
        <div className="hidden lg:flex items-center justify-center flex-grow gap-8 lg:gap-12">
          <ul className="flex gap-8 lg:gap-12">
            <li className="cursor-pointer text-darkText font-bold hover:text-primary dark:text-lightText dark:font-bold dark:hover:text-primary">
              HOME
            </li>
            <li className="cursor-pointer text-secondary hover:text-primary dark:text-secondary dark:hover:text-primary">
              PRODUCTS
            </li>
            <li className="cursor-pointer text-secondary hover:text-primary dark:text-secondary dark:hover:text-primary">
              CONTACT
            </li>
            <li className="cursor-pointer text-secondary hover:text-primary dark:text-secondary dark:hover:text-primary">
              ABOUT US
            </li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="hidden lg:flex items-center gap-4 lg:gap-6">
          {/* Updated icons to prevent errors and ensure they appear */}
          <FontAwesomeIcon
            icon={["far", "heart"]}
            size="xl"
            className="cursor-pointer hover:text-primary dark:text-lightText dark:hover:text-primary"
          />
          <FontAwesomeIcon
            icon={["fas", "cart-shopping"]}
            size="xl"
            className="cursor-pointer hover:text-primary dark:text-lightText dark:hover:text-primary"
          />
          <div className="flex items-center gap-2 cursor-pointer relative">
            <div className="w-8 h-8 bg-lightBackground rounded-full overflow-hidden">
              <img
                src="https://via.placeholder.com/150"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <FontAwesomeIcon
              onClick={() => setDropdownOpen(true)}
              icon={faChevronDown}
              size="sm"
              className="text-darkText dark:text-lightText"
            />
            {/* Dropdown Menu for Profile */}
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute top-full right-0 mt-2 bg-lightBackground shadow-lg shadow-darkBackground dark:border dark:border-lightBackground dark:bg-darkBackground dark:text-lightText rounded-md w-52 flex justify-center py-4 z-50 "
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
                  <li
                    className="cursor-pointer hover:text-purple-700"
                    onClick={() => dispatch(toggleTheme())}
                  >
                    {theme === "light" ? "swithch to dark" : "switch to light"}
                  </li>
                  <li className="cursor-pointer text-red-700 hover:text-red-800">
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
            className="cursor-pointer hover:text-gray-700 dark:text-lightText "
            onClick={() => setMenuOpen(!menuOpen)}
          />
        </div>

        {/* Dropdown Menu for Small Screens */}
        {menuOpen && (
          <div className="absolute flex top-full right-0 bg-lightBackground shadow-lg rounded-md w-full py-7 z-50 justify-center dark:bg-darkBackground dark:border dark:border-lightText dark:text-lightText">
            <ul className="flex flex-col gap-6 px-4">
              <li className="cursor-pointer hover:text-primary">HOME</li>
              <li className="cursor-pointer hover:text-primary">PRODUCTS</li>
              <li className="cursor-pointer hover:text-primary">CONTACT</li>
              <li className="cursor-pointer hover:text-primary">ABOUT US</li>
              <div className="flex items-center gap-3 mt-2">
                {/* Updated icons to prevent errors and ensure they appear */}
                <FontAwesomeIcon
                  icon={["far", "heart"]}
                  size="xl"
                  className="cursor-pointer hover:text-primary"
                />
                <FontAwesomeIcon
                  icon={["fas", "cart-shopping"]}
                  size="xl"
                  className="cursor-pointer hover:text-primary"
                />
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="w-6 h-6 bg-secondary rounded-full overflow-hidden">
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
