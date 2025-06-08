"use client"

import { Globe, Home, Rocket, Star, Telescope } from "lucide-react"
import type * as React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom"

const navigationItems = [
  {
    title: "Navigation Principale",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
      },
      {
        title: "Objets Célestes",
        url: "/celestial-objects",
        icon: Telescope,
      },
    ],
  },
  {
    title: "Gestion",
    items: [
      {
        title: "Catégories",
        url: "/categories",
        icon: Star,
      },
      {
        title: "Systèmes",
        url: "/systems",
        icon: Globe,
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="relative">
            <Rocket className="h-8 w-8 text-stellar-cyan animate-float" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-stellar-cyan rounded-full animate-pulse"></div>
          </div>
          <div>
            <h1 className="font-orbitron font-bold text-lg text-stellar-cyan">Planet Xplorer</h1>
            <p className="text-xs text-stellar-white/70">Explorateur Galactique</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-stellar-cyan font-orbitron font-semibold">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-electric-blue/20 hover:text-stellar-cyan transition-all duration-300"
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 text-center">
          <div className="text-xs text-stellar-white/50 font-orbitron">🌌 Explorez l'Univers</div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
