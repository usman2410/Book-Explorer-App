// services/api/googleBooks.ts

import axios from "axios";
import {
  Book,
  SearchResult,
  GoogleBooksResponse,
  GoogleBookVolume,
  SearchParams,
} from "./types";

const GOOGLE_BOOKS_API_BASE = "https://www.googleapis.com/books/v1";

const transformGoogleBook = (volume: GoogleBookVolume): Book => {
  const { volumeInfo } = volume;

  return {
    id: volume.id,
    title: volumeInfo.title || "Unknown Title",
    authors: volumeInfo.authors || ["Unknown Author"],
    publishedDate: volumeInfo.publishedDate,
    description: volumeInfo.description,
    coverImage: volumeInfo.imageLinks?.thumbnail?.replace("http:", "https:"),
    thumbnail: volumeInfo.imageLinks?.smallThumbnail?.replace(
      "http:",
      "https:",
    ),
    averageRating: volumeInfo.averageRating,
    ratingsCount: volumeInfo.ratingsCount,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories,
    language: volumeInfo.language,
    isbn: volumeInfo.industryIdentifiers?.[0]?.identifier,
    publisher: volumeInfo.publisher,
  };
};

export const googleBooksApi = {
  searchBooks: async ({
    query,
    maxResults = 20,
    startIndex = 0,
  }: SearchParams): Promise<SearchResult> => {
    try {
      const response = await axios.get<GoogleBooksResponse>(
        `${GOOGLE_BOOKS_API_BASE}/volumes`,
        {
          params: {
            q: query,
            maxResults,
            startIndex,
            printType: "books",
          },
        },
      );

      const books = response.data.items?.map(transformGoogleBook) || [];

      return {
        books,
        totalItems: response.data.totalItems || 0,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error?.message ||
            "Failed to search books. Please try again.",
        );
      }
      throw error;
    }
  },

  getBookById: async (id: string): Promise<Book> => {
    try {
      const response = await axios.get<GoogleBookVolume>(
        `${GOOGLE_BOOKS_API_BASE}/volumes/${id}`,
      );

      return transformGoogleBook(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new Error("Book not found");
        }
        throw new Error(
          error.response?.data?.error?.message ||
            "Failed to fetch book details",
        );
      }
      throw error;
    }
  },

  searchByAuthor: async (
    author: string,
    maxResults = 20,
  ): Promise<SearchResult> => {
    return googleBooksApi.searchBooks({
      query: `inauthor:${author}`,
      maxResults,
    });
  },

  searchByTitle: async (
    title: string,
    maxResults = 20,
  ): Promise<SearchResult> => {
    return googleBooksApi.searchBooks({
      query: `intitle:${title}`,
      maxResults,
    });
  },

  getTrendingBooks: async (): Promise<SearchResult> => {
    const popularSearches = ["bestseller", "popular fiction", "award winner"];

    const randomSearch =
      popularSearches[Math.floor(Math.random() * popularSearches.length)];

    return googleBooksApi.searchBooks({
      query: randomSearch,
      maxResults: 20,
    });
  },
};
