import { Badge } from "@/components/ui/badge"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, Globe, Orbit, Plus, Rocket, Star, Telescope, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

// Données simulées
const stats = {
  totalObjects: 1247,
  totalSystems: 89,
  totalCategories: 8,
  recentlyAdded: 23,
}

const recentObjects = [
  {
    id: 1,
    name: "Kepler-442b",
    type: "Exoplanète",
    category: "Planète",
    system: "Kepler-442",
    discoveredDate: "2024-01-15",
    color: "mystic-violet",
  },
  {
    id: 2,
    name: "HD 164595",
    type: "Étoile",
    category: "Étoile",
    system: "HD 164595",
    discoveredDate: "2024-01-12",
    color: "solar-yellow",
  },
  {
    id: 3,
    name: "Europa",
    type: "Lune",
    category: "Satellite",
    system: "Système Solaire",
    discoveredDate: "2024-01-10",
    color: "lunar-silver",
  },
  {
    id: 4,
    name: "Cérès",
    type: "Planète naine",
    category: "Astéroïde",
    system: "Système Solaire",
    discoveredDate: "2024-01-08",
    color: "meteorite-gray",
  },
  {
    id: 5,
    name: "Halley",
    type: "Comète",
    category: "Comète",
    system: "Système Solaire",
    discoveredDate: "2024-01-05",
    color: "ice-blue",
  },
]

const categoryStats = [
  { name: "Planètes", count: 342, color: "mars-orange", icon: Globe },
  { name: "Étoiles", count: 189, color: "solar-yellow", icon: Star },
  { name: "Lunes", count: 156, color: "lunar-silver", icon: Orbit },
  { name: "Astéroïdes", count: 234, color: "meteorite-gray", icon: Rocket },
  { name: "Comètes", count: 89, color: "ice-blue", icon: TrendingUp },
  { name: "Exoplanètes", count: 237, color: "mystic-violet", icon: Telescope },
]

export default function Dashboard() {
  return (
    <div className="bg-gradient-to-br from-space-black via-nebula-blue to-space-black min-h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b border-electric-blue/30 px-4 bg-nebula-blue/50 backdrop-blur-sm">
        <Separator orientation="vertical" className="mr-2 h-4 bg-electric-blue/30" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-orbitron text-stellar-cyan">🌌 Dashboard Galactique</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="flex-1 space-y-4 sm:space-y-6 p-4 sm:p-6">
        {/* Statistiques principales */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-4">
          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-stellar-white">Objets Célestes</CardTitle>
              <Telescope className="h-4 w-4 text-stellar-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold font-orbitron text-stellar-cyan">
                {stats.totalObjects.toLocaleString()}
              </div>
              <p className="text-xs text-stellar-white/70">+{stats.recentlyAdded} ce mois</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-stellar-white">Systèmes</CardTitle>
              <Globe className="h-4 w-4 text-stellar-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold font-orbitron text-stellar-cyan">{stats.totalSystems}</div>
              <p className="text-xs text-stellar-white/70">Systèmes stellaires</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-stellar-white">Catégories</CardTitle>
              <Star className="h-4 w-4 text-stellar-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold font-orbitron text-stellar-cyan">
                {stats.totalCategories}
              </div>
              <p className="text-xs text-stellar-white/70">Types d'objets</p>
            </CardContent>
          </Card>

          <Card className="cosmic-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium text-stellar-white">Croissance</CardTitle>
              <TrendingUp className="h-4 w-4 text-stellar-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-lg sm:text-2xl font-bold font-orbitron text-stellar-cyan">+12%</div>
              <p className="text-xs text-stellar-white/70">Par rapport au mois dernier</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          {/* Objets récemment ajoutés */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="font-orbitron text-stellar-cyan flex items-center gap-2 text-lg sm:text-xl">
                <Rocket className="h-5 w-5" />
                Découvertes Récentes
              </CardTitle>
              <CardDescription className="text-stellar-white/70">
                Les 5 derniers objets célestes ajoutés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentObjects.map((object) => (
                  <div
                    key={object.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-space-black/30 border border-electric-blue/20 hover:border-stellar-cyan/40 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className={`w-3 h-3 rounded-full bg-${object.color} animate-pulse flex-shrink-0`}></div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-stellar-white truncate">{object.name}</p>
                        <p className="text-sm text-stellar-white/70 truncate">
                          {object.type} • {object.system}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-stellar-cyan hover:text-stellar-white flex-shrink-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button asChild className="cosmic-button w-full">
                  <Link to="/celestial-objects">
                    <Plus className="h-4 w-4 mr-2" />
                    Voir tous les objets
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Répartition par catégories */}
          <Card className="cosmic-card">
            <CardHeader>
              <CardTitle className="font-orbitron text-stellar-cyan flex items-center gap-2 text-lg sm:text-xl">
                <Star className="h-5 w-5" />
                Répartition par Catégories
              </CardTitle>
              <CardDescription className="text-stellar-white/70">
                Distribution des objets célestes par type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {categoryStats.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <div
                      key={category.name}
                      className="flex items-center justify-between p-3 rounded-lg bg-space-black/30 border border-electric-blue/20 hover:border-stellar-cyan/40 transition-all duration-300"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <IconComponent className={`h-5 w-5 text-${category.color} flex-shrink-0`} />
                        <span className="font-medium text-stellar-white truncate">{category.name}</span>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-electric-blue/20 text-stellar-cyan border-electric-blue/30 flex-shrink-0"
                      >
                        {category.count}
                      </Badge>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-electric-blue/30 text-stellar-cyan hover:bg-electric-blue/20"
                >
                  <Link to="/categories">Gérer les catégories</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions rapides */}
        <Card className="cosmic-card">
          <CardHeader>
            <CardTitle className="font-orbitron text-stellar-cyan text-lg sm:text-xl">🚀 Actions Rapides</CardTitle>
            <CardDescription className="text-stellar-white/70">
              Accès rapide aux fonctionnalités principales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <Button asChild className="cosmic-button h-16">
                <Link to="/categories" className="flex flex-col items-center gap-2">
                  <Star className="h-6 w-6" />
                  <span className="text-sm sm:text-base">Gérer les Catégories</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-16 border-electric-blue/30 text-stellar-cyan hover:bg-electric-blue/20"
              >
                <Link to="/systems" className="flex flex-col items-center gap-2">
                  <Globe className="h-6 w-6" />
                  <span className="text-sm sm:text-base">Gérer les Systèmes</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
