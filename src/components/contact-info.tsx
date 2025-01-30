/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "./button";
import InfoCard from "./cards/info-card";
import ContactInput from "./contact-input";
import { ContactSchema } from "../validations/schema";

export type ContactFormData = z.infer<typeof ContactSchema>;

const ContactInfo = () => {
  const { register, handleSubmit } = useForm<ContactFormData>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      message: "",
      phoneNumber: "",
      file: "",
    },
  });

  const onSubmit = async (values: ContactFormData) => {
    try {
      console.log(values);
    } catch (error) {
      console.log(error);
    } finally {
      console.log("Done");
    }
  };

  return (
    <div className="flex  items-start justify-between flex-wrap w-full">
      <div className="mt-10  lg:mt-32 mx-auto">
        <div className="flex w-full flex-col md:flex-row justify-between flex-wrap gap-y-10">
          <div className="flex md:max-w-[500px]   flex-col px-5">
            <div className="md:w-fit heading flex items-center justify-center flex-col w-full  font-semibold text-emerald-900 capitalize">
              <h1 className="">We're Here to Help</h1>
              <div className="border-b-4 border-[#23AB84] w-[30%] md:w-[90%]"></div>
            </div>
            <h2 className="text-[16px] hidden md:block mt-4 text-emerald-900">
              Have questions or need assistance? Our team is here to make sure
              you have the best experience possible with Vuior.
            </h2>

            <InfoCard
              imgSrc="/assets/icons/callTwo.png"
              linkText="1-800-VUIO-NOW"
              href="tel:1-800-VUIO-NOW"
              label="Phone Number"
            />
            <InfoCard
              imgSrc="/assets/icons/email.png"
              linkText="support@vuio.com"
              href="mailto:support@vuio.com"
              label="Email"
            />
            <InfoCard
              imgSrc="/assets/icons/business.png"
              linkText="Vuior HQ, 1207 Delaware Ave #3968, Wilmington, DE 19806"
              href=""
              label="Address"
            />
            <h2 className="text-[16px] text-center md:text-left mt-8 text-emerald-900">
              Have questions or need assistance? Our team is here to make sure
              you have the best experience possible with Vuior.
            </h2>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-start mt-10 md:mt-20 text-center font-poppins font-semibold text-[#0f4af] lg:w-fit w-full mx-auto min-h-fit">
        <div className="mx-auto w-full lg:w-[50vw]">
          <form
            action=""
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col px-14 pt-8 pb-8 font-medium shadow-sm bg-emerald-500 bg-opacity-10 rounded-[30px] text-stone-950 max-md:px-5  lg:mx-auto"
          >
            <div className="self-center text-[20px] lg:text-[28px] text-black capitalize max-md:max-w-full">
              Have any Questions?
            </div>
            <div className="flex flex-col w-full gap-6 text-[18px] lg:text-[1vw] mt-[40px]">
              <ContactInput
                register={register}
                name="fullName"
                label="Full Name"
                id="fullName"
                type="text"
              />
              <ContactInput
                register={register}
                name="phoneNumber"
                label="Phone Number"
                id="phoneNumber"
                type="number"
              />
              <ContactInput
                register={register}
                name="email"
                label="Email"
                id="email"
                type="email"
              />
              <ContactInput
                register={register}
                name="message"
                label="Tell us about your thoughts"
                id="message"
                type="text"
                textArea
              />
            </div>
            {/* {customErrorMessage && customErrorMessage.length && (
              <p className="text-red-500 mt-5 text-center font-semibold text-sm">
                {customErrorMessage}
              </p>
            )} */}

            <Button type="submit" className="mt-10">
              Submit Form
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
