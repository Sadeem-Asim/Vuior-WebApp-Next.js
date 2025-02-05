import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const RegisterUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  phoneNumber: z.string().trim().min(17, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  agreeToPromotionalMessages: z.boolean().optional(),
});

export const ResetPasswordSchema = z.object({
  email: z.string().email(),
  // password: z.string().email(),
  // confirmPassword: z.string().email(),
});

export const ContactUsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  subject: z.string().min(1, "Subject is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  message: z.string().min(1, "Message is required"),
  agreeToPromotionalMessages: z.boolean().optional(),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "File is required")
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ["application/pdf", "application/msword"].includes(file.type)
        ),
      "Only PDF or Word documents are allowed"
    ),
});

export const ConsultationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
  date: z.date({
    required_error: "Date is required.",
  }),
  timeSlot: z.string().min(1, "Time slot is required"),

  agreeToPromotionalMessages: z.boolean().optional(),
  phoneNumber: z.string().min(1, "Phone number is required."),
});

// import { z } from 'zod'

export const JobApplicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  jobTitle: z.string().min(1, "Job Title is required"),
  email: z.string().email(),
  phoneNumber: z.string().min(1, "Phone number is required"),
  agreeToPromotionalMessages: z.boolean().optional(),
  date: z.date({
    required_error: "Date is required.",
  }),
  timeSlot: z.string().min(1, "Time slot is required"),
  file: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "File is required")
    .refine(
      (files) =>
        Array.from(files).every((file) =>
          ["application/pdf", "application/msword"].includes(file.type)
        ),
      "Only PDF or Word documents are allowed"
    ),
});
