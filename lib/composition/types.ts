export interface SectionData {
  id: string;
  type: string;
  bindings: Record<string, string>;
  properties: Record<string, any>;
}

export interface CompositionSchema {
  templateId: string;
  version: string;
  theme: string;
  motion: string;
  sections: SectionData[];
  assets?: {
    music?: string;
    [key: string]: any;
  };
}
