export type Category = 'Academic' | 'Events' | 'Placement';

export interface Comment {
  id: string;
  author: string;
  role?: string;
  text: string;
  timestamp: string;
  likes?: number;
}

export interface Announcement {
  id: string;
  category: Category;
  title: string;
  description: string;
  date: string;
  time: string;
  department?: string;
  location?: string;
  isImportant?: boolean;
  author?: string;
  likes: number;
  comments: Comment[];
}
