import { Book, FolderPlus, Plus, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";

const sidebarItems = [
  { icon: Book, label: "Посты", href: "/" },
  { icon: FolderPlus, label: "Категории", href: "/categories" },
  { icon: User, label: "Профиль", href: "/profile" },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleNewPost = () => {
    navigate("/new-post");
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <Button onClick={handleNewPost} className="w-full" size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Новый пост
          </Button>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Меню</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href} className="flex items-center">
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}