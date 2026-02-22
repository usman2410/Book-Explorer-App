export const formatDate = (dateString?: string): string => {
  if (!dateString) return "Unknown";

  try {
    const date = new Date(dateString);
    return date.getFullYear().toString();
  } catch {
    return "Unknown";
  }
};
export const formatAuthors = (authors?: string[]): string => {
  if (!authors || authors.length === 0) return "Unknown Author";

  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(" & ");

  return `${authors[0]} and ${authors.length - 1} others`;
};

export const formatRating = (rating?: number): string => {
  if (!rating) return "N/A";
  return rating.toFixed(1);
};

export const formatPageCount = (pages?: number): string => {
  if (!pages) return "Unknown";
  return `${pages} pages`;
};

export const truncateText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
};
export const formatISBN = (isbn?: string): string => {
  if (!isbn) return "N/A";
  if (isbn.length === 13) {
    return `${isbn.substring(0, 3)}-${isbn.substring(3, 4)}-${isbn.substring(4, 8)}-${isbn.substring(8, 12)}-${isbn.substring(12)}`;
  }

  return isbn;
};

export const getPlaceholderColor = (category?: string): string => {
  const colors = [
    "#4ECDC4",
    "#FFB800",
    "#FF6B6B",
    "#4CAF50",
    "#2196F3",
    "#9C27B0",
    "#FF9800",
    "#795548",
  ];

  if (!category) return colors[0];

  const index = category.length % colors.length;
  return colors[index];
};
