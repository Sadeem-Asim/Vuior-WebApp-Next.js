import { useNavigate, NavLink } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useToast } from "../hooks/use-toast";
import { useAuth } from "../hooks/useAuth";
import { LoginSchema } from "../lib/validations";
import { FormField, FormItem, FormControl, Form } from "../components/ui/form";
import { Image } from "@nextui-org/react";
import { googleProvider } from "@/lib/firebaseConfig";
// import { auth, googleProvider } from "@/lib/firebaseConfig";

// import { auth, provider } from "../lib/firebase"; // Firebase setup
// import { signInWithPopup } from "firebase/auth";

type LoginFormData = z.infer<typeof LoginSchema>;

const LoginPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login, handleGoogleSignIn } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  // Regular email/password login
  const handleLogin = async (values: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log(values);
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await login(values.email, values.password);
      toast({ title: "Success", description: "Login Successful" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Unable to login right now",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sign-In function
  const handleGoogleSignInForm = async () => {
    setIsLoading(true);
    try {
      // const result = await signInWithPopup(auth, googleProvider);
      // console.log("Google User: ", result.user);
      await handleGoogleSignIn(googleProvider);
      setIsLoading(false);

      toast({ title: "Success", description: "Google Sign-In Successful" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setIsLoading(false);

      console.error("Google Sign-In Error: ", error);
      toast({
        title: "Error",
        description: "Google Sign-In Failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className="md:min-h-screen gap-5 lg:gap-10 md:mt-5 lg:mt-16 px-4 w-[95vw] grid md:grid-cols-2">
      <div className="w-full flex-col flex items-center justify-center">
        <div className="mb-5 w-full">
          <h2 className="md:text-3xl text-5xl md:mb-2 font-semibold mb-5">
            Login
          </h2>
          <p className="text-secondary-text mb-5 text-xs">
            Welcome to Vuior, please put your login credentials below to start
            using the app
          </p>
        </div>

        <Form {...form}>
          <form
            className="flex w-full flex-col gap-8 lg:gap-5"
            onSubmit={handleSubmit(handleLogin)}
          >
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="relative items-center lg:gap-3">
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
                <FormItem className="relative items-center">
                  <div className="w-full col-span-4">
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
                              <EyeOpenIcon className="text-2xl text-default-400 pointer-events-none" />
                            ) : (
                              <EyeClosedIcon className="text-2xl text-default-400 pointer-events-none" />
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
            <div className="flex items-center justify-between mt-10">
              <NavLink
                to={"/forget-password"}
                className="text-button-gpt font-semibold hover:underline transition-all"
              >
                Forgot Password?
              </NavLink>
              <div className="flex flex-row gap-5">
                <Button
                  radius="sm"
                  className="text-white font-bold hover:bg-button-gpt-hover bg-button-gpt"
                  isLoading={isLoading}
                  variant="faded"
                  type="submit"
                >
                  Login
                </Button>
                <Button
                  radius="sm"
                  className="text-white font-bold hover:bg-button-gpt-hover bg-button-gpt"
                  variant="faded"
                  onPress={handleGoogleSignInForm}
                  // className="mt-5 text-white font-bold bg-red-500 hover:bg-red-600"
                >
                  Sign in with Google
                </Button>
              </div>
            </div>
          </form>
        </Form>

        <div className="flex mt-10 items-center gap-2">
          <p>Don't have an account?</p>
          <NavLink
            className="text-button-gpt font-semibold hover:underline transition-all"
            to={"/create-account"}
          >
            Create Account
          </NavLink>
        </div>
      </div>
      <div className="relative hidden md:block">
        <Image
          src="/assets/brand/login.jpeg"
          alt="Customer service representative"
          className="object-contain xl:object-cover h-[90vh]"
        />
      </div>
    </div>
  );
};

export default LoginPage;
