import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Plus, FolderEdit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

export function AppSidebar() {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

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
      setNewCategoryName("");
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
      setEditingCategory(null);
      toast({
        title: "Категория обновлена",
        description: "Название категории успешно изменено",
      });
    },
  });

  const checkCategoryPosts = async (categoryId: string) => {
    const { data, error } = await supabase
      .from("posts")
      .select("id")
      .eq("category_id", categoryId);
    if (error) throw error;
    return data.length > 0;
  };

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

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      createCategory.mutate(newCategoryName.trim());
    }
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-4">
          <h2 className="text-lg font-semibold">Категории</h2>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <form onSubmit={handleCreateCategory} className="px-4 mb-4">
          <div className="flex gap-2">
            <Input
              placeholder="Новая категория"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <SidebarMenu>
          {categories?.map((category) => (
            <div key={category.id} className="flex items-center justify-between px-4 py-2">
              {editingCategory?.id === category.id ? (
                <div className="flex gap-2 flex-1">
                  <Input
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory({ ...editingCategory, name: e.target.value })
                    }
                  />
                  <Button
                    size="sm"
                    onClick={() =>
                      updateCategory.mutate({
                        id: category.id,
                        name: editingCategory.name,
                      })
                    }
                  >
                    Сохранить
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingCategory(null)}
                  >
                    Отмена
                  </Button>
                </div>
              ) : (
                <>
                  <SidebarMenuButton>{category.name}</SidebarMenuButton>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        setEditingCategory({ id: category.id, name: category.name })
                      }
                    >
                      <FolderEdit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Удалить категорию?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие нельзя отменить. Все посты в этой категории также будут удалены.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteCategory.mutate(category.id)}
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}