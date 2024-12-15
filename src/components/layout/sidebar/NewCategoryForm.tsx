import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

export const NewCategoryForm = ({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onSubmit(newCategoryName.trim());
      setNewCategoryName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-4 mb-4">
      <div className="flex gap-2">
        <Input
          placeholder="Новая категория"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button type="submit" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};