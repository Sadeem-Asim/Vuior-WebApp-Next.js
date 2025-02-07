/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { JobApplicationSchema } from "../lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../components/ui/form";
import { Checkbox, Input, Select, SelectItem } from "@nextui-org/react";
import { useToast } from "../hooks/use-toast";
// import emailjs from "@emailjs/browser";
import { NavLink } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../components/ui/calendar";
import axios from "axios";
import { storage } from "../lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useOutletContext } from "react-router-dom";
import { JobDescription } from "../data/index";

type JobApplicationData = z.infer<typeof JobApplicationSchema>;

const JobApplication = () => {
  const job = useOutletContext<JobDescription>();

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [uDoc, setUDoc] = useState<any>(null);
  const form = useForm<JobApplicationData>({
    resolver: zodResolver(JobApplicationSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      agreeToPromotionalMessages: true,
      phoneNumber: "",
      timeSlot: "",
      date: new Date(),
    },
  });
  // const fileRef = form.register("file");

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;
  const handleFileUpload = (event: any) => {
    setUDoc(event.target.files[0]);
  };

  const onSubmit = async (values: JobApplicationData) => {
    console.log(values);
    setIsLoading(true);
    const docRef = ref(storage, `docs/${uDoc.name}`);
    const snapshot = await uploadBytes(docRef, uDoc);
    console.log("Uploaded a doc!");
    // Get the download URL
    const docUrl = await getDownloadURL(snapshot.ref);
    console.log("doc URL:", docUrl);
    console.log("values: ", values);
    setIsLoading(true);
    const selectedDate = format(values.date, "PPP");

    const formData = {
      subject: `New Job Application Received ${values.email}`,
      jobTitle: `${job.title}`,
      name: `${values.firstName} ${values.lastName}`,
      email: `${values.email}`,
      phone: values.phoneNumber,
      selectedDate: selectedDate,
      timeSlot: values.timeSlot,
      agreeToPromotionalMessages: `${
        values.agreeToPromotionalMessages ? "Agreed" : "Not Agreed"
      }`,
    };

    try {
      const accessKey = "C63SwSugFYkrclqIedXCPkaGoyEh8MIEkNRO";
      const channelId = "367dbe7b-7e2b-5be1-a4c7-6327128b7b6b";
      const workspaceId = "f8f5bb9b-7243-48d8-9bcc-29b3792a27aa";
      const email = "info@vuior.com";
      const url = `https://api.bird.com/workspaces/${workspaceId}/channels/${channelId}/messages`;
      console.log("formData.file:", values.file);

      const data = {
        receiver: {
          contacts: [
            {
              identifierValue: email,
            },
          ],
        },
        body: {
          type: "html",
          html: {
            metadata: {
              subject: `Resume For Job Application ${formData.email}`,
            },
            html: `
            <p>New job application received!</p>
            <ul>
              <li><strong>Name:</strong> ${formData.name}</li>
              <li><strong>Email:</strong> ${formData.email}</li>
              <li><strong>Job Title:</strong> ${formData.jobTitle}</li>

              <li><strong>Phone:</strong> ${formData.phone}</li>
              <li><strong>Date:</strong> ${formData.selectedDate}</li>
              <li><strong>Time Slot:</strong> ${formData.timeSlot}</li>
              <li><strong>Promotional Messages:</strong> ${formData.agreeToPromotionalMessages}</li>
            </ul>
            <div style="width:500px; background-color:#10a37f; text-align:center; justify-content:center; color:white; border-radius:05px;">
              <a href="${docUrl}" style="color:white;">Click Here to Download Resume</a>
            </div>
`,
            text: `
              New job application received!
              Name: ${formData.name}
              Job Title: ${formData.jobTitle}
              Email: ${formData.email}
              Phone: ${formData.phone}
              Date: ${formData.selectedDate}
              Time Slot: ${formData.timeSlot}
              Promotional Messages: ${formData.agreeToPromotionalMessages}
              Resume: ${docUrl}
`,
          },
        },
      };

      const headers = {
        Authorization: `AccessKey ${accessKey}`,
        "Content-Type": "application/json",
      };

      axios
        .post(url, data, { headers })
        .then((response) => {
          console.log("Email sent successfully:", response.data);
        })
        .catch((error) => {
          console.log("madar", error);
          console.error(
            "Error sending email:",
            error.response?.data || error.message
          );
        });
      setIsLoading(false);
      toast({
        title: "Success",
        description: "Application Submitted",
      });
      form.reset();
    } catch (error) {
      console.log("maachi", error);
      toast({
        title: "Error",
        description: "Unable to submit application",
        variant: "destructive",
      });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full ">
      <div className="w-full mb-5">
        <h2 className="mb-5 text-4xl font-semibold md:text-3xl md:mb-2">
          Details about you
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex flex-col w-full gap-8 lg:gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="relative items-center ">
                  <div className="w-full">
                    <FormControl>
                      <Input
                        variant="bordered"
                        size="md"
                        type="firstName"
                        label="First Name"
                        errorMessage={errors.firstName?.message}
                        isInvalid={!!errors.firstName?.message}
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="relative items-center ">
                  <div className="w-full">
                    <FormControl>
                      <Input
                        variant="bordered"
                        size="md"
                        type="lastName"
                        label="Last Name"
                        errorMessage={errors.lastName?.message}
                        isInvalid={!!errors.lastName?.message}
                        {...field}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative items-center ">
                <div className="w-full">
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
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="relative items-center ">
                <div className="w-full">
                  <FormControl>
                    <Input
                      variant="bordered"
                      size="md"
                      label="Phone Number"
                      errorMessage={errors.phoneNumber?.message}
                      isInvalid={!!errors.phoneNumber?.message}
                      {...field}
                    />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="resume-upload">Upload Resume</FormLabel>{" "}
                <FormControl>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => {
                      field.onChange(e.target.files);
                      handleFileUpload(e);
                    }}
                    isInvalid={!!errors.file?.message}
                    aria-label="Upload your resume"
                  />
                </FormControl>
                <FormMessage>{errors.file?.message}</FormMessage>
              </FormItem>
            )}
          />

          <Select
            {...register("timeSlot")}
            variant="bordered"
            size="lg"
            placeholder="Select a time slot"
            errorMessage={errors.timeSlot?.message}
            isInvalid={!!errors.timeSlot?.message}
          >
            <SelectItem key="Morning 6-11am">Morning 6-11am</SelectItem>
            <SelectItem key="Afternoon 12-6pm">Afternoon 12-6pm</SelectItem>
            <SelectItem key="Evening 7-11pm">Evening 7-11pm</SelectItem>
          </Select>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="bordered"
                        size="lg"
                        disableRipple
                        className={cn(
                          " pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="w-4 h-4 ml-auto opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Checkbox {...register("agreeToPromotionalMessages")}>
            <p className="text-xs">
              By checking this box I agree to receive automated promotional
              messages. This agreement is not a condition of purchase. Message
              frequency varies. Reply STOP to opt out or HELP for help. Message
              & data rates apply.
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
          <div className="flex items-center justify-between mt-10">
            <div></div>

            <Button
              radius="sm"
              className="font-bold text-white hover:bg-button-gpt-hover bg-button-gpt"
              isLoading={isLoading}
              variant="faded"
              type="submit"
              aria-label="Submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JobApplication;
