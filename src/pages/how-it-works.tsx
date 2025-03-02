import MaxWidthContainer from "../components/max-width-container";
import JoinToday from "../components/redesigned-components/components/join-today";
import ShinyButton from "../components/redesigned-components/components/shiny-button";
import { FeatureSection } from "../components/redesigned-components/components/cards/feature-card";

const HowItWorks = () => {
  return (
    <div className=" md:pt-14">
      <MaxWidthContainer className="pt-10 pb-20 px-3 md:px-10">
        <div className="text-center w-full  flex flex-col items-center">
          <h1 className="mb-6 md:max-w-[70%] text-4xl md:text-5xl font-extrabold lg:text-6xl text-primary-text ">
            How It Works
          </h1>
          <p className="text-secondary-text md:max-w-[70%] font-bold md:text-lg mb-8">
            React is the heartbeat of Vuior, where every move you make toward
            managing your bills early turns into savings. It's simple, smart,
            and designed to keep you financially ahead. Here’s how it works.
          </p>
          {/* <ShinyButton
            href={"/consultation"}
            className="relative w-fit px-16 z-10 h-14  shadow-lg transition-shadow duration-300 hover:shadow-xl rounded-full font-semibold text-xl"
          >
            Start
Saving Now
          </ShinyButton> */}
        </div>
      </MaxWidthContainer>
      <MaxWidthContainer className="">
        <FeatureSection
          title="Join for Free"
          description="Sign up for Vuior with no fees or credit checks."
          imageSrc="/icons/join.svg"
          imageAlt="Join for Free"
          buttonText="Sign Up"
          buttonHref="/create-account"
          className="bg-muted"
        />
        <FeatureSection
          title="Add Your Bills"
          description="Connect your bills—utilities, rent, credit cards, and more—in one easy-to-use dashboard."
          imageSrc="/icons/addBills.svg"
          imageAlt="Add Bills"
          buttonHref="#"
          imagePosition="left"
          className="bg-background"
        />

        <FeatureSection
          title="Pay Early, Save More"
          description="Vuior rewards you for paying bills early. The earlier the payment,
the higher your savings up to 25%! Whether it’s 5 days or 10 days before the due date,
your savings grow with every proactive payment."
          imageSrc="/icons/payEarly.svg"
          imageAlt="Pay Early"
          buttonHref="#"
          className="bg-muted"
        />

        <FeatureSection
          title="Automated Alerts"
          description="Vuior keeps you informed. Our automated alerts notify you when it's
the perfect time to pay to maximize your savings. As the due date approaches, you’ll
receive reminders showing exactly how much you’ll save by paying early."
          imageSrc="/icons/alerts.svg"
          imageAlt="Alerts"
          buttonHref="#"
          imagePosition="left"
        />

        <FeatureSection
          title="Exclusive Discounts"
          description="Thanks to Vuior’s partnerships with top service providers, you’ll
get access to negotiated rates that offer even more savings. Vuior automatically applies
these discounts to your bills, so you’re always getting the best deal. Enjoy exclusive
rates with Vuior’s negotiated discounts from top service providers."
          imageSrc="/icons/discounts.svg"
          imageAlt="Discounts"
          buttonHref="#"
          imagePosition="left"
        />
        <FeatureSection
          title="Track Your Savings"
          description="The React Dashboard gives you a clear view of all your bills, how
early you paid, and the total savings you’ve accumulated. The more you engage, the
more you save."
          imageSrc="/icons/track.svg"
          imageAlt="Savings"
          buttonHref="#"
          className="bg-muted"
        />
      </MaxWidthContainer>
      {/* <div className="bg-[#042424] py-20 text-white">
        <MaxWidthContainer>
          <div className="text-center px-2 md:max-w-[80%] mx-auto">
            <h2 className="text-5xl font-semibold text-white mb-2">
              React Now
            </h2>
          </div>
          <ServiceCards services={services} />
        </MaxWidthContainer>
      </div> */}
      <MaxWidthContainer className="py-28 px-10">
        <h3 className="text-button-gpt   text-xl w-full text-center mb-4 font-semibold">
          Watch Your Savings Grow
        </h3>
        <div className="text-center w-full flex flex-col items-center">
          <h1 className="mb-6 md:max-w-[70%] text-4xl md:text-5xl font-extrabold lg:text-6xl text-primary-text ">
            Vuior is built on rewards.
          </h1>
          <p className="text-secondary-text md:max-w-[70%] font-bold md:text-lg mb-8">
            With Vuior it’s all about building good habits. React today with
            Vuior and start making every payment count! The earlier you move,
            the more you save. Now is the time to REACT, SAVE, and REWARD
            yourself with Vuior.
          </p>
          <ShinyButton
            href={"/create-account"}
            className="relative w-fit px-16 z-10 h-14  shadow-lg transition-shadow duration-300 hover:shadow-xl rounded-full font-semibold text-xl"
          >
            Start Saving Now
          </ShinyButton>
        </div>
      </MaxWidthContainer>
      <JoinToday
        title="Join Vuior Today"
        content="Managing your bills should put money back in your pocket. Sign up for free and start saving!"
      />
    </div>
  );
};

export default HowItWorks;
