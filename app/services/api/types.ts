
export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  coverImage?: string;
  thumbnail?: string;
  averageRating?: number;
  ratingsCount?: number;
  pageCount?: number;
  categories?: string[];
  language?: string;
  isbn?: string;
  publisher?: string;
}

export interface SearchResult {
  books: Book[];
  totalItems: number;
}

export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    publishedDate?: string;
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    averageRating?: number;
    ratingsCount?: number;
    pageCount?: number;
    categories?: string[];
    language?: string;
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    publisher?: string;
  };
}

export interface GoogleBooksResponse {
  items?: GoogleBookVolume[];
  totalItems: number;
}

export interface OpenLibraryWork {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  ratings_average?: number;
  ratings_count?: number;
}

export interface OpenLibraryResponse {
  docs: OpenLibraryWork[];
  numFound: number;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface SearchParams {
  query: string;
  maxResults?: number;
  startIndex?: number;
}