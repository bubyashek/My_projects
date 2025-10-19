import { Book } from '../models/Book.js';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Абсолютный путь к books.json
const booksFilePath = path.resolve(__dirname, '../../books.json');

console.log('Books file path:', booksFilePath);

export async function readBooks(): Promise<Book[]> {
  try {
    const data = await readFile(booksFilePath, 'utf-8');
    console.log('Read books successfully, count:', JSON.parse(data).length);
    return JSON.parse(data);
  } catch (error) {
    console.log('No books file found, starting with empty array');
    return [];
  }
}

export async function writeBooks(books: Book[]): Promise<void> {
  try {
    await writeFile(booksFilePath, JSON.stringify(books, null, 2), 'utf-8');
    console.log('Books saved successfully, count:', books.length);
  } catch (error) {
    console.error('Error saving books:', error);
    throw error;
  }
}