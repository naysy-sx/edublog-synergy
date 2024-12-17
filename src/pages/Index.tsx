import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostsTable } from "@/components/posts/PostsTable";
import { CategoryFilter } from "@/components/posts/CategoryFilter";

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: posts, isLoading } = useQuery({
    queryKey: ["posts", selectedCategory],
    queryFn: async () => {
      let query = supabase.from("posts").select(`
        *,
        categories (
          id,
          name
        )
      `);

      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDeletePost = async (postId: string) => {
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пост",
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Успешно",
      description: "Пост удален",
    });
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <MainLayout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Ваше пространство для обучения</h1>
          <div className="flex items-center gap-4">
            <CategoryFilter
              categories={categories || []}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            <Button onClick={() => navigate("/new-post")}>
              <Plus className="mr-2 h-4 w-4" /> Новый пост
            </Button>
          </div>
        </div>

        <PostsTable posts={posts || []} onDeletePost={handleDeletePost} />
      </div>
    </MainLayout>
  );
};

export default Index;