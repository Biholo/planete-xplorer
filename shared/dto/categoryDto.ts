import { Serialize } from "@shared/types/Serialize";
import { z } from "zod";

export const BasicCategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Category = z.infer<typeof BasicCategorySchema>;
export type CategoryDto = Serialize<Category>;

export const CreateCategory = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format de couleur invalide").optional(),
  icon: z.string().optional(),
});

export type CreateCategory = z.infer<typeof CreateCategory>;
export type CreateCategoryDto = Serialize<CreateCategory>;

export const UpdateCategory = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format de couleur invalide").optional(),
  icon: z.string().optional(),
});

export type UpdateCategory = z.infer<typeof UpdateCategory>;
export type UpdateCategoryDto = Serialize<UpdateCategory>;

export const GetAllCategories = z.object({
  page: z
    .string()
    .min(1, "Le numéro de page doit être supérieur à 0")
    .optional(),
  limit: z
    .string()
    .min(1, "Le nombre d'éléments par page doit être supérieur à 0")
    .optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type GetAllCategories = z.infer<typeof GetAllCategories>;
export type GetAllCategoriesDto = Serialize<GetAllCategories>; 