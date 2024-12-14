import React, { useState, useEffect, useRef } from "react";
import IconMain from "../assets/Icon_Main.svg";
import IconMainWhite from "../assets/Icon_Main_white.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faBars } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/slices/themeSlice.js";
import { Link, useLocation, useNavigate } from "react-router";
import { useLogoutMutation } from "../redux/slices/userApiSlices.js";
import { userLogout } from "../redux/slices/authUser.js";
import { successToast } from "./toast/index.js";
import { googleLogout } from "@react-oauth/google";
import BrudCrump from "./BrudCrump.jsx";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();

  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme.theme);


  const navigate = useNavigate();
  const icons = {
    light: IconMain,
    dark: IconMainWhite,
  };

  const [logoutApiCall] = useLogoutMutation();

  const {userInfo} = useSelector((state) => state.userAuth)

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setDropdownOpen(false)
      await logoutApiCall().unwrap();
      dispatch(userLogout());
      googleLogout();
      successToast("Logout Successful");
      navigate("/user/login");
    } catch (err) {
      console.log(err);
    }
  };

  const profile = {
    img: "https://via.placeholder.com/150",
    list: [
      {
        text: "Profile",
        path: "/user/profile",
      },
      {
        text: "Orders",
        path: "/user/orders",
      },
      {
        text: "Wishlist",
        path: "/user/profile",
      },
      {
        text: "Wallet",
        path: "/user/wallet",
      },
    ],
  };

  const links = [
    {
      text: "home",
      path: "/user",
    },
    {
      text: "products",
      path: "/user/products",
    },
    {
      text: "contact",
      path: "/user/contact",
    },
    {
      text: "about us",
      path: "/user/about",
    },
  ];

  const rightSection = [
    {
      text: "Wish List",
      icon: (
        <FontAwesomeIcon
          icon={["far", "heart"]}
          size="xl"
          className="cursor-pointer dark:text-lightText hover:text-primary"
        />
      ),
      path: "/user/wishlist",
    },
    {
      text: "My Cart",
      icon: (
        <FontAwesomeIcon
          icon={["fas", "cart-shopping"]}
          size="xl"
          className="cursor-pointer dark:text-lightText hover:text-primary"
        />
      ),
      path: "/user/cart",
    },
    {
      text: "Toggle Theme",
      icon: (
        <FontAwesomeIcon
          size="xl"
          onClick={() => dispatch(toggleTheme())}
          icon="fa-solid fa-moon"
          className="cursor-pointer  hover:text-primary dark:text-lightText dark:hover:text-primary"
        />
      ),
      onClick: () => dispatch(toggleTheme()),
    },
  ];


  

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
            src={theme === "light" ? icons.light : icons.dark}
            alt="Logo"
            className=""
          />
        </div>

        {/* Middle Section - Hidden on smaller screens */}
        <div className="hidden lg:flex items-center justify-center flex-grow gap-8 lg:gap-12">
          <ul className="flex gap-8 lg:gap-12">
            {links.map((link, i) => (
              <Link key={i} to={link.path}>
                <li
                  className={`cursor-pointer  hover:text-primary ${
                    location.pathname === link.path
                      ? "text-darkText font-bold dark:text-lightText dark:font-bold"
                      : "text-secondary dark:text-secondary"
                  }   dark:hover:text-primary`}
                >
                  {link.text.toUpperCase()}
                </li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Right Section */}
        {userInfo ? (
          <div className="hidden lg:flex items-center gap-4 lg:gap-6">
            {/* Updated icons to prevent errors and ensure they appear */}
            {rightSection &&
              rightSection.map((link, index) => (
                <Link key={index} to={link.path}>
                  {link.icon}
                </Link>
              ))}

            <div className="flex items-center gap-2 cursor-pointer relative">
              <div className="w-8 h-8 bg-lightBackground rounded-full overflow-hidden">
                <img
                  src={profile.img}
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
                    {profile.list.map((item, index) => (
                      <Link key={index} to={item.path}>
                        <li
                          onClick={() => setDropdownOpen(false)}
                          className={`cursor-pointer hover:text-primary`}
                        >
                          {item.text.toUpperCase()}
                        </li>
                      </Link>
                    ))}

                    <li
                      onClick={(e) => handleLogout(e)}
                      className={`cursor-pointer hover:text-red-800 text-red-600`}
                    >
                      LOGOUT
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className=" hidden lg:flex">
            <ul className="flex flex-row gap-7 items-center px-4 dark:text-lightText">
              <li className="cursor-pointer hover:text-purple-700">
                <FontAwesomeIcon
                  size="xl"
                  onClick={() => dispatch(toggleTheme())}
                  icon="fa-solid fa-moon"
                  className="cursor-pointer hover:text-primary  dark:hover:text-primary"
                />
              </li>
              <Link to="/user/login">
                <li className="cursor-pointer hover:text-purple-700 ">LOGIN</li>
              </Link>

              <li className="cursor-pointer hover:text-purple-700 ">
                <div className="bg-darkText text-lightText py-2 px-5 rounded-full flex gap-4 items-center dark:bg-inherit dark:border dark:border-lightBackground ">
                  <Link to="/user/signup">
                    <button className="">SIGN UP</button>
                  </Link>
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
              {links.map((link, i) => (
                <Link key={i} to={link.path}>
                  <li className="cursor-pointer hover:text-primary">
                    {link.text.toUpperCase()}
                  </li>
                </Link>
              ))}
              {userInfo ? (
                <div className="flex items-center gap-3 mt-2">
                  {/* Updated icons to prevent errors and ensure they appear */}

                  {rightSection.map((link, index) => (
                    <Link to={link.path}>
                      <li>{link.icon}</li>
                    </Link>
                  ))}
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
                    <Link to="/user/login">
                      <li className="cursor-pointer hover:text-purple-700 ">
                        LOGIN
                      </li>
                    </Link>

                    <li className="cursor-pointer hover:text-purple-700 ">
                      <div className="bg-darkText text-lightText py-2 px-5 rounded-full flex gap-4 items-center dark:bg-inherit dark:border dark:border-lightBackground ">
                        <Link to="/user/signup">
                          <button className="">SIGN UP</button>
                        </Link>
                        <FontAwesomeIcon icon="fa-solid fa-arrow-right" />
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
