"use client"

import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faGaugeHigh,
  faBoxesStacked,
  faUsers,
  faFileLines,
  faGear,
  faFilePrescription
} from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "@/context/auth/useAuth"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"

// Navigation data
const navigation = [
  { title: "Dashboard", url: "/dashboard", icon: faGaugeHigh, isActive: true },
  { title: "Products", url: "/products", icon: faBoxesStacked, isActive: false },
  { title: "Suppliers", url: "/suppliers", icon: faUsers, isActive: false },
  { title: "Reports", url: "/reports", icon: faFileLines, isActive: false },
  { title: "Settings", url: "/settings", icon: faGear, isActive: false },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [activeItem, setActiveItem] = React.useState(navigation[0])
  const { setOpen } = useSidebar()
  const { user, logout } = useAuth()

  // Set sidebar to be initially closed
  React.useEffect(() => {
    setOpen(false)
  }, [setOpen])

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* First sidebar - Icon view */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <div className="flex w-full items-center">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <FontAwesomeIcon icon={faFilePrescription} className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Medivault</span>
                    <span className="truncate text-xs">Management</span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem.title === item.title}
                      className="px-2.5 md:px-2"
                      asChild
                    >
                      <a href={item.url}>
                        <FontAwesomeIcon 
                          icon={item.icon} 
                          className="h-4 w-4" 
                        />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser 
            user={{
              name: user?.email?.split('@')[0] || 'User',
              email: user?.email || '',
              avatar: '/placeholder-avatar.jpg'
            }}
            onLogout={logout}
          />
        </SidebarFooter>
      </Sidebar>

      {/* Second sidebar - Content view */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="border-b p-4">
          <div className="text-lg font-semibold">{activeItem.title}</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-2">
            <SidebarGroupContent>
              {/* Add section content here */}
              <div className="p-4">
                <h3 className="mb-2 text-sm font-medium">{activeItem.title} Overview</h3>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}