/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  // FormLabel,
  // FormMessage,
} from "../../../ui/form";
import { useState } from "react";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Card, CardBody, Checkbox, Divider } from "@nextui-org/react";
import { useAuth } from "../../../../hooks/useAuth";
import { ContactUsSchema } from "../../../../lib/validations";
import { useToast } from "../../../../hooks/use-toast";
// import emailjs from "@emailjs/browser";
import { NavLink } from "react-router-dom";
import axios from "axios";
import { storage } from "@/lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import CurrencyFormat from "react-currency-format";
type ContactUsFormData = z.infer<typeof ContactUsSchema>;

const ContactForm = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const [uDoc, setUDoc] = useState<any>(null);
  const form = useForm<ContactUsFormData>({
    resolver: zodResolver(ContactUsSchema),
    defaultValues: {
      email: user?.email || "",
      message: "",
      name: user?.firstName || "",
      subject: "",
      agreeToPromotionalMessages: true,
      phoneNumber: "",
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = form;
  const handleFileUpload = (event: any) => {
    setUDoc(event.target.files[0]);
  };
  const onSubmit = async (values: ContactUsFormData) => {
    try {
      setIsLoading(true);

      let docUrl = "";

      // Only upload if file exists
      if (uDoc) {
        const docRef = ref(storage, `docs/${uDoc.name}`);
        const snapshot = await uploadBytes(docRef, uDoc);
        console.log("Uploaded a doc!");
        docUrl = await getDownloadURL(snapshot.ref);
      }

      const formData = {
        subject: `New Contact Us Message Received from ${values.email}`,
        name: values.name,
        email: values.email,
        phone: values.phoneNumber,
        subjectLine: values.subject,
        message: values.message,
        agreeToPromotionalMessages: `${
          values.agreeToPromotionalMessages ? "Agreed" : "Not Agreed"
        }`,
      };

      const accessKey = "C63SwSugFYkrclqIedXCPkaGoyEh8MIEkNRO";
      const channelId = "367dbe7b-7e2b-5be1-a4c7-6327128b7b6b";
      const workspaceId = "f8f5bb9b-7243-48d8-9bcc-29b3792a27aa";
      const email = "info@vuior.com";
      const url = `https://api.bird.com/workspaces/${workspaceId}/channels/${channelId}/messages`;

      const htmlBody = `
        <p>New contact form message received!</p>
        <ul>
          <li><strong>Name:</strong> ${formData.name}</li>
          <li><strong>Email:</strong> ${formData.email}</li>
          <li><strong>Phone:</strong> ${formData.phone}</li>
          <li><strong>Subject:</strong> ${formData.subjectLine}</li>
          <li><strong>Message:</strong> ${formData.message}</li>
          <li><strong>Promotional Messages:</strong> ${
            formData.agreeToPromotionalMessages
          }</li>
        </ul>
        ${
          docUrl
            ? `<div style="width:500px; background-color:#10a37f; text-align:center; justify-content:center; color:white; border-radius:05px;">
                <a href="${docUrl}" style="color:white;">Click Here to Download</a>
              </div>`
            : ""
        }
      `;

      const textBody = `
        New contact form message received!
        Name: ${formData.name}
        Email: ${formData.email}
        Phone: ${formData.phone}
        Subject: ${formData.subjectLine}
        Message: ${formData.message}
        Promotional Messages: ${formData.agreeToPromotionalMessages}
        ${docUrl ? `Document: ${docUrl}` : ""}
      `;

      const data = {
        receiver: {
          contacts: [{ identifierValue: email }],
        },
        body: {
          type: "html",
          html: {
            metadata: {
              subject: `Contact Us Message from ${formData.name}`,
            },
            html: htmlBody,
            text: textBody,
          },
        },
      };

      const headers = {
        Authorization: `AccessKey ${accessKey}`,
        "Content-Type": "application/json",
      };

      await axios.post(url, data, { headers });

      toast({
        title: "Success",
        description: "Message sent successfully. We will get back to you soon.",
      });

      reset({});
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Unable to send your message right now.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4">
      <CardBody>
        <h3 className="text-button-gpt font-semibold">Get in Touch</h3>
        <h2 className="md:text-3xl text-5xl lg:text-5xl font-semibold mt-4 mb-4 ">
          We're Here to Help
        </h2>
        <p className=" text-secondary-text">
          Have questions or need assistance? Our team is here to make sure you
          have the best experience possible with Vuior. For general inquiries,
          partnership opportunities, or customer support, feel free to reach out
          to us anytime. We're always ready to help!
        </p>
        <Divider className="my-10" />
        <Form {...form}>
          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    <Input
                      variant="bordered"
                      size="md"
                      label="Name"
                      errorMessage={errors.name?.message}
                      isInvalid={!!errors.name?.message}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <FormControl>
                      <Input
                        variant="bordered"
                        size="md"
                        type="email"
                        label="Email"
                        errorMessage={errors.email?.message}
                        isInvalid={!!errors.email?.message}
                        {...field}
                      />
                    </FormControl>
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CurrencyFormat
                      customInput={Input}
                      label="Phone Number"
                      isInvalid={!!errors.phoneNumber}
                      labelPlacement="outside"
                      onValueChange={(value) => {
                        setValue("phoneNumber", value.formattedValue); // Set the float value or an empty string if undefined
                      }}
                      {...register("phoneNumber", {
                        required: "Please provide the phone number",
                      })}
                      radius="sm"
                      type="text"
                      variant="bordered"
                      errorMessage={
                        !!errors.phoneNumber &&
                        "Please provide the phone number"
                      }
                      format="+1 (###) ###-####"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Subject</FormLabel> */}
                  <FormControl>
                    <Input
                      variant="bordered"
                      size="md"
                      label="Subject"
                      errorMessage={errors.subject?.message}
                      isInvalid={!!errors.subject?.message}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Message</FormLabel> */}
                  <FormControl>
                    <Textarea
                      variant="bordered"
                      size="lg"
                      label="Message"
                      errorMessage={errors.message?.message}
                      isInvalid={!!errors.message?.message}
                      {...field}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
            <Input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                // field.onChange(e.target.files);
                handleFileUpload(e);
              }}
              // isInvalid={!!errors.file?.message}
            />

            <Checkbox {...register("agreeToPromotionalMessages")}>
              <p className="text-xs">
                By checking this box I agree to receive automated promotional
                messages. This agreement is not a condition of purchase. Message
                frequency varies. Reply STOP to opt out or HELP for help.
                Message & data rates apply.{" "}
                <NavLink
                  className={"underline text-button-gpt"}
                  to={"/terms-of-service"}
                >
                  Terms
                </NavLink>{" "}
                and{" "}
                <NavLink
                  className={"underline text-button-gpt"}
                  to={"/privacy-policy"}
                >
                  privacy policy
                </NavLink>
                .
              </p>
            </Checkbox>
            <Button
              radius="sm"
              className="text-white font-bold mt-5 w-fit ml-auto hover:bg-button-gpt-hover bg-button-gpt"
              isLoading={isLoading}
              variant="faded"
              type="submit"
            >
              Send message
            </Button>
          </form>
        </Form>
      </CardBody>
    </Card>
  );
};

export default ContactForm;
