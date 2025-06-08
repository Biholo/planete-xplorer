import { Serialize } from "@shared/types/Serialize";
import { z } from "zod";
export enum UserRole {
  ADMIN = "ROLE_ADMIN",
  USER = "ROLE_USER",
}

export const BasicUserSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  password: z.string().optional(),
  phone: z.string().optional(),
  civility: z.string().optional(),
  roles: z.array(z.nativeEnum(UserRole)),
  birthDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof BasicUserSchema> & {
};

export const User: z.ZodType<User> = BasicUserSchema.extend({
});
export type UserDto = Serialize<User>;

export const GetAllUsers = z.object({
  page: z
    .string()
    .min(1, "Le numéro de page doit être supérieur à 0")
    .optional(),
  limit: z
    .string()
    .min(1, "Le nombre d'éléments par page doit être supérieur à 0")
    .optional(),
  search: z.string().optional(),
});

export type GetAllUsers = z.infer<typeof GetAllUsers>;
export type GetAllUsersDto = Serialize<GetAllUsers>;

export const RequestPasswordReset = z.object({
  email: z.string().email("Format d'email invalide"),
});

export type RequestPasswordReset = z.infer<typeof RequestPasswordReset>;
export type RequestPasswordResetDto = Serialize<RequestPasswordReset>;

export const UpdateUser = z.object({
  email: z.string().email("Format d'email invalide"),
  firstName: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  lastName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  phone: z
    .string()
    .min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  civility: z.string().min(1, "La civilité est requise"),
  birthDate: z.string().min(1, "La date de naissance est requise"),
  acceptNewsletter: z.boolean().optional(),
});

export type UpdateUser = z.infer<typeof UpdateUser>;
export type UpdateUserDto = Serialize<UpdateUser>;
