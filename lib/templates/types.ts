export interface TemplateMetadata {
  id: string;
  name: string;
  category: string;
  thumbnail: string;
  premium: boolean;
  previewImage: string;
  description: string;
  tags: string[];
  supportedLanguages: string[];
  enabled?: boolean;
}
