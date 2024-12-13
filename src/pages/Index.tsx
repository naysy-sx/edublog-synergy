import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Ваше пространство для обучения</h1>
        <p className="text-muted-foreground">
          Создавайте, организуйте и изучайте свой образовательный контент.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          <div className="p-6 bg-card rounded-lg shadow-sm border">
            <h3 className="font-semibold mb-2">Добро пожаловать в ваш блог</h3>
            <p className="text-sm text-muted-foreground">
              Нажмите кнопку "Новый пост" чтобы начать создавать контент.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;