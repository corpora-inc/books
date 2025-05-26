export interface Book {
  path: string;
  title: string;
  author?: string;
  coverImage?: string; // Path or base64 string
  lastOpened?: Date;
  // Other metadata can be added here
}

export interface Chapter {
  id: string;
  label: string;
  href: string; // Path or identifier to load the chapter content
  subChapters?: Chapter[];
}

export interface EpubContent {
  toc: Chapter[];
  // We might add more structured content later
}
