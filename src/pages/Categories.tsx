import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

const Categories = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: postsCount } = useQuery({
    queryKey: ["categoriesPostsCount"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("category_id, count(*)", { count: "exact" })
        .group("category_id");
      if (error) throw error;
      return data.reduce((acc, curr) => {
        acc[curr.category_id] = curr.count;
        return acc;
      }, {} as Record<string, number>);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (category: typeof newCategory) => {
      const { error } = await supabase.from("categories").insert([category]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsCreateOpen(false);
      setNewCategory({ name: "", description: "" });
      toast({
        title: "Категория создана",
        description: "Категория успешно добавлена",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (category: Category) => {
      const { error } = await supabase
        .from("categories")
        .update({
          name: category.name,
          description: category.description,
        })
        .eq("id", category.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      toast({
        title: "Категория обновлена",
        description: "Изменения успешно сохранены",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast({
        title: "Категория удалена",
        description: "Категория успешно удалена",
      });
    },
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Категории</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" />
                Добавить категорию
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Создать категорию</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Название</label>
                  <Input
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Описание</label>
                  <Textarea
                    value={newCategory.description}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={() => createMutation.mutate(newCategory)}
                  disabled={!newCategory.name}
                >
                  Создать
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead>Описание</TableHead>
              <TableHead>Количество постов</TableHead>
              <TableHead className="w-[100px]">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{postsCount?.[category.id] || 0}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog
                      open={editingCategory?.id === category.id}
                      onOpenChange={(open) =>
                        setEditingCategory(open ? category : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Редактировать категорию</DialogTitle>
                        </DialogHeader>
                        {editingCategory && (
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">
                                Название
                              </label>
                              <Input
                                value={editingCategory.name}
                                onChange={(e) =>
                                  setEditingCategory({
                                    ...editingCategory,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Описание
                              </label>
                              <Textarea
                                value={editingCategory.description || ""}
                                onChange={(e) =>
                                  setEditingCategory({
                                    ...editingCategory,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                            <Button
                              onClick={() =>
                                updateMutation.mutate(editingCategory)
                              }
                              disabled={!editingCategory.name}
                            >
                              Сохранить
                            </Button>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Удалить категорию?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {postsCount?.[category.id]
                              ? `В этой категории есть ${
                                  postsCount[category.id]
                                } ${
                                  postsCount[category.id] === 1
                                    ? "пост"
                                    : postsCount[category.id] < 5
                                    ? "поста"
                                    : "постов"
                                }. При удалении категории все посты будут перемещены в категорию "Без категории".`
                              : "Вы уверены, что хотите удалить эту категорию?"}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteMutation.mutate(category.id)}
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </MainLayout>
  );
};

export default Categories;