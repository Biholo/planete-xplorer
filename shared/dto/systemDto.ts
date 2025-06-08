import { Serialize } from "@shared/types/Serialize";
import { z } from "zod";

export const BasicSystemSchema = z.object({
  id: z.string(),
  name: z.string(),
  mainStar: z.string().optional(),
  distanceFromEarth: z.number().optional(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type System = z.infer<typeof BasicSystemSchema>;
export type SystemDto = Serialize<System>;

export const CreateSystem = z.object({
  name: z.string().min(1, "Le nom est requis"),
  mainStar: z.string().optional(),
  distanceFromEarth: z.number().positive("La distance doit être positive").optional(),
  description: z.string().optional(),
});

export type CreateSystem = z.infer<typeof CreateSystem>;
export type CreateSystemDto = Serialize<CreateSystem>;

export const UpdateSystem = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  mainStar: z.string().optional(),
  distanceFromEarth: z.number().positive("La distance doit être positive").optional(),
  description: z.string().optional(),
});

export type UpdateSystem = z.infer<typeof UpdateSystem>;
export type UpdateSystemDto = Serialize<UpdateSystem>;

export const GetAllSystems = z.object({
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

export type GetAllSystems = z.infer<typeof GetAllSystems>;
export type GetAllSystemsDto = Serialize<GetAllSystems>; 