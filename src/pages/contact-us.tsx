import { Building2Icon, MailIcon } from "lucide-react";
import { Card, CardBody } from "@nextui-org/react";
import GetHelpCard from "../components/redesigned-components/components/get-help";
import MaxWidthContainer from "../components/max-width-container";
import PaddingContainer from "../components/redesigned-components/components/padding-container";
import ContactForm from "../components/redesigned-components/components/forms/contact-form";
import JoinToday from "../components/redesigned-components/components/join-today";

const ContactUs = () => {
  return (
    <div className="">
      <PaddingContainer className="py-10 pb-32 px-5 ">
        <MaxWidthContainer>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              {/* <div className="hidden h-full md:block">
                <Image src="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
              </div> */}
              <Card shadow="none" className="min-h-[250px]">
                <CardBody className="gap-3 justify-center p-4">
                  <GetHelpCard
                    header="Email Support"
                    content="info@vuior.com"
                    icon={MailIcon}
                  />
                  {/* <GetHelpCard
                    header="Phone Number"
                    content="1-833-337-1826"
                    icon={PhoneIcon}
                  /> */}
                  <GetHelpCard
                    header="Address"
                    content="Vuior HQ, 1207 Delaware Ave #3968, Wilmington, DE 19806"
                    icon={Building2Icon}
                  />
                  {/* <GetHelpCard
                    header="Twitter"
                    content="@vuiro"
                    icon={Twitter}
                  /> */}
                </CardBody>
              </Card>
            </div>
            <ContactForm />
          </div>
        </MaxWidthContainer>
      </PaddingContainer>
      <JoinToday />
    </div>
  );
};

export default ContactUs;
