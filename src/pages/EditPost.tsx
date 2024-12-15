import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useState } from "react";
import { PostForm } from "@/components/posts/PostForm";
import { DeletePostDialog } from "@/components/posts/DeletePostDialog";
import { Post } from "@/types/post";
import { Category } from "@/types/category";

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
            <DeletePostDialog onDelete={() => deleteMutation.mutate()} />
          </div>
        </div>

        <PostForm
          post={post}
          categories={categories}
          onPostChange={setPost}
        />
      </div>
    </MainLayout>
  );
};

export default EditPost;