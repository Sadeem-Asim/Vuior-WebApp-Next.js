const TopHeader = () => {
  return (
    <div className="flex items-center px-1 justify-between mx-auto w-full xl:w-[90vw]">
      <div>
        <div className="py-4 flex bg-[#ffffff] items-center md:justify-center flex-wrap gap-3 sm:gap-8">
          <div className="font-poppins font-medium flex items-start gap-2">
            <img
              src="/assets/icons/location.png"
              alt="location"
              className="w-full max-w-5"
            />
            <p className="text-[10px] sm:text-base">
              Vuior HQ, 1207 Delaware Ave #3968, Wilmington, DE 19806
            </p>
          </div>
          <div className="font-poppins font-medium flex items-center gap-2">
            <span className="">
              <img
                src="/assets/icons/call.png"
                alt="call"
                className="w-full max-w-5"
              />
            </span>
            <p className="text-[10px] sm:text-base">1-800-VUIO-NOW</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 my-2">
        <div className="cursor-pointer">
          <img src="/assets/icons/twitter.png" alt="twitter" />
        </div>
        <div className="cursor-pointer">
          <img src="/assets/icons/instgram.png" alt="instagram" />
        </div>
        <div className="cursor-pointer">
          <img src="/assets/icons/linkedin.png" alt="linkedin" />
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
