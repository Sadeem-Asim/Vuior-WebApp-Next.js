import { Image } from "@nextui-org/react";
import MaxWidthContainer from "../components/max-width-container";
import Benefits from "../components/redesigned-components/components/benefits";
import Hero from "../components/redesigned-components/components/hero";
import ServiceCards from "../components/redesigned-components/components/service-cards";
import JoinToday from "../components/redesigned-components/components/join-today";
import FAQs from "../components/redesigned-components/components/faqs";
import { reactNow } from "../data";
import ShinyButton from "../components/redesigned-components/components/shiny-button";
import { useEffect } from "react";
declare global {
  interface Window {
    Elfsight?: {
      init: () => void;
    };
  }
}
const ElfsightWidget = () => {
  useEffect(() => {
    // Ensure Elfsight script is loaded properly
    if (window.Elfsight) {
      window.Elfsight.init();
    }
  }, []);

  return (
    <div
      className="elfsight-app-74a16cb8-c27c-4060-b3c5-c546fd78fdea"
      data-elfsight-app-lazy
    ></div>
  );
};

const HomePage = () => {
  return (
    <div>
      <ElfsightWidget />
      <MaxWidthContainer>
        <Hero />
      </MaxWidthContainer>
      <div className="bg-[#042424] py-20 text-white">
        <MaxWidthContainer>
          <div className="text-center px-2 md:max-w-[80%] mx-auto">
            <h2 className="text-5xl font-semibold text-white mb-2">
              Turning Your Payments into Savings!
            </h2>
            <p className="text-[#9ba1a6] font-bold text-md my-6 leading-relaxed">
              Managing bills can be overwhelming. Vuior transforms every payment
              into an opportunity to save more and stress less— empowering you
              to take control of your finances, one early payment at a time.
            </p>
          </div>

          <h2 className="text-4xl mt-20 text-center font-semibold text-white mb-2">
            Why Choose Vuior?
          </h2>
          <ServiceCards services={reactNow} />

          <div className="text-center px-2 md:max-w-[80%] mx-auto">
            <p className="text-[#9ba1a6] font-bold text-md my-6 leading-relaxed">
              At Vuior, we’re more than just a bill management platform. We’re
              here to help you{" "}
              {/* <span className="font-bold text-white/80"> */}
              save smarter, live better, {/* </span> */}
              and take control of your financial future. That’s our commitment
              to you. {/* <span className="font-bold text-white/80"> */}
              Vuior REWARDS: Turning Your Payments into Savings
              {/* </span> */}
            </p>
            <ShinyButton
              href="/create-account"
              className="w-fit mx-auto rounded-full px-7 py-2"
            >
              Join Now
            </ShinyButton>
          </div>
        </MaxWidthContainer>
      </div>
      <MaxWidthContainer className="p-4 px-4 md:px-10">
        <div className="flex flex-col items-center justify-center md:flex-row my-20 gap-10">
          <div className="md:max-w-[50%] md:hidden lg:block ">
            <Image
              className="w-full h-[300px]"
              src="/assets/brand/start.jpeg"
            />
          </div>
          <Benefits
            hideList
            heading="Start Your Vuior REWARDS Journey Today!"
            content={`Start managing your bills smarter and saving more. Vuior is easy to use, and joining is
completely free—no strings attached, no hidden fees. You’ll even earn your first rewards within
days! Managing your bills should put money back in your pocket. Sign up for free and start
saving! Join Vuior Today
`}
          />
        </div>
      </MaxWidthContainer>
      <JoinToday />
      <div className="w-full ">
        <MaxWidthContainer className="">
          <FAQs />
        </MaxWidthContainer>
      </div>
    </div>
  );
};

export default HomePage;
