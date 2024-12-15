import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 p-2 hover:text-primary">
      <BookOpen className="h-6 w-6" />
      <span className="font-semibold">EduBlog</span>
    </Link>
  );
};