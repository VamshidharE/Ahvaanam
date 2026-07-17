export type CategoryId = string;

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  icon: string; // Dynamic Lucide Icon name
  coverImage: string;
  gradient: string; // Tailwind gradient wrapper
  enabled: boolean;
  displayOrder: number;
}
