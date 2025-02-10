import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#051a15] ">
      <div className="w-full px-4 xl:px-0 xl:w-[90%] flex flex-col md:flex-row items-start justify-center mx-auto gap-[10vw] pt-[30px]">
        <div className="w-full md:w-[40vw]">
          <div className="max-w-[517px] mx-auto">
            <img src="/assets/icons/logo.png" alt="logo" />
            <p className="font-poppins text-white mt-[20px] text-[14px] lg:text-[1vw]">
              Vuior – Empowering Your Financial Future, One Payment at a Time.
            </p>
            <div className="mt-[40px]">
              <div className="flex items-end gap-[30px] mt-[30px]">
                <div className="cursor-pointer">
                  <a
                    href="https://www.facebook.com/profile.php?id=61557178921559"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src="/assets/icons/facebookLogo.png"
                      alt="twitter"
                      style={{
                        width: 30,
                        height: 30,
                        background: "white",
                      }}
                    />
                  </a>
                </div>
                <div className="cursor-pointer">
                  <a
                    href="https://www.instagram.com/vuiorhq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/assets/icons/instgram.png" alt="instagram" />
                  </a>
                </div>
                <div className="cursor-pointer">
                  <a
                    href="https://www.linkedin.com/company/vuior-hq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src="/assets/icons/linkedin.png" alt="linkedin" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-y-10 justify-between md:justify-around w-full md:w-[40vw]">
          <div>
            <h1 className="text-white text-[16px] lg:text-[1.2vw] mb-10">
              Pages
            </h1>
            <div className="flex flex-col gap-y-[16px] text-[#d6d6d6] font-normal text-[16px] lg:text-[1vw] font-poppins">
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "border-b-2 border-emerald-700 w-fit"}`
                }
                to="/"
              >
                Home
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "border-b-2 border-emerald-700 w-fit"}`
                }
                to="/careers"
              >
                Careers
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "border-b-2 border-emerald-700 w-fit"}`
                }
                to="/about"
              >
                About us
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "border-b-2 border-emerald-700 w-fit"}`
                }
                to="/how-it-works"
              >
                How it works
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  `${isActive && "border-b-2 border-emerald-700 w-fit"}`
                }
                to="/contact-us"
              >
                Contact Us
              </NavLink>
              <NavLink className={"mr-4"} to={"/faqs"}>
                FAQs
              </NavLink>
            </div>
          </div>
        </div>
      </div>
      <hr className="mt-[30px] bg-[#0F4A3F]  h-[1px] border-0"></hr>
      <div className="w-[90%] mx-auto mt-[30px]">
        <div className="md:mx-[40px] flex flex-wrap gap-4 pb-4 justify-between">
          <div>
            <p className="font-poppins font-medium text-[14px] lg:text-[1vw] text-pretty  text-white">
              © Copyright 2024.
            </p>
          </div>
          <div className="gird grid-cols-2 xl:grid-cols-4 items-center font-poppins text-white text-[12px] lg:text-[14px] gap-4  md:gap-10">
            <NavLink className={"mr-4"} to={"/privacy-policy"}>
              Privacy Policy
            </NavLink>
            <NavLink className={"mr-4"} to={"/terms-of-service"}>
              Terms of Service
            </NavLink>
            <NavLink className={"mr-4"} to={"/cookies-policy"}>
              Cookies Policy
            </NavLink>
            <NavLink className={"mr-4"} to={"/data-protection-policy"}>
              Data Protection Policy
            </NavLink>
            <NavLink className={"mr-4"} to={"/contact-us"}>
              Contact Us
            </NavLink>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
