import { MainLayout } from "@/components/layout/MainLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostsTable } from "@/components/posts/PostsTable";
import { CategoryFilter } from "@/components/posts/CategoryFilter";
import { getAllPosts, deletePost, syncWithServer } from "@/utils/indexedDB";

const Index = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "all";
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl);
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Update selected category when URL changes
  useEffect(() => {
    setSelectedCategory(categoryFromUrl);
  }, [categoryFromUrl]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncWithServer(); // Sync when coming back online
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      try {
        if (isOnline) {
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
        } else {
          // Use IndexedDB when offline
          const offlinePosts = await getAllPosts();
          const result = await offlinePosts;
          if (selectedCategory === "all") {
            return result;
          }
          return result.filter(post => post.category_id === selectedCategory);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
        // Fallback to IndexedDB
        const offlinePosts = await getAllPosts();
        const result = await offlinePosts;
        return selectedCategory === "all" 
          ? result 
          : result.filter(post => post.category_id === selectedCategory);
      }
    },
  });

  const handleDeletePost = async (postId: string) => {
    try {
      if (isOnline) {
        const { error } = await supabase.from("posts").delete().eq("id", postId);
        if (error) throw error;
      }
      
      await deletePost(postId);
      
      toast({
        title: "Успешно",
        description: "Пост удален",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить пост",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    navigate(`/?category=${categoryId}`);
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
            {!isOnline && (
              <div className="text-yellow-600 bg-yellow-100 px-3 py-1 rounded-md">
                Офлайн режим
              </div>
            )}
            <CategoryFilter
              categories={categories || []}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
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