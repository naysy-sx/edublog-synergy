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
import { Post } from "@/types/post";
import { Category } from "@/types/category";

interface PostFormProps {
  post: Post;
  categories?: Category[];
  onPostChange: (post: Post) => void;
}

export const PostForm = ({ post, categories, onPostChange }: PostFormProps) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Название</label>
        <Input
          value={post.title}
          onChange={(e) => onPostChange({ ...post, title: e.target.value })}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Описание</label>
        <Textarea
          value={post.description || ""}
          onChange={(e) =>
            onPostChange({ ...post, description: e.target.value })
          }
        />
      </div>

      <div>
        <label className="text-sm font-medium">Контент</label>
        <Textarea
          value={post.content || ""}
          onChange={(e) => onPostChange({ ...post, content: e.target.value })}
          className="min-h-[200px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Категория</label>
          <Select
            value={post.category_id || "none"}
            onValueChange={(value) =>
              onPostChange({
                ...post,
                category_id: value === "none" ? null : value,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Без категории</SelectItem>
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
              onPostChange({ ...post, learning_status: value })
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
  );
};