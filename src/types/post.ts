export interface Post {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  category_id: string | null;
  learning_status: string;
  is_private: boolean;
}