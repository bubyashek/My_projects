export interface Reader {
  name: string;
  borrowDate: string;
  returnDate: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  isAvailable: boolean;
  reader?: Reader;
}