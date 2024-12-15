import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { data: postsStats } = useQuery({
    queryKey: ["postsStats"],
    queryFn: async () => {
      const { data: total } = await supabase
        .from("posts")
        .select("*", { count: "exact" });

      const { data: completed } = await supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("learning_status", "completed");

      const { data: inProgress } = await supabase
        .from("posts")
        .select("*", { count: "exact" })
        .eq("learning_status", "in_progress");

      return {
        total: total?.length || 0,
        completed: completed?.length || 0,
        inProgress: inProgress?.length || 0,
      };
    },
  });

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Профиль</h1>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Всего постов</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{postsStats?.total || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>В процессе изучения</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{postsStats?.inProgress || 0}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Изучено</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{postsStats?.completed || 0}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;