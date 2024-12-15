import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CategoryList } from "./sidebar/CategoryList";
import { NewCategoryForm } from "./sidebar/NewCategoryForm";
import { Logo } from "./Logo";
import { AuthSection } from "../auth/AuthSection";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export function AppSidebar() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCategory = useMutation({
    mutationFn: async (name: string) => {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Категория создана",
        description: "Новая категория успешно добавлена",
      });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      const { error } = await supabase
        .from("categories")
        .update({ name })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Категория обновлена",
        description: "Название категории успешно изменено",
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Категория удалена",
        description: "Категория и связанные посты успешно удалены",
      });
    },
  });

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4">
          <Logo />
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className="mb-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent rounded-md"
          >
            <Home className="h-4 w-4" />
            На главную
          </Link>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold px-4 mb-2">Категории</h2>
          <NewCategoryForm onSubmit={(name) => createCategory.mutate(name)} />
          <SidebarMenu>
            <CategoryList
              onEdit={(category) => updateCategory.mutate(category)}
              onDelete={(id) => deleteCategory.mutate(id)}
            />
          </SidebarMenu>
        </div>

        <AuthSection />
      </SidebarContent>
    </Sidebar>
  );
}