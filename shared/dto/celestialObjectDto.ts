import { Serialize } from "@shared/types/Serialize";
import { z } from "zod";

export const BasicCelestialObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.string(),
  radius: z.number().optional(),
  mass: z.number().optional(),
  distanceFromSun: z.number().optional(),
  orbitalPeriod: z.number().optional(),
  rotationPeriod: z.number().optional(),
  temperature: z.number().optional(),
  discoveryDate: z.string().optional(),
  discoverer: z.string().optional(),
  systemId: z.string().optional(),
  categoryId: z.string(),
  creatorId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CelestialObject = z.infer<typeof BasicCelestialObjectSchema>;
export type CelestialObjectDto = Serialize<CelestialObject>;

export const CreateCelestialObject = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  type: z.string().min(1, "Le type est requis"),
  radius: z.number().positive("Le rayon doit être positif").optional(),
  mass: z.number().positive("La masse doit être positive").optional(),
  distanceFromSun: z.number().positive("La distance doit être positive").optional(),
  orbitalPeriod: z.number().positive("La période orbitale doit être positive").optional(),
  rotationPeriod: z.number().positive("La période de rotation doit être positive").optional(),
  temperature: z.number().optional(),
  discoveryDate: z.string().optional(),
  discoverer: z.string().optional(),
  systemId: z.string().optional(),
  categoryId: z.string().min(1, "La catégorie est requise"),
});

export type CreateCelestialObject = z.infer<typeof CreateCelestialObject>;
export type CreateCelestialObjectDto = Serialize<CreateCelestialObject>;

export const UpdateCelestialObject = z.object({
  name: z.string().min(1, "Le nom est requis").optional(),
  description: z.string().optional(),
  type: z.string().min(1, "Le type est requis").optional(),
  radius: z.number().positive("Le rayon doit être positif").optional(),
  mass: z.number().positive("La masse doit être positive").optional(),
  distanceFromSun: z.number().positive("La distance doit être positive").optional(),
  orbitalPeriod: z.number().positive("La période orbitale doit être positive").optional(),
  rotationPeriod: z.number().positive("La période de rotation doit être positive").optional(),
  temperature: z.number().optional(),
  discoveryDate: z.string().optional(),
  discoverer: z.string().optional(),
  systemId: z.string().optional(),
  categoryId: z.string().optional(),
});

export type UpdateCelestialObject = z.infer<typeof UpdateCelestialObject>;
export type UpdateCelestialObjectDto = Serialize<UpdateCelestialObject>;

export const GetAllCelestialObjects = z.object({
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
  categoryId: z.string().optional(),
  systemId: z.string().optional(),
  type: z.string().optional(),
});

export type GetAllCelestialObjects = z.infer<typeof GetAllCelestialObjects>;
export type GetAllCelestialObjectsDto = Serialize<GetAllCelestialObjects>; 