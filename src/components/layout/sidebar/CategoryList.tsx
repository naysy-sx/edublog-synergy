import { Button } from "@/components/ui/button";
import { FolderEdit, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SidebarMenuButton } from "@/components/ui/sidebar";
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
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CategoryList = ({
  onEdit,
  onDelete,
}: {
  onEdit: (category: { id: string; name: string }) => void;
  onDelete: (id: string) => void;
}) => {
  const navigate = useNavigate();
  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/?category=${categoryId}`);
  };

  return (
    <>
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
                onClick={() => {
                  onEdit(editingCategory);
                  setEditingCategory(null);
                }}
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
              <SidebarMenuButton onClick={() => handleCategoryClick(category.id)}>
                {category.name}
              </SidebarMenuButton>
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
                      <AlertDialogTitle>Удалить категорию?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие нельзя отменить. Все посты в этой категории также будут удалены.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(category.id)}>
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
    </>
  );
};