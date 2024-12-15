import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Trash } from "lucide-react";
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
import { useState } from "react";

interface Post {
  id: string;
  title: string;
  description: string;
  content: string;
  category_id: string | null;
  learning_status: string;
  is_private: boolean;
}

interface Category {
  id: string;
  name: string;
}

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [post, setPost] = useState<Post | null>(null);

  const { data: initialPost } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      setPost(data);
      return data as Post;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      if (error) throw error;
      return data as Category[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedPost: Partial<Post>) => {
      const { error } = await supabase
        .from("posts")
        .update(updatedPost)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      toast({
        title: "Пост обновлен",
        description: "Изменения успешно сохранены",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      navigate("/");
      toast({
        title: "Пост удален",
        description: "Пост успешно удален",
      });
    },
  });

  if (!post && initialPost) {
    setPost(initialPost);
  }

  if (!post) {
    return <div>Загрузка...</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Редактирование поста</h1>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => updateMutation.mutate(post)}
              disabled={!post.title}
            >
              <Save className="mr-2 h-4 w-4" />
              Сохранить
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash className="mr-2 h-4 w-4" />
                  Удалить
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить пост?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Пост будет удален навсегда.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteMutation.mutate()}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Название</label>
            <Input
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Описание</label>
            <Textarea
              value={post.description}
              onChange={(e) => setPost({ ...post, description: e.target.value })}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Контент</label>
            <Textarea
              value={post.content || ""}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="min-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Категория</label>
              <Select
                value={post.category_id || ""}
                onValueChange={(value) =>
                  setPost({ ...post, category_id: value || null })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Без категории</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Статус изучения</label>
              <Select
                value={post.learning_status}
                onValueChange={(value) =>
                  setPost({ ...post, learning_status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Не начато</SelectItem>
                  <SelectItem value="in_progress">В процессе</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditPost;