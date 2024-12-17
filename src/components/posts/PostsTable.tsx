import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface PostsTableProps {
  posts: any[];
  onDeletePost: (postId: string) => void;
}

export const PostsTable = ({ posts, onDeletePost }: PostsTableProps) => {
  const navigate = useNavigate();

  const handleEditPost = (postId: string) => {
    navigate(`/edit-post/${postId}`);
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Дата</TableHead>
          <TableHead>Название</TableHead>
          <TableHead>Описание</TableHead>
          <TableHead>Категория</TableHead>
          <TableHead>Статус</TableHead>
          <TableHead className="text-right">Действия</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts?.map((post) => (
          <TableRow key={post.id}>
            <TableCell>
              {format(new Date(post.created_at), "dd.MM.yyyy")}
            </TableCell>
            <TableCell>
              <a
                href={`/post/${post.id}`}
                className="text-blue-600 hover:underline"
              >
                {post.title}
              </a>
            </TableCell>
            <TableCell>{post.description}</TableCell>
            <TableCell>
              {post.categories && (
                <Badge variant="secondary">
                  {post.categories.name}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              <Badge
                variant={post.learning_status === "completed" ? "default" : "secondary"}
              >
                {getLearningStatusText(post.learning_status)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEditPost(post.id)}
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
                      <AlertDialogTitle>
                        Удалить пост?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Это действие нельзя отменить. Пост будет удален безвозвратно.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDeletePost(post.id)}
                      >
                        Удалить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};