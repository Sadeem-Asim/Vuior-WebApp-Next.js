import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { ResetPasswordSchema } from "../lib/validations";
import {
  FormField,
  Form,
  FormItem,
  FormControl,
  FormMessage,
} from "../components/ui/form";

type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
import {
  sendEmailVerificationOTP,
  verifyOTP,
} from "@/lib/firebaseClientUniversalFunctions";

const ForgetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // State to track email, OTP, and new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: user?.email || "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // Step 1: Send OTP to Email
  const handleReset = async (values: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const res = await sendEmailVerificationOTP(
        values.email,
        values.email,
        true
      );
      if (res.success === false) {
        toast({
          title: "Error",
          description: res.error,
          variant: "destructive",
        });
      } else {
        setEmail(values.email);
        toast({
          title: "Email Sent",
          description: "Enter the OTP sent to your email.",
        });
        setShowOTPInput(true); // Show OTP input field
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast({
        title: "Error",
        description: "Unable to send email right now",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleOTPVerification = async () => {
    setIsLoading(true);
    try {
      const isValid = await verifyOTP(email, otp);
      if (isValid) {
        toast({
          title: "OTP Verified",
          description: "Enter your new password.",
        });
        setShowNewPasswordFields(true);
      } else {
        toast({
          title: "Error",
          description: "Invalid OTP. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast({
        title: "Error",
        description: "Failed to verify OTP.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Step 3: Reset Password
  const handlePasswordReset = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const apiUrl = "https://resetpassword-5risxnudva-uc.a.run.app";
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          newPassword: newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: "Password Reset Successful",
          description: "You can now log in with your new password.",
        });
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login page
        }, 2000);
      } else {
        const data = await response.json();
        toast({
          title: "Error",
          description: data.message || "Failed to reset password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        title: "Error",
        description: "An error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="mb-5 w-full">
        <h2 className="md:text-3xl text-5xl md:mb-2 font-semibold mb-5">
          Password Recovery
        </h2>
        <p className="text-secondary-text mb-5 text-sm">
          Please enter your email, and we'll send you a reset link.
        </p>
      </div>

      {!showOTPInput && !showNewPasswordFields && (
        <Form {...form}>
          <form
            className="flex w-full flex-col gap-8 lg:gap-5"
            onSubmit={handleSubmit(handleReset)}
          >
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative items-center lg:gap-3">
                  <FormControl>
                    <Input
                      variant="bordered"
                      size="md"
                      type="text"
                      label="Email"
                      isInvalid={!!errors.email?.message}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage>{errors.email?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button
              radius="sm"
              className="text-white font-bold hover:bg-button-gpt-hover bg-button-gpt py-10"
              isLoading={isLoading}
              variant="faded"
              type="submit"
            >
              Send Email
            </Button>
          </form>
        </Form>
      )}

      {showOTPInput && !showNewPasswordFields && (
        <div className="w-full">
          <Input
            variant="bordered"
            size="md"
            type="text"
            label="Enter OTP"
            placeholder="6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button
            radius="sm"
            className="text-white font-bold hover:bg-button-gpt-hover bg-button-gpt mt-5"
            isLoading={isLoading}
            onClick={handleOTPVerification}
          >
            Verify OTP
          </Button>
        </div>
      )}

      {showNewPasswordFields && (
        <div className="w-full flex flex-col gap-5">
          <Input
            variant="bordered"
            size="md"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            variant="bordered"
            size="md"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            radius="sm"
            className="text-white font-bold hover:bg-button-gpt-hover bg-button-gpt mt-5"
            isLoading={isLoading}
            onClick={handlePasswordReset}
          >
            Reset Password
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgetPassword;
