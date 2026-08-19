import { z } from "zod";

// Slug format: lowercase letters, numbers, dashes
export const slugSchema = z
  .string()
  .min(3, "Slug must be at least 3 characters long")
  .max(50, "Slug cannot exceed 50 characters")
  .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and dashes");

export const groomBrideNameSchema = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters long")
  .max(100, "Name cannot exceed 100 characters");

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format. Use international format (e.g. +919999999999)");

export const rsvpContactSchema = z.object({
  type: z.enum(["whatsapp", "phone", "email"]),
  label: z.string().min(1, "Label is required"),
  value: z.string().min(1, "Value is required"),
}).superRefine((data, ctx) => {
  if (data.type === "phone" || data.type === "whatsapp") {
    if (!/^\+?[1-9]\d{1,14}$/.test(data.value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number format. Use international format (e.g. +919999999999)",
        path: ["value"],
      });
    }
  } else if (data.type === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid email address format.",
        path: ["value"],
      });
    }
  }
});

export const creationSchema = z.object({
  id: slugSchema,
  groom: groomBrideNameSchema,
  bride: groomBrideNameSchema,
  surname: z.string().optional(),
  primarySide: z.enum(["groom", "bride"]).optional(),
  themeId: z.string().min(1, "Theme ID is required"),
});

export const configUpdateSchema = z.object({
  themeId: z.string().min(1, "Theme ID is required").optional(),
  sectionOrder: z.array(z.string()).optional(),
}).passthrough();

export const uploadMetadataSchema = z.object({
  size: z.number().max(25 * 1024 * 1024, "Payload Too Large. Maximum allowed size is 25 MB."),
  type: z.string().refine(
    (type) => [
      "image/jpeg",
      "image/png",
      "image/webp",
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/m4a",
      "audio/x-m4a",
      "audio/aac",
      "audio/ogg",
      "audio/mp4"
    ].includes(type.toLowerCase()),
    {
      message: "Unsupported Media Type. Only JPEG, PNG, WEBP images and MP3, WAV, M4A, OGG audio files are allowed."
    }
  ),
  name: z.string().min(1, "File name is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const rsvpSubmissionSchema = z.object({
  guest_name: z.string().trim().min(2, "Name must be at least 2 characters long").max(100, "Name cannot exceed 100 characters"),
  phone: z.string().trim().min(5, "Please enter a valid phone number").max(25).optional().nullable(),
  email: z.string().email("Invalid email address").or(z.string().length(0)).optional().nullable(),
  attending: z.boolean(),
  guest_count: z.number().int().min(1, "Number of guests must be at least 1").max(20, "Number of guests cannot exceed 20").default(1),
  message: z.string().max(1000, "Message cannot exceed 1000 characters").optional().nullable(),
});

export const viewSubmissionSchema = z.object({
  visitor_token: z.string().uuid("Invalid visitor token"),
});
