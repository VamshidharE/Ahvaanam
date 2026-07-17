export interface Theme {
  id: string;
  categoryId: string; // Links to CategoryId
  slug: string;
  name: string;
  description: string;
  coverImage: string;
  enabled: boolean;
  displayOrder: number;
}
