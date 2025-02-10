// /* eslint-disable react-hooks/rules-of-hooks */
// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// // import { NavLink } from "react-router-dom"
// import { Input } from "@nextui-org/input";
// import { Button } from "@nextui-org/button";
// import { useState } from "react";
// import { useToast } from "../hooks/use-toast";
// import { useAuth } from "../hooks/useAuth";
// import { ResetPasswordSchema } from "../lib/validations";
// import { FormField, Form, FormItem, FormControl } from "../components/ui/form";
// // import { sendPasswordResetEmail } from "firebase/auth";
// import {
//   // useNavigate,
//   useLocation,
// } from "react-router-dom";

// type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
// const ResetPassword = () => {
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const { user, resetPassword } = useAuth();
//   const { toast } = useToast();

//   // const navigate = useNavigate()
//   const location = useLocation();

//   const queryParams: any = new URLSearchParams(location.search);
//   const oobCode: any = queryParams.get("oobCode");

//   if (!oobCode) {
//     //    setError("Invalid password reset link.")
//     return <div>error 500</div>;
//   }

//   const form = useForm<ResetPasswordFormData>({
//     resolver: zodResolver(ResetPasswordSchema),
//     defaultValues: {
//       email: user?.email || "",
//     },
//   });

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = form;

//   const handleReset = (values: ResetPasswordFormData) => {
//     setIsLoading(true);
//     try {
//       resetPassword(values?.password, oobCode);
//       setTimeout(() => {
//         setIsLoading(false);
//         console.log(values);
//         toast({
//           title: "Email Sent",
//           description: "Check your email to reset your password",
//         });
//       }, 3000);
//     } catch (error) {
//       console.log(error);
//       toast({
//         title: "Error",
//         description: "Unable to sent email right now",
//         variant: "destructive",
//       });
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full flex-col flex items-center justify-center ">
//       <div className="mb-5 w-full">
//         <h2 className="md:text-3xl text-5xl md:mb-2 font-semibold mb-5">
//           Reset Password
//         </h2>
//         <p className="text-secondary-text mb-5 text-sm">
//           Enter new password for your account.
//         </p>
//       </div>
//       <Form {...form}>
//         <form
//           className="flex w-full flex-col gap-8 lg:gap-5"
//           onSubmit={handleSubmit(handleReset)}
//         >
//           <FormField
//             control={control}
//             name="password"
//             render={({ field }) => (
//               <FormItem className=" relative  items-center lg:gap-3">
//                 {/* <FormLabel>Email</FormLabel> */}
//                 <div className="w-full ">
//                   <FormControl>
//                     <Input
//                       variant="bordered"
//                       size="md"
//                       type="password"
//                       label="New Password"
//                       errorMessage={errors?.password?.message}
//                       isInvalid={!!errors?.password?.message}
//                       {...field}
//                     />
//                   </FormControl>
//                   {/* <FormMessage className="mt-1.5 absolute text-xs" /> */}
//                 </div>
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={control}
//             name="confirmPassword"
//             render={({ field }) => (
//               <FormItem className=" relative  items-center lg:gap-3">
//                 {/* <FormLabel>Email</FormLabel> */}
//                 <div className="w-full ">
//                   <FormControl>
//                     <Input
//                       variant="bordered"
//                       size="md"
//                       type="password"
//                       label=" Confirm Password"
//                       errorMessage={errors?.confirmPassword?.message}
//                       isInvalid={!!errors?.confirmPassword?.message}
//                       {...field}
//                     />
//                   </FormControl>
//                   {/* <FormMessage className="mt-1.5 absolute text-xs" /> */}
//                 </div>
//               </FormItem>
//             )}
//           />

//           <div className="flex items-center justify-between mt-10">
//             {/* <div>
//               If password is reset.
//               <NavLink
//                 to={"/login"}
//                 className={
//                   "text-button-gpt font-semibold hover:underline transition-all"
//                 }
//               >
//                 {" "}
//                 Login here
//               </NavLink>
//             </div> */}
//             <Button
//               radius="sm"
//               className="text-white font-bold hover:bg-button-gpt-hover bg-button-gpt"
//               isLoading={isLoading}
//               variant="faded"
//               type="submit"
//             >
//               Reset Password
//             </Button>
//           </div>
//         </form>
//       </Form>
//       {/* <div className="flex mt-10 items-center gap-2">
//         <p>
//           Login{" "}
//           <NavLink
//             className={
//               "text-button-gpt font-bold hover:underline transition-all"
//             }
//             to={"/create-account"}
//           >
//             Here
//           </NavLink>
//         </p>
//       </div> */}
//     </div>
//   );
// };

// export default ResetPassword;
