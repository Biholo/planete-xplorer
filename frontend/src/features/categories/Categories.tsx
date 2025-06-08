"use client"


import { useCreateCategory, useDeleteCategory, useGetAllCategories, useUpdateCategory } from "@/api/queries/categoryQueries"
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
import { CategoryDto, UserRole } from "@shared/dto"
import Cookies from "js-cookie"
import { Edit, Globe, Orbit, Plus, Rocket, Save, Sparkles, Star, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

const availableColors = [
  "#FF6B35", // Mars Orange
  "#F7B801", // Solar Yellow
  "#E8E8E8", // Lunar Silver
  "#8B7D6B", // Meteorite Gray
  "#4FC3F7", // Ice Blue
  "#9C27B0", // Mystic Violet
  "#66FCF1", // Stellar Cyan
  "#45A29E", // Electric Blue
  "#1F2833", // Nebula Blue
  "#C5C6C7", // Stellar White
  "#FF4081", // Cosmic Pink
  "#00BCD4", // Cosmic Teal
]

const availableIcons = [
  { name: "Globe", icon: Globe },
  { name: "Star", icon: Star },
  { name: "Orbit", icon: Orbit },
  { name: "Rocket", icon: Rocket },
  { name: "Sparkles", icon: Sparkles },
]

interface CategoryFormData {
  name: string
  description?: string
  color: string
  icon: string
}

export default function CategoriesPage() {
  const { user } = useAuthStore()
  console.log('🔐 Auth Debug:', { 
    user, 
    isAuthenticated: !!user,
    hasRoles: !!user?.roles,
    roles: user?.roles 
  })
  console.log('🍪 Cookies Debug:', {
    accessToken: Cookies.get('accessToken'),
    refreshToken: Cookies.get('refreshToken')
  })
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<CategoryDto | null>(null)

  // React Hook Form
  const createForm = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      color: "#66FCF1",
      icon: "Star",
    }
  })

  const editForm = useForm<CategoryFormData>({
    defaultValues: {
      name: "",
      description: "",
      color: "#66FCF1",
      icon: "Star",
    }
  })

  // Queries and mutations
  const { data: categories = [], isLoading, error } = useGetAllCategories()
  const createCategoryMutation = useCreateCategory()
  const updateCategoryMutation = useUpdateCategory()
  const deleteCategoryMutation = useDeleteCategory()

  // Fonction pour vérifier si l'utilisateur est admin
  const isAdmin = () => {
    if (!user?.roles) return false
    // Les rôles sont maintenant un tableau directement
    return Array.isArray(user.roles) && user.roles.includes(UserRole.ADMIN)
  }



  useEffect(() => {
    console.log('categories', categories)
  }, [categories])



  const handleCreateSubmit = async (data: CategoryFormData) => {
    try {
      await createCategoryMutation.mutateAsync(data)
      setIsAddModalOpen(false)
      createForm.reset()
    } catch (error: any) {
      console.error(error.message || "Une erreur est survenue")
    }
  }



  const handleEditSubmit = async (data: CategoryFormData) => {
    if (!editingCategory) return
    
    try {
      await updateCategoryMutation.mutateAsync({
        id: editingCategory.id,
        category: data
      })
      setEditingCategory(null)
      editForm.reset()
    } catch (error: any) {
      console.error(error.message || "Une erreur est survenue")
    }
  }

  const handleEdit = (category: CategoryDto) => {
    setEditingCategory(category)
    editForm.reset({
      name: category.name,
      description: category.description || "",
      color: category.color || "#66FCF1",
      icon: category.icon || "Star",
    })
  }

  const handleDelete = async (categoryId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      try {
        await deleteCategoryMutation.mutateAsync(categoryId)
        console.log("Catégorie supprimée avec succès")
      } catch (error: any) {
        console.error(error.message || "Erreur lors de la suppression")
      }
    }
  }

  const getIconComponent = (iconName: string) => {
    const iconObj = availableIcons.find((icon) => icon.name === iconName)
    return iconObj ? iconObj.icon : Star
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen flex items-center justify-center">
        <div className="text-stellar-cyan font-orbitron text-xl">Chargement des catégories...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen flex items-center justify-center">
        <div className="text-red-400 font-orbitron text-xl">Erreur lors du chargement des catégories</div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen">
      {/* Animated starfield background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-1 h-1 bg-stellar-cyan rounded-full animate-twinkle"></div>
        <div className="absolute top-32 right-20 w-0.5 h-0.5 bg-electric-blue rounded-full animate-twinkle delay-300"></div>
        <div className="absolute bottom-40 left-16 w-1 h-1 bg-stellar-cyan rounded-full animate-twinkle delay-700"></div>
        <div className="absolute bottom-20 right-10 w-0.5 h-0.5 bg-electric-blue rounded-full animate-twinkle delay-1000"></div>
        <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-stellar-cyan rounded-full animate-twinkle delay-500"></div>
        <div className="absolute top-1/4 right-1/3 w-1 h-1 bg-electric-blue rounded-full animate-twinkle delay-1200"></div>
      </div>

      <header className="relative flex h-16 shrink-0 items-center gap-2 border-b border-electric-blue/30 px-4 bg-nebula-blue/80 backdrop-blur-sm"
        style={{ boxShadow: '0 4px 20px rgba(102, 252, 241, 0.1)' }}>
        <Separator orientation="vertical" className="mr-2 h-4 bg-electric-blue/50" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="text-stellar-cyan hover:text-stellar-white transition-colors font-mono">
                🚀 Dashboard
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-electric-blue/70">⫸</BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-orbitron text-stellar-cyan font-semibold tracking-wide">
                ⭐ Catégories
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="relative flex-1 space-y-8 p-6">
        {/* En-tête avec actions */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-stellar-cyan animate-float" />
              <h1 className="text-3xl sm:text-4xl font-bold font-orbitron text-stellar-cyan tracking-wider">
                Gestion des Catégories
              </h1>
            </div>
            <p className="text-stellar-white/70 font-mono tracking-wide">
              🌌 Organisez vos objets célestes par catégories
            </p>
          </div>

          {isAdmin() && (
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full sm:w-auto bg-gradient-to-r from-electric-blue to-stellar-cyan text-space-black font-bold hover:from-stellar-cyan hover:to-electric-blue transition-all duration-300 font-mono tracking-wide"
                  style={{ boxShadow: '0 0 20px rgba(102, 252, 241, 0.4)' }}
                  disabled={createCategoryMutation.isPending}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {createCategoryMutation.isPending ? "CRÉATION..." : "NOUVELLE CATÉGORIE"}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gradient-to-b from-nebula-blue to-space-black border border-electric-blue/30 backdrop-blur"
                style={{ boxShadow: '0 0 30px rgba(102, 252, 241, 0.2)' }}>
                <DialogHeader>
                  <DialogTitle className="font-orbitron text-stellar-cyan text-xl tracking-wide">
                    ✨ Créer une Nouvelle Catégorie
                  </DialogTitle>
                  <DialogDescription className="text-stellar-white/70 font-mono">
                    Définissez les propriétés de votre nouvelle catégorie d'objets célestes
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-stellar-white font-mono font-semibold">
                      Nom de la Catégorie *
                    </Label>
                    <Input
                      id="name"
                      {...createForm.register("name", { required: "Le nom est requis" })}
                      className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono"
                      placeholder="Ex: Nébuleuse"
                    />
                    {createForm.formState.errors.name && (
                      <p className="text-red-400 text-sm font-mono">{createForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-stellar-white font-mono font-semibold">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      {...createForm.register("description")}
                      className="bg-space-black/50 border-electric-blue/50 text-stellar-white placeholder:text-stellar-white/50 focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono min-h-[80px]"
                      placeholder="Description détaillée de la catégorie..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-stellar-white font-mono font-semibold">Couleur Cosmique</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                              createForm.watch("color") === color 
                                ? "border-stellar-cyan scale-110" 
                                : "border-electric-blue/50 hover:border-electric-blue hover:scale-105"
                            }`}
                            style={{ 
                              backgroundColor: color,
                              boxShadow: createForm.watch("color") === color ? `0 0 15px ${color}40` : 'none'
                            }}
                            onClick={() => createForm.setValue("color", color)}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-stellar-white font-mono font-semibold">Icône Stellaire</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableIcons.map((iconObj) => {
                          const IconComponent = iconObj.icon
                          return (
                            <button
                              key={iconObj.name}
                              type="button"
                              className={`p-3 rounded-lg border transition-all duration-300 ${
                                createForm.watch("icon") === iconObj.name
                                  ? "border-stellar-cyan bg-electric-blue/30 shadow-lg"
                                  : "border-electric-blue/30 hover:border-electric-blue/60 hover:bg-electric-blue/10"
                              }`}
                              onClick={() => createForm.setValue("icon", iconObj.name)}
                            >
                              <IconComponent className="h-5 w-5 text-stellar-cyan mx-auto" />
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-electric-blue/20">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddModalOpen(false)}
                      className="border-electric-blue/50 text-stellar-cyan hover:bg-electric-blue/20 font-mono"
                      disabled={createCategoryMutation.isPending}
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-electric-blue to-stellar-cyan text-space-black hover:from-stellar-cyan hover:to-electric-blue font-mono font-bold"
                      disabled={createCategoryMutation.isPending}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {createCategoryMutation.isPending ? "CRÉATION..." : "CRÉER"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Liste des catégories */}
        <Card className="bg-gradient-to-b from-nebula-blue/60 to-space-black/80 border border-electric-blue/30 backdrop-blur-sm"
          style={{ boxShadow: '0 0 40px rgba(102, 252, 241, 0.15)' }}>
          <CardHeader className="border-b border-electric-blue/20">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-stellar-cyan animate-pulse" />
              <CardTitle className="font-orbitron text-stellar-cyan text-xl tracking-wide">
                Catégories Existantes ({categories.length})
              </CardTitle>
            </div>
            <CardDescription className="text-stellar-white/70 font-mono">
              Gérez vos catégories d'objets célestes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                <Table>
                  <TableHeader>
                    <TableRow className="border-electric-blue/20 hover:bg-electric-blue/5">
                      <TableHead className="text-stellar-cyan font-orbitron font-bold tracking-wide">
                        Catégorie
                      </TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron font-bold tracking-wide hidden sm:table-cell">
                        Description
                      </TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron font-bold tracking-wide">
                        Couleur
                      </TableHead>
                      <TableHead className="text-stellar-cyan font-orbitron font-bold tracking-wide">
                        Icône
                      </TableHead>
                      {isAdmin() && (
                        <TableHead className="text-stellar-cyan font-orbitron font-bold tracking-wide">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map((category: CategoryDto) => {
                      const IconComponent = getIconComponent(category.icon || "Star")
                      return (
                        <TableRow
                          key={category.id}
                          className="border-electric-blue/10 hover:bg-gradient-to-r hover:from-electric-blue/10 hover:to-stellar-cyan/10 transition-all duration-300"
                        >
                          <TableCell className="font-medium text-stellar-white font-mono">
                            <span className="truncate max-w-[120px] block">{category.name}</span>
                          </TableCell>
                          <TableCell className="text-stellar-white/80 max-w-xs truncate hidden sm:table-cell font-mono text-sm">
                            {category.description || "Aucune description"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-6 h-6 rounded-full border border-electric-blue/50 flex-shrink-0 animate-pulse"
                                style={{ 
                                  backgroundColor: category.color || "#66FCF1",
                                  boxShadow: `0 0 10px ${category.color || "#66FCF1"}60`
                                }}
                              />
                              <span className="text-stellar-white/60 text-xs hidden lg:inline font-mono">
                                {category.color || "#66FCF1"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="p-2 rounded-lg bg-electric-blue/20 w-fit">
                              <IconComponent className="h-5 w-5 text-stellar-cyan" />
                            </div>
                          </TableCell>
                          {isAdmin() && (
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(category)}
                                  className="text-stellar-cyan hover:text-stellar-white hover:bg-electric-blue/20 transition-all duration-300"
                                  disabled={updateCategoryMutation.isPending}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(category.id)}
                                  className="text-mars-orange hover:text-red-300 hover:bg-mars-orange/20 transition-all duration-300"
                                  disabled={deleteCategoryMutation.isPending}
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
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="bg-gradient-to-b from-nebula-blue to-space-black border border-electric-blue/30 backdrop-blur"
            style={{ boxShadow: '0 0 30px rgba(102, 252, 241, 0.2)' }}>
            <DialogHeader>
              <DialogTitle className="font-orbitron text-stellar-cyan text-xl tracking-wide">
                🔧 Modifier la Catégorie
              </DialogTitle>
              <DialogDescription className="text-stellar-white/70 font-mono">
                Modifiez les propriétés de la catégorie "{editingCategory?.name}"
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="edit-name" className="text-stellar-white font-mono font-semibold">
                  Nom de la Catégorie *
                </Label>
                <Input
                  id="edit-name"
                  {...editForm.register("name", { required: "Le nom est requis" })}
                  className="bg-space-black/50 border-electric-blue/50 text-stellar-white focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono"
                />
                {editForm.formState.errors.name && (
                  <p className="text-red-400 text-sm font-mono">{editForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="edit-description" className="text-stellar-white font-mono font-semibold">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  {...editForm.register("description")}
                  className="bg-space-black/50 border-electric-blue/50 text-stellar-white focus:border-stellar-cyan focus:ring-stellar-cyan/20 font-mono min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-stellar-white font-mono font-semibold">Couleur Cosmique</Label>
                  <div className="grid grid-cols-4 gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                          editForm.watch("color") === color 
                            ? "border-stellar-cyan scale-110" 
                            : "border-electric-blue/50 hover:border-electric-blue hover:scale-105"
                        }`}
                        style={{ 
                          backgroundColor: color,
                          boxShadow: editForm.watch("color") === color ? `0 0 15px ${color}40` : 'none'
                        }}
                        onClick={() => editForm.setValue("color", color)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-stellar-white font-mono font-semibold">Icône Stellaire</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableIcons.map((iconObj) => {
                      const IconComponent = iconObj.icon
                      return (
                        <button
                          key={iconObj.name}
                          type="button"
                          className={`p-3 rounded-lg border transition-all duration-300 ${
                            editForm.watch("icon") === iconObj.name
                              ? "border-stellar-cyan bg-electric-blue/30 shadow-lg"
                              : "border-electric-blue/30 hover:border-electric-blue/60 hover:bg-electric-blue/10"
                          }`}
                          onClick={() => editForm.setValue("icon", iconObj.name)}
                        >
                          <IconComponent className="h-5 w-5 text-stellar-cyan mx-auto" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-electric-blue/20">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCategory(null)}
                  className="border-electric-blue/50 text-stellar-cyan hover:bg-electric-blue/20 font-mono"
                  disabled={updateCategoryMutation.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-electric-blue to-stellar-cyan text-space-black hover:from-stellar-cyan hover:to-electric-blue font-mono font-bold"
                  disabled={updateCategoryMutation.isPending}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateCategoryMutation.isPending ? "SAUVEGARDE..." : "SAUVEGARDER"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
