import React from "react";
import Footer from "../../components/user/Footer";
import ContactForm from "../../components/user/ContactForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BrudCrump from "../../components/BrudCrump";

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
      <div className="ms-10">
        <BrudCrump list={brudCrumpList} />
      </div>
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
