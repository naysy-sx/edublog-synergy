import { MainLayout } from "@/components/layout/MainLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { toast } from "sonner";

const ViewPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          categories (
            id,
            name
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleDeletePost = async () => {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    
    if (error) {
      toast.error("Ошибка при удалении поста");
      return;
    }

    toast.success("Пост успешно удален");
    navigate("/");
  };

  const getLearningStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Изучено";
      case "in_progress":
        return "В процессе";
      default:
        return "Не начато";
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div>Загрузка...</div>
      </MainLayout>
    );
  }

  if (!post) {
    return (
      <MainLayout>
        <div>Пост не найден</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="flex gap-2 items-center text-muted-foreground">
              <span>{format(new Date(post.created_at), "dd.MM.yyyy")}</span>
              {post.categories && (
                <Badge variant="secondary">{post.categories.name}</Badge>
              )}
              <Badge variant={post.learning_status === "completed" ? "default" : "secondary"}>
                {getLearningStatusText(post.learning_status)}
              </Badge>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/edit-post/${post.id}`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить пост?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Это действие нельзя отменить. Пост будет удален безвозвратно.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeletePost}>
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {post.description && (
          <p className="text-muted-foreground">{post.description}</p>
        )}

        {post.content && (
          <div className="prose prose-stone dark:prose-invert max-w-none">
            {post.content}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ViewPost;