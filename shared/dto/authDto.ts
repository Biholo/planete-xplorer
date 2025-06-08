import { Serialize } from "@shared/types/Serialize";
import { z } from "zod";

export const Login = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type Login = z.infer<typeof Login>;
export type LoginDto = Serialize<Login>;

export const Register = z.object({
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
  confirmPassword: z
    .string()
    .min(1, "La confirmation du mot de passe est requise"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  civility: z.string().min(1, "La civilité est requise"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  acceptNewsletter: z.boolean().optional(),
  acceptTerms: z.boolean().optional(),
  acceptPrivacy: z.boolean().optional(),
});

export type Register = z.infer<typeof Register>;
export type RegisterDto = Serialize<Register>;

export const ResetPassword = z
  .object({
    token: z.string().min(1, "Le token est requis"),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(
        /[A-Z]/,
        "Le mot de passe doit contenir au moins une lettre majuscule"
      )
      .regex(
        /[a-z]/,
        "Le mot de passe doit contenir au moins une lettre minuscule"
      )
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
      .regex(
        /[^A-Za-z0-9]/,
        "Le mot de passe doit contenir au moins un caractère spécial"
      ),
    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type ResetPassword = z.infer<typeof ResetPassword>;
export type ResetPasswordDto = Serialize<ResetPassword>;

export const Token = z.object({
  token: z.string(),
});

export type Token = z.infer<typeof Token>;
export type TokenDto = Serialize<Token>;

export const AuthResponse = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
});

export type AuthResponse = z.infer<typeof AuthResponse>;
export type AuthResponseDto = Serialize<AuthResponse>;
