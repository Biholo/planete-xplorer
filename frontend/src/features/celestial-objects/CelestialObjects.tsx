"use client"

import { useGetAllCategories } from "@/api/queries/categoryQueries"
import { useCreateCelestialObject, useDeleteCelestialObject, useGetAllCelestialObjects, useUpdateCelestialObject } from "@/api/queries/celestialObjectQueries"
import { useGetAllSystems } from "@/api/queries/systemQueries"
import { Badge } from "@/components/ui/badge"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/stores/authStore"
import { UserRole } from "@shared/dto"
import { Edit, Filter, Globe, Orbit, Plus, Rocket, Save, Search, Star, Trash2, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from "react-router-dom"

interface CelestialObjectFormData {
  name: string
  type: string
  description?: string
  categoryId: string
  systemId?: string
  distanceFromSun?: number
  mass?: number
  radius?: number
  temperature?: number
  atmosphereComposition?: string
  surfaceGravity?: number
  orbitalPeriod?: number
  rotationPeriod?: number
  discoverer?: string
  discoveryDate?: string
}

export default function CelestialObjectsPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  console.log('USER:', user)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Récupérer les valeurs des filtres depuis l'URL
  const searchTerm = searchParams.get("search") || ""
  const selectedCategory = searchParams.get("category") || "all"
  const selectedSystem = searchParams.get("system") || "all"
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingObject, setEditingObject] = useState<any>(null)

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    if (!user?.roles) return false
    // Les rôles sont maintenant un tableau directement
    return Array.isArray(user.roles) && user.roles.includes(UserRole.ADMIN)
  }

  // Fonction pour mettre à jour les paramètres d'URL
  const updateSearchParams = (updates: Record<string, string | null>) => {
    const current = new URLSearchParams(searchParams.toString())
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    })
    
    setSearchParams(current)
  }

  // React Hook Form
  const createForm = useForm<CelestialObjectFormData>({
    defaultValues: {
      name: "",
      type: "",
      description: "",
      categoryId: "",
      systemId: "",
      distanceFromSun: undefined,
      mass: undefined,
      radius: undefined,
      temperature: undefined,
      atmosphereComposition: "",
      surfaceGravity: undefined,
      orbitalPeriod: undefined,
      rotationPeriod: undefined,
      discoverer: "",
      discoveryDate: "",
    }
  })

  const editForm = useForm<CelestialObjectFormData>({
    defaultValues: {
      name: "",
      type: "",
      description: "",
      categoryId: "",
      systemId: "",
      distanceFromSun: undefined,
      mass: undefined,
      radius: undefined,
      temperature: undefined,
      atmosphereComposition: "",
      surfaceGravity: undefined,
      orbitalPeriod: undefined,
      rotationPeriod: undefined,
      discoverer: "",
      discoveryDate: "",
    }
  })

  // Queries
  const { data: celestialObjects = [], isLoading, error } = useGetAllCelestialObjects({
    search: searchTerm || undefined,
    categoryId: selectedCategory && selectedCategory !== "all" ? selectedCategory : undefined,
    systemId: selectedSystem && selectedSystem !== "all" ? selectedSystem : undefined
  })
  const { data: categories = [] } = useGetAllCategories()
  const { data: systems = [] } = useGetAllSystems()

  // Mutations
  const createObjectMutation = useCreateCelestialObject()
  const updateObjectMutation = useUpdateCelestialObject()
  const deleteObjectMutation = useDeleteCelestialObject()

  const handleCreateSubmit = async (data: CelestialObjectFormData) => {
    if (!data.categoryId) {
      console.error("La catégorie est requise")
      return
    }

    try {
      const payload = {
        ...data,
        systemId: data.systemId || undefined,
      }

      await createObjectMutation.mutateAsync(payload)
      setIsAddModalOpen(false)
      createForm.reset()
      console.log("Objet céleste créé avec succès")
    } catch (error: any) {
      console.error(error.message || "Une erreur est survenue")
    }
  }

  const handleEditSubmit = async (data: CelestialObjectFormData) => {
    if (!editingObject) return
    
    if (!data.categoryId) {
      console.error("La catégorie est requise")
      return
    }

    try {
      const payload = {
        ...data,
        systemId: data.systemId || undefined,
      }

      await updateObjectMutation.mutateAsync({
        id: editingObject.id,
        celestialObject: payload
      })
      setEditingObject(null)
      editForm.reset()
      console.log("Objet céleste modifié avec succès")
    } catch (error: any) {
      console.error(error.message || "Une erreur est survenue")
    }
  }

  const handleEdit = (object: any) => {
    setEditingObject(object)
    editForm.reset({
      name: object.name || "",
      type: object.type || "",
      description: object.description || "",
      categoryId: object.categoryId || "",
      systemId: object.systemId || "",
      distanceFromSun: object.distanceFromSun || undefined,
      mass: object.mass || undefined,
      radius: object.radius || undefined,
      temperature: object.temperature || undefined,
      atmosphereComposition: object.atmosphereComposition || "",
      surfaceGravity: object.surfaceGravity || undefined,
      orbitalPeriod: object.orbitalPeriod || undefined,
      rotationPeriod: object.rotationPeriod || undefined,
      discoverer: object.discoverer || "",
      discoveryDate: object.discoveryDate || "",
    })
  }

  const handleDelete = async (objectId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet objet céleste ?")) {
      try {
        await deleteObjectMutation.mutateAsync(objectId)
        console.log("Objet céleste supprimé avec succès")
      } catch (error: any) {
        console.error(error.message || "Erreur lors de la suppression")
      }
    }
  }

  const getCategoryIcon = (categoryName: string) => {
    switch (categoryName?.toLowerCase()) {
      case "planète":
        return Globe
      case "étoile":
        return Star
      case "satellite":
        return Orbit
      case "astéroïde":
      case "comète":
        return Rocket
      default:
        return Star
    }
  }

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)
  }

  const getSystemById = (systemId: string) => {
    return systems.find(sys => sys.id === systemId)
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen flex items-center justify-center">
        <div className="text-stellar-cyan font-orbitron text-xl">Chargement des objets célestes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen flex items-center justify-center">
        <div className="text-red-400 font-orbitron text-xl">Erreur lors du chargement des objets célestes</div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-electric-blue/30 px-4 bg-nebula-blue/50 backdrop-blur-sm">
        <Separator orientation="vertical" className="mr-2 h-4 bg-electric-blue/30" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-stellar-cyan hover:text-stellar-white">
                Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-electric-blue/50" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-orbitron text-stellar-cyan">🌌 Objets Célestes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* En-tête avec actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-orbitron text-stellar-cyan">Objets Célestes</h1>
            <p className="text-stellar-white/70">Explorez et gérez votre collection d'objets célestes</p>
          </div>
          
          {isAdmin() && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="cosmic-button"
                  disabled={createObjectMutation.isPending}
                >
              <Plus className="h-4 w-4 mr-2" />
                  {createObjectMutation.isPending ? "Création..." : "Ajouter un Objet"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-nebula-blue border-electric-blue/30 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="font-orbitron text-stellar-cyan">Créer un Nouvel Objet Céleste</DialogTitle>
                  <DialogDescription className="text-stellar-white/70">
                    Ajoutez un nouvel objet céleste à votre collection
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-stellar-white">Nom *</Label>
                      <Input
                        id="name"
                        {...createForm.register("name", { required: "Le nom est requis" })}
                        className="cosmic-input"
                        placeholder="Ex: Kepler-442b"
                      />
                      {createForm.formState.errors.name && (
                        <p className="text-red-400 text-sm">{createForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-stellar-white">Type *</Label>
                      <Input
                        id="type"
                        {...createForm.register("type", { required: "Le type est requis" })}
                        className="cosmic-input"
                        placeholder="Ex: Exoplanète"
                      />
                      {createForm.formState.errors.type && (
                        <p className="text-red-400 text-sm">{createForm.formState.errors.type.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId" className="text-stellar-white">Catégorie *</Label>
                      <Select value={createForm.watch("categoryId")} onValueChange={(value) => createForm.setValue("categoryId", value)}>
                        <SelectTrigger className="cosmic-input">
                          <SelectValue placeholder="Sélectionner une catégorie" />
                        </SelectTrigger>
                        <SelectContent className="bg-nebula-blue border-electric-blue/30">
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id} className="text-stellar-white hover:bg-electric-blue/20">
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {(!createForm.watch("categoryId") && createForm.formState.isSubmitted) && (
                        <p className="text-red-400 text-sm">La catégorie est requise</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="systemId" className="text-stellar-white">Système</Label>
                      <Select value={createForm.watch("systemId")} onValueChange={(value) => createForm.setValue("systemId", value)}>
                        <SelectTrigger className="cosmic-input">
                          <SelectValue placeholder="Sélectionner un système" />
                        </SelectTrigger>
                        <SelectContent className="bg-nebula-blue border-electric-blue/30">
                          {systems.map((system) => (
                            <SelectItem key={system.id} value={system.id} className="text-stellar-white hover:bg-electric-blue/20">
                              {system.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="distanceFromSun" className="text-stellar-white">Distance du Soleil (AL)</Label>
                      <Input
                        id="distanceFromSun"
                        {...createForm.register("distanceFromSun", { 
                          valueAsNumber: true,
                          validate: value => value === undefined || value > 0 || "La distance doit être positive"
                        })}
                        type="number"
                        step="0.001"
                        className="cosmic-input"
                        placeholder="Ex: 1200"
                      />
                      {createForm.formState.errors.distanceFromSun && (
                        <p className="text-red-400 text-sm">{createForm.formState.errors.distanceFromSun.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="temperature" className="text-stellar-white">Température (K)</Label>
                      <Input
                        id="temperature"
                        {...createForm.register("temperature", { 
                          valueAsNumber: true,
                          validate: value => value === undefined || value > 0 || "La température doit être positive"
                        })}
                        type="number"
                        className="cosmic-input"
                        placeholder="Ex: 255"
                      />
                      {createForm.formState.errors.temperature && (
                        <p className="text-red-400 text-sm">{createForm.formState.errors.temperature.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discoverer" className="text-stellar-white">Découvreur</Label>
                      <Input
                        id="discoverer"
                        {...createForm.register("discoverer")}
                        className="cosmic-input"
                        placeholder="Ex: Mission Kepler"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="discoveryDate" className="text-stellar-white">Date de découverte</Label>
                      <Input
                        id="discoveryDate"
                        {...createForm.register("discoveryDate")}
                        className="cosmic-input"
                        placeholder="Ex: 2013-05-15"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-stellar-white">Description</Label>
                    <Textarea
                      id="description"
                      {...createForm.register("description")}
                      className="cosmic-input"
                      placeholder="Description de l'objet céleste..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddModalOpen(false)}
                      className="border-electric-blue/30 text-stellar-cyan hover:bg-electric-blue/20"
                      disabled={createObjectMutation.isPending}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="cosmic-button"
                      disabled={createObjectMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createObjectMutation.isPending ? "Création..." : "Créer"}
          </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Filtres et recherche */}
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="font-orbitron text-stellar-cyan flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres et Recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-stellar-white">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-stellar-white/50" />
                  <Input
                    placeholder="Nom ou type..."
                    value={searchTerm}
                    onChange={(e) => updateSearchParams({ search: e.target.value })}
                    className="cosmic-input pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stellar-white">Catégorie</label>
                <Select value={selectedCategory} onValueChange={(value) => updateSearchParams({ category: value })}>
                  <SelectTrigger className="cosmic-input">
                    <SelectValue placeholder="Toutes les catégories" />
                  </SelectTrigger>
                  <SelectContent className="bg-nebula-blue border-electric-blue/30">
                    <SelectItem value="all" className="text-stellar-white hover:bg-electric-blue/20">
                      Toutes les catégories
                    </SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        className="text-stellar-white hover:bg-electric-blue/20"
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-stellar-white">Système</label>
                <Select value={selectedSystem} onValueChange={(value) => updateSearchParams({ system: value })}>
                  <SelectTrigger className="cosmic-input">
                    <SelectValue placeholder="Tous les systèmes" />
                  </SelectTrigger>
                  <SelectContent className="bg-nebula-blue border-electric-blue/30">
                    <SelectItem value="all" className="text-stellar-white hover:bg-electric-blue/20">
                      Tous les systèmes
                    </SelectItem>
                    {systems.map((system) => (
                      <SelectItem key={system.id} value={system.id} className="text-stellar-white hover:bg-electric-blue/20">
                        {system.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  className="w-full border-electric-blue/30 text-stellar-cyan hover:bg-electric-blue/20"
                  onClick={() => {
                    updateSearchParams({ search: null, category: null, system: null })
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Résultats */}
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="font-orbitron text-stellar-cyan">Résultats ({celestialObjects.length})</CardTitle>
            <CardDescription className="text-stellar-white/70">
              Liste des objets célestes correspondant à vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="rounded-md border border-electric-blue/30 overflow-hidden min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-electric-blue/30 hover:bg-electric-blue/10">
                      <TableHead className="text-stellar-cyan font-orbitron">Nom</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron">Type</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron">Catégorie</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron">Système</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron hidden sm:table-cell">Distance (AL)</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron hidden md:table-cell">
                        Température
                      </TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron hidden lg:table-cell">Découvreur</TableHead>
                      {isAdmin() && (
                      <TableHead className="text-stellar-cyan font-orbitron">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {celestialObjects.map((object) => {
                      const category = getCategoryById(object.categoryId)
                      const system = getSystemById(object.systemId || "")
                      const IconComponent = getCategoryIcon(category?.name || "")
                      return (
                        <TableRow
                          key={object.id}
                          className="border-electric-blue/20 hover:bg-electric-blue/10 transition-colors"
                        >
                          <TableCell className="font-medium text-stellar-white">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-stellar-cyan animate-pulse"></div>
                              <span className="truncate max-w-[120px]">{object.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-stellar-white/80">
                            <span className="truncate max-w-[100px] block">{object.type || "N/A"}</span>
                          </TableCell>
                          <TableCell>
                            {category ? (
                            <Badge
                              variant="secondary"
                              className="bg-electric-blue/20 text-stellar-cyan border-electric-blue/30"
                            >
                              <IconComponent className="h-3 w-3 mr-1" />
                                <span className="hidden sm:inline">{category.name}</span>
                            </Badge>
                            ) : (
                              <span className="text-stellar-white/50">N/A</span>
                            )}
                          </TableCell>
                          <TableCell className="text-stellar-white/80">
                            <span className="truncate max-w-[120px] block">{system?.name || "N/A"}</span>
                          </TableCell>
                          <TableCell className="text-stellar-white/80 hidden sm:table-cell">
                            {object.distanceFromSun ? `${object.distanceFromSun} AL` : "Non spécifiée"}
                          </TableCell>
                          <TableCell className="text-stellar-white/80 hidden md:table-cell">
                            {object.temperature ? `${object.temperature} K` : "N/A"}
                          </TableCell>
                          <TableCell className="text-stellar-white/80 hidden lg:table-cell">
                            {object.discoverer || "N/A"}
                          </TableCell>
                          {isAdmin() && (
                          <TableCell>
                            <div className="flex items-center gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-stellar-cyan hover:text-stellar-white"
                                  onClick={() => handleEdit(object)}
                                  disabled={updateObjectMutation.isPending}
                                >
                                <Edit className="h-4 w-4" />
                              </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-400 hover:text-red-300"
                                  onClick={() => handleDelete(object.id)}
                                  disabled={deleteObjectMutation.isPending}
                                >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                          )}
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal d'édition */}
        <Dialog open={!!editingObject} onOpenChange={() => setEditingObject(null)}>
          <DialogContent className="bg-nebula-blue border-electric-blue/30 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-orbitron text-stellar-cyan">Modifier l'Objet Céleste</DialogTitle>
              <DialogDescription className="text-stellar-white/70">
                Modifiez les propriétés de l'objet "{editingObject?.name}"
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-stellar-white">Nom *</Label>
                  <Input
                    id="edit-name"
                    {...editForm.register("name", { required: "Le nom est requis" })}
                    className="cosmic-input"
                  />
                  {editForm.formState.errors.name && (
                    <p className="text-red-400 text-sm">{editForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-stellar-white">Type *</Label>
                  <Input
                    id="edit-type"
                    {...editForm.register("type", { required: "Le type est requis" })}
                    className="cosmic-input"
                  />
                  {editForm.formState.errors.type && (
                    <p className="text-red-400 text-sm">{editForm.formState.errors.type.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-categoryId" className="text-stellar-white">Catégorie *</Label>
                  <Select value={editForm.watch("categoryId")} onValueChange={(value) => editForm.setValue("categoryId", value)}>
                    <SelectTrigger className="cosmic-input">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent className="bg-nebula-blue border-electric-blue/30">
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id} className="text-stellar-white hover:bg-electric-blue/20">
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {(!editForm.watch("categoryId") && editForm.formState.isSubmitted) && (
                    <p className="text-red-400 text-sm">La catégorie est requise</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-systemId" className="text-stellar-white">Système</Label>
                  <Select value={editForm.watch("systemId")} onValueChange={(value) => editForm.setValue("systemId", value)}>
                    <SelectTrigger className="cosmic-input">
                      <SelectValue placeholder="Sélectionner un système" />
                    </SelectTrigger>
                    <SelectContent className="bg-nebula-blue border-electric-blue/30">
                      {systems.map((system) => (
                        <SelectItem key={system.id} value={system.id} className="text-stellar-white hover:bg-electric-blue/20">
                          {system.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-distanceFromSun" className="text-stellar-white">Distance du Soleil (AL)</Label>
                  <Input
                    id="edit-distanceFromSun"
                    {...editForm.register("distanceFromSun", { 
                      valueAsNumber: true,
                      validate: value => value === undefined || value > 0 || "La distance doit être positive"
                    })}
                    type="number"
                    step="0.001"
                    className="cosmic-input"
                  />
                  {editForm.formState.errors.distanceFromSun && (
                    <p className="text-red-400 text-sm">{editForm.formState.errors.distanceFromSun.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-temperature" className="text-stellar-white">Température (K)</Label>
                  <Input
                    id="edit-temperature"
                    {...editForm.register("temperature", { 
                      valueAsNumber: true,
                      validate: value => value === undefined || value > 0 || "La température doit être positive"
                    })}
                    type="number"
                    className="cosmic-input"
                  />
                  {editForm.formState.errors.temperature && (
                    <p className="text-red-400 text-sm">{editForm.formState.errors.temperature.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-discoverer" className="text-stellar-white">Découvreur</Label>
                  <Input
                    id="edit-discoverer"
                    {...editForm.register("discoverer")}
                    className="cosmic-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-discoveryDate" className="text-stellar-white">Date de découverte</Label>
                  <Input
                    id="edit-discoveryDate"
                    {...editForm.register("discoveryDate")}
                    className="cosmic-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-stellar-white">Description</Label>
                <Textarea
                  id="edit-description"
                  {...editForm.register("description")}
                  className="cosmic-input"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingObject(null)}
                  className="border-electric-blue/30 text-stellar-cyan hover:bg-electric-blue/20"
                  disabled={updateObjectMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="cosmic-button"
                  disabled={updateObjectMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateObjectMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
