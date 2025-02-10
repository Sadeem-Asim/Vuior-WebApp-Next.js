/* eslint-disable @typescript-eslint/no-explicit-any */
import { useForm } from "react-hook-form";
import { useNavigate, NavLink } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { RegisterUserSchema } from "../lib/validations";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import { Form, FormControl, FormField, FormItem } from "../components/ui/form";
import { Checkbox, Image } from "@nextui-org/react";
import CurrencyFormat from "react-currency-format";
import {
  sendEmailVerificationOTP,
  verifyOTP,
} from "@/lib/firebaseClientUniversalFunctions";

type RegisterUserFormData = z.infer<typeof RegisterUserSchema>;

const RegisterUser = () => {
  const { registerUser } = useAuth();

  const { toast } = useToast();

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // New state to toggle between the registration form and the OTP form.
  const [showOTPForm, setShowOTPForm] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<RegisterUserFormData>({
    resolver: zodResolver(RegisterUserSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dob: "",
      agreeToPromotionalMessages: true,
    },
    mode: "onChange",
  });
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = form;
  const toggleVisibility = () => setIsVisible(!isVisible);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [dob, setDob] = useState("");

  const verifyOtp = async () => {
    try {
      if (enteredOtp.length !== 6) {
        toast({
          title: "Error",
          description: `Unable to verify Otp`,
          variant: "destructive",
        });
        return;
      }
      const isValid = await verifyOTP(email, enteredOtp);
      console.log(isValid);
      if (isValid.success) {
        registerUser(
          email,
          password,
          firstName,
          lastName,
          phoneNumber,
          timeZone,
          dob
        ).then(() => {
          toast({
            title: "Account Created Successfully.",
            description: "Use your email and password to login again anytime.",
          });
          navigate("/dashboard", { replace: true });
        });
      } else {
        toast({
          title: "Error",
          description: `Unable to Verify Otp. Plz try again`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const onSubmit = async (values: RegisterUserFormData) => {
    const userAge = calculateAge(values.dob);
    console.log(userAge);

    if (userAge < 18) {
      toast({
        title: "Age Restriction",
        description: "You must be at least 18 years old to register.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendEmailVerificationOTP(
        values.email,
        values.firstName
      );

      const timeZone: any = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setEmail(values.email);
      setPassword(values.password);
      setFirstName(values.firstName);
      setLastName(values.lastName);
      setTimeZone(timeZone);
      setPhoneNumber(values.phoneNumber);
      setDob(values.dob);

      if (!result.success) {
        console.error("Failed to send OTP:", result.error);
        toast({
          title: "Error",
          description: `Error:${result.error}`,
        });
      } else {
        toast({
          title: "Success",
          description: `Otp has sent successfully to your email`,
        });
        setShowOTPForm(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast({
        title: "Error",
        description: `Unable to create account right now.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="md:min-h-screen gap-5 lg:gap-10 md:mt-5 lg:mt-16 px-4 w-[95vw] grid md:grid-cols-2">
      {/* Left-side image */}
      <div className="relative hidden md:block">
        <Image
          src="/assets/brand/signup.jpeg"
          alt="Customer service representative"
          className="object-contain xl:object-cover h-[90vh]"
        />
      </div>

      <div className="flex flex-col items-center justify-center w-full ">
        {/* Conditionally render the registration form or the OTP form */}
        {!showOTPForm ? (
          <>
            <div className="w-full mb-5">
              <h2 className="text-4xl font-semibold md:text-3xl md:mb-2 md:mt-5">
                Create Account
              </h2>
              <p className="mb-3 text-xs text-secondary-text">
                Get access to exclusive features by creating an account
              </p>
            </div>
            <Form {...form}>
              <form
                className="flex flex-col w-full gap-5 lg:gap-5"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="grid gap-5 md:grid-cols-2 md:gap-2">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="relative items-center">
                        <div className="w-full">
                          <FormControl>
                            <Input
                              variant="bordered"
                              size="md"
                              type="name"
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
                      <FormItem className="relative items-center">
                        <div className="w-full">
                          <FormControl>
                            <Input
                              variant="bordered"
                              size="md"
                              type="name"
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

                <div className="grid gap-5 md:grid-cols-2 md:gap-2">
                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="relative items-center">
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
                    name="password"
                    render={({ field }) => (
                      <FormItem className="relative items-center lg:gap-3">
                        <div className="w-full">
                          <FormControl>
                            <Input
                              variant="bordered"
                              size="md"
                              label="Password"
                              errorMessage={errors.password?.message}
                              isInvalid={!!errors.password?.message}
                              {...field}
                              endContent={
                                <button
                                  className="focus:outline-none"
                                  type="button"
                                  onClick={toggleVisibility}
                                  aria-label="toggle password visibility"
                                >
                                  {isVisible ? (
                                    <EyeOpenIcon className="text-2xl pointer-events-none text-default-400" />
                                  ) : (
                                    <EyeClosedIcon className="text-2xl pointer-events-none text-default-400" />
                                  )}
                                </button>
                              }
                              type={isVisible ? "text" : "password"}
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="relative items-center">
                      <div className="w-full">
                        <FormControl>
                          <CurrencyFormat
                            customInput={Input}
                            variant="bordered"
                            size="md"
                            label="Phone number"
                            errorMessage={errors.phoneNumber?.message}
                            isInvalid={!!errors.phoneNumber?.message}
                            format="+1 (###) ###-####"
                            {...(field as any)}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          variant="bordered"
                          size="md"
                          type="date"
                          label="Date of Birth"
                          errorMessage={errors.dob?.message}
                          isInvalid={!!errors.dob?.message}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Checkbox {...register("agreeToPromotionalMessages")}>
                  <p className="text-xs">
                    By checking this box I agree to receive automated
                    promotional messages. This agreement is not a condition of
                    purchase. Message frequency varies. Reply STOP to opt out or
                    HELP for help. Message & data rates apply.{" "}
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

                <div className="flex items-center justify-between">
                  <div></div>
                  <Button
                    radius="sm"
                    className="font-bold text-white hover:bg-button-gpt-hover bg-button-gpt"
                    isLoading={isLoading}
                    variant="faded"
                    type="submit"
                  >
                    Register
                  </Button>
                </div>
              </form>
            </Form>

            <div className="flex items-center gap-2 mt-5">
              <p>Already have an account?</p>
              <NavLink
                to={"/login"}
                className="text-button-gpt font-semibold hover:underline transition-all"
              >
                Login here
              </NavLink>
            </div>
          </>
        ) : (
          // OTP Verification Form
          <>
            <div className="w-full mb-5">
              <h2 className="text-4xl font-semibold md:text-3xl md:mb-2 md:mt-5">
                Verify OTP
              </h2>
              <p className="mb-3 text-xs text-secondary-text">
                Please enter the OTP codes sent to your phone and email.
              </p>
            </div>
            <div className="flex flex-col w-full gap-5">
              <Input
                variant="bordered"
                size="md"
                label="Email OTP"
                placeholder="Enter email OTP"
                value={enteredOtp}
                onValueChange={setEnteredOtp}
              />
              <Button
                radius="sm"
                className="font-bold text-white hover:bg-button-gpt-hover bg-button-gpt"
                // onClick functions can be added here later.
                onPress={() => {
                  verifyOtp();
                }}
              >
                Verify OTPs
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterUser;
