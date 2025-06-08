"use client"

import { useCreateSystem, useDeleteSystem, useGetAllSystems, useUpdateSystem } from "@/api/queries/systemQueries"
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
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useAuthStore } from "@/stores/authStore"
import { UserRole } from "@shared/dto"
import { Edit, Globe, Plus, Save, Star, Trash2, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"

interface SystemFormData {
  name: string
  mainStar: string
  distanceFromEarth?: number
  description?: string
}

export default function SystemsPage() {
  const { user } = useAuthStore()
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingSystem, setEditingSystem] = useState<any>(null)

  // React Hook Form
  const createForm = useForm<SystemFormData>({
    defaultValues: {
      name: "",
      mainStar: "",
      distanceFromEarth: undefined,
      description: "",
    }
  })

  const editForm = useForm<SystemFormData>({
    defaultValues: {
      name: "",
      mainStar: "",
      distanceFromEarth: undefined,
      description: "",
    }
  })

  // Queries and mutations
  const { data: systems = [], isLoading, error } = useGetAllSystems()
  const createSystemMutation = useCreateSystem()
  const updateSystemMutation = useUpdateSystem()
  const deleteSystemMutation = useDeleteSystem()

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    if (!user?.roles) return false
    // Les rôles sont maintenant un tableau directement
    return Array.isArray(user.roles) && user.roles.includes(UserRole.ADMIN)
  }

  const handleCreateSubmit = async (data: SystemFormData) => {
    try {
      await createSystemMutation.mutateAsync(data)
      setIsAddModalOpen(false)
      createForm.reset()
      console.log("Système créé avec succès")
    } catch (error: any) {
      console.error(error.message || "Une erreur est survenue")
    }
  }

  const handleEditSubmit = async (data: SystemFormData) => {
    if (!editingSystem) return

    try {
      await updateSystemMutation.mutateAsync({
        id: editingSystem.id,
        system: data
      })
      setEditingSystem(null)
      editForm.reset()
      console.log("Système modifié avec succès")
    } catch (error: any) {
      console.error(error.message || "Une erreur est survenue")
    }
  }

  const handleEdit = (system: any) => {
    setEditingSystem(system)
    editForm.reset({
      name: system.name,
      mainStar: system.mainStar || "",
      distanceFromEarth: system.distanceFromEarth || undefined,
      description: system.description || "",
    })
  }

  const handleDelete = async (systemId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce système ?")) {
      try {
        await deleteSystemMutation.mutateAsync(systemId)
        console.log("Système supprimé avec succès")
      } catch (error: any) {
        console.error(error.message || "Erreur lors de la suppression")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen flex items-center justify-center">
        <div className="text-stellar-cyan font-orbitron text-xl">Chargement des systèmes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen flex items-center justify-center">
        <div className="text-red-400 font-orbitron text-xl">Erreur lors du chargement des systèmes</div>
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
              <BreadcrumbPage className="font-orbitron text-stellar-cyan">🌍 Systèmes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-6 p-6">
        {/* En-tête avec actions */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-orbitron text-stellar-cyan">Gestion des Systèmes</h1>
            <p className="text-stellar-white/70">Explorez et gérez les systèmes stellaires</p>
          </div>

          {isAdmin() && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="cosmic-button"
                  disabled={createSystemMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createSystemMutation.isPending ? "Création..." : "Nouveau Système"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-nebula-blue border-electric-blue/30">
                <DialogHeader>
                  <DialogTitle className="font-orbitron text-stellar-cyan">Créer un Nouveau Système</DialogTitle>
                  <DialogDescription className="text-stellar-white/70">
                    Ajoutez un nouveau système stellaire à votre collection
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-stellar-white">
                      Nom du système *
                    </Label>
                    <Input
                      id="name"
                      {...createForm.register("name", { required: "Le nom est requis" })}
                      className="cosmic-input"
                      placeholder="Ex: HD 40307"
                    />
                    {createForm.formState.errors.name && (
                      <p className="text-red-400 text-sm">{createForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mainStar" className="text-stellar-white">
                      Étoile principale *
                    </Label>
                    <Input
                      id="mainStar"
                      {...createForm.register("mainStar", { required: "L'étoile principale est requise" })}
                      className="cosmic-input"
                      placeholder="Ex: HD 40307"
                    />
                    {createForm.formState.errors.mainStar && (
                      <p className="text-red-400 text-sm">{createForm.formState.errors.mainStar.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="distanceFromEarth" className="text-stellar-white">
                      Distance de la Terre (années-lumière)
                    </Label>
                    <Input
                      id="distanceFromEarth"
                      {...createForm.register("distanceFromEarth", { 
                        valueAsNumber: true,
                        validate: value => value === undefined || value > 0 || "La distance doit être positive"
                      })}
                      type="number"
                      step="0.1"
                      className="cosmic-input"
                      placeholder="Ex: 42.11"
                    />
                    {createForm.formState.errors.distanceFromEarth && (
                      <p className="text-red-400 text-sm">{createForm.formState.errors.distanceFromEarth.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-stellar-white">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      {...createForm.register("description")}
                      className="cosmic-input"
                      placeholder="Description du système stellaire..."
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddModalOpen(false)}
                      className="border-electric-blue/30 text-stellar-cyan hover:bg-electric-blue/20"
                      disabled={createSystemMutation.isPending}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="cosmic-button"
                      disabled={createSystemMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createSystemMutation.isPending ? "Création..." : "Créer"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Liste des systèmes */}
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="font-orbitron text-stellar-cyan">Systèmes Stellaires ({systems.length})</CardTitle>
            <CardDescription className="text-stellar-white/70">
              Gérez votre collection de systèmes stellaires
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="rounded-md border border-electric-blue/30 overflow-hidden min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-electric-blue/30 hover:bg-electric-blue/10">
                      <TableHead className="text-stellar-cyan font-orbitron">Système</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron">Étoile Principale</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron hidden sm:table-cell">Distance (AL)</TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron hidden md:table-cell">
                        Description
                      </TableHead>
                      {isAdmin() && (
                        <TableHead className="text-stellar-cyan font-orbitron">Actions</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {systems.map((system) => (
                      <TableRow
                        key={system.id}
                        className="border-electric-blue/20 hover:bg-electric-blue/10 transition-colors"
                      >
                        <TableCell className="font-medium text-stellar-white">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4 text-stellar-cyan flex-shrink-0" />
                            <span className="truncate max-w-[120px]">{system.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-stellar-white/80">
                          <div className="flex items-center gap-2">
                            <Star className="h-3 w-3 text-solar-yellow flex-shrink-0" />
                            <span className="truncate max-w-[100px]">{system.mainStar || "N/A"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-stellar-white/80 hidden sm:table-cell">
                          {system.distanceFromEarth ? `${system.distanceFromEarth} AL` : "Non spécifiée"}
                        </TableCell>
                        <TableCell className="text-stellar-white/80 max-w-xs truncate hidden md:table-cell">
                          {system.description || "Aucune description"}
                        </TableCell>
                        {isAdmin() && (
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(system)}
                                className="text-stellar-cyan hover:text-stellar-white"
                                disabled={updateSystemMutation.isPending}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(system.id)}
                                className="text-red-400 hover:text-red-300"
                                disabled={deleteSystemMutation.isPending}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal d'édition */}
        <Dialog open={!!editingSystem} onOpenChange={() => setEditingSystem(null)}>
          <DialogContent className="bg-nebula-blue border-electric-blue/30">
            <DialogHeader>
              <DialogTitle className="font-orbitron text-stellar-cyan">Modifier le Système</DialogTitle>
              <DialogDescription className="text-stellar-white/70">
                Modifiez les propriétés du système "{editingSystem?.name}"
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-stellar-white">
                  Nom du système *
                </Label>
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
                <Label htmlFor="edit-mainStar" className="text-stellar-white">
                  Étoile principale *
                </Label>
                <Input
                  id="edit-mainStar"
                  {...editForm.register("mainStar", { required: "L'étoile principale est requise" })}
                  className="cosmic-input"
                />
                {editForm.formState.errors.mainStar && (
                  <p className="text-red-400 text-sm">{editForm.formState.errors.mainStar.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-distanceFromEarth" className="text-stellar-white">
                  Distance de la Terre (années-lumière)
                </Label>
                <Input
                  id="edit-distanceFromEarth"
                  {...editForm.register("distanceFromEarth", { 
                    valueAsNumber: true,
                    validate: value => value === undefined || value > 0 || "La distance doit être positive"
                  })}
                  type="number"
                  step="0.1"
                  className="cosmic-input"
                />
                {editForm.formState.errors.distanceFromEarth && (
                  <p className="text-red-400 text-sm">{editForm.formState.errors.distanceFromEarth.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-stellar-white">
                  Description
                </Label>
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
                  onClick={() => setEditingSystem(null)}
                  className="border-electric-blue/30 text-stellar-cyan hover:bg-electric-blue/20"
                  disabled={updateSystemMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="cosmic-button"
                  disabled={updateSystemMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateSystemMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
