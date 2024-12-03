import React, { useState, useEffect, useRef } from "react";
import IconMain from "../../assets/Icon_Main.svg";
import IconMainWhite from "../../assets/Icon_Main_white.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/slices/themeSlice";
import { Link, useLocation } from "react-router";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isLogged, setIsLogged] = useState(true);
  const use = useLocation();
  console.log(use.pathname)

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
      <div className="fixed z-10 top-0 left-0 right-0 flex items-center justify-between px-8 py-4 lg:px-16 lg:py-5 font-medium bg-lightBackground dark:bg-darkBackground">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <img
            src={theme === "light" ? IconMain : IconMainWhite}
            alt="Logo"
            className=""
          />
        </div>

        {/* Middle Section - Hidden on smaller screens */}
        <div className="hidden lg:flex items-center justify-center flex-grow gap-8 lg:gap-12">
          <ul className="flex gap-8 lg:gap-12">
            <Link to="/user">
              <li
                className={`cursor-pointer  hover:text-primary ${
                  use.pathname === "/user"
                    ? "text-darkText font-bold dark:text-lightText dark:font-bold"
                    : "text-secondary dark:text-secondary"
                }   dark:hover:text-primary`}
              >
                HOME
              </li>
            </Link>
            <Link to="/user/products">
              <li
                className={`cursor-pointer  hover:text-primary ${
                  use.pathname === "/user/products"
                    ? "text-darkText font-bold dark:text-lightText dark:font-bold"
                    : "text-secondary dark:text-secondary"
                }   dark:hover:text-primary`}
              >
                PRODUCTS
              </li>
            </Link>

            <Link to="/user/contact">
              <li
                className={`cursor-pointer  hover:text-primary ${
                  use.pathname === "/user/contact"
                    ? "text-darkText font-bold dark:text-lightText dark:font-bold"
                    : "text-secondary dark:text-secondary"
                }   dark:hover:text-primary`}
              >
                CONTACT
              </li>
            </Link>

            <Link to="/user/about">
              <li
                className={`cursor-pointer  hover:text-primary ${
                  use.pathname === "/user/about"
                    ? "text-darkText font-bold dark:text-lightText dark:font-bold"
                    : "text-secondary dark:text-secondary"
                }   dark:hover:text-primary`}
              >
                ABOUT US
              </li>
            </Link>
          </ul>
        </div>

        {/* Right Section */}
        {isLogged ? (
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
            <FontAwesomeIcon
              size="xl"
              onClick={() => dispatch(toggleTheme())}
              icon="fa-solid fa-moon"
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
                  <ul className="flex flex-col gap-4 px-4 py-3">
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
                    <li className="cursor-pointer text-red-700 hover:text-red-800">
                      Logout
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <ul className="flex flex-row gap-7 items-center px-4 dark:text-lightText">
              <li className="cursor-pointer hover:text-purple-700">
                <FontAwesomeIcon
                  size="xl"
                  onClick={() => dispatch(toggleTheme())}
                  icon="fa-solid fa-moon"
                  className="cursor-pointer hover:text-primary  dark:hover:text-primary"
                />
              </li>
              <li className="cursor-pointer hover:text-purple-700 ">LOGIN</li>
              <li className="cursor-pointer hover:text-purple-700 ">
                <div className="bg-darkText text-lightText py-2 px-5 rounded-full flex gap-4 items-center dark:bg-inherit dark:border dark:border-lightBackground ">
                  <button className="">SIGN UP</button>
                  <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
                </div>
              </li>
            </ul>
          </div>
        )}

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
                <FontAwesomeIcon
                  size="xl"
                  onClick={() => dispatch(toggleTheme())}
                  icon="fa-solid fa-moon"
                  className="cursor-pointer hover:text-primary dark:text-lightText dark:hover:text-primary"
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
