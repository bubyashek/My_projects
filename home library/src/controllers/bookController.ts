import { Book, Reader } from '../models/Book.js';
import { readBooks, writeBooks } from '../utils/fileManager.js';
import { v4 as uuidv4 } from 'uuid';

export class BookController {
  static async getAllBooks(): Promise<Book[]> {
    return await readBooks();
  }

  static async getBookById(id: string): Promise<Book | null> {
    const books = await readBooks();
    return books.find(book => book.id === id) || null;
  }

  static async createBook(bookData: Omit<Book, 'id'>): Promise<Book> {
    console.log('Creating book:', bookData);
    const books = await readBooks();
    const newBook: Book = {
      ...bookData,
      id: uuidv4()
    };
    books.push(newBook);
    await writeBooks(books);
    console.log('Book created:', newBook);
    return newBook;
  }

  static async updateBook(id: string, bookData: Partial<Book>): Promise<Book | null> {
    console.log('Updating book:', id, bookData);
    const books = await readBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      console.log('Book not found for update:', id);
      return null;
    }

    books[bookIndex] = { ...books[bookIndex], ...bookData };
    await writeBooks(books);
    console.log('Book updated:', books[bookIndex]);
    return books[bookIndex];
  }

  static async deleteBook(id: string): Promise<boolean> {
    console.log('Deleting book:', id);
    const books = await readBooks();
    const initialLength = books.length;
    const filteredBooks = books.filter(book => book.id !== id);
    
    if (filteredBooks.length === initialLength) {
      console.log('Book not found for deletion:', id);
      return false;
    }
    
    await writeBooks(filteredBooks);
    console.log('Book deleted:', id);
    return true;
  }

  static async borrowBook(id: string, readerName: string, returnDate: string): Promise<Book | null> {
    console.log('Borrowing book:', id, readerName, returnDate);
    const books = await readBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      console.log('Book not found for borrowing:', id);
      return null;
    }
    
    const book = books[bookIndex];
    if (!book.isAvailable) {
      console.log('Book not available for borrowing:', id);
      return null;
    }

    const reader: Reader = {
      name: readerName,
      borrowDate: new Date().toISOString().split('T')[0],
      returnDate: returnDate
    };

    book.isAvailable = false;
    book.reader = reader;
    
    await writeBooks(books);
    console.log('Book borrowed successfully:', book);
    return book;
  }

  static async returnBook(id: string): Promise<Book | null> {
    console.log('Returning book:', id);
    const books = await readBooks();
    const bookIndex = books.findIndex(book => book.id === id);
    
    if (bookIndex === -1) {
      console.log('Book not found for return:', id);
      return null;
    }
    
    const book = books[bookIndex];
    if (book.isAvailable) {
      console.log('Book already available:', id);
      return null;
    }

    book.isAvailable = true;
    book.reader = undefined;
    
    await writeBooks(books);
    console.log('Book returned successfully:', book);
    return book;
  }

  static async getOverdueBooks(): Promise<Book[]> {
    const books = await readBooks();
    const today = new Date().toISOString().split('T')[0];
    
    return books.filter(book => 
      !book.isAvailable && book.reader && book.reader.returnDate < today
    );
  }
}