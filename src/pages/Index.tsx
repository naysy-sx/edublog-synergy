import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Your Learning Space</h1>
        <p className="text-muted-foreground">
          Create, organize, and learn from your educational content.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {/* Placeholder for posts */}
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Welcome to Your Blog</h3>
            <p className="text-sm text-muted-foreground">
              Click the "New Post" button to start creating content.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;