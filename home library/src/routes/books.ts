import { Router } from 'express';
import { BookController } from '../controllers/bookController.js';

const router = Router();

// GET /api/books - получить все книги с фильтрацией
router.get('/', async (req, res) => {
  try {
    console.log('GET /api/books query:', req.query);
    const { available, overdue } = req.query;
    let books = await BookController.getAllBooks();

    if (available === 'true') {
      books = books.filter(book => book.isAvailable);
    } else if (available === 'false') {
      books = books.filter(book => !book.isAvailable);
    }

    if (overdue === 'true') {
      books = await BookController.getOverdueBooks();
    }

    console.log('Returning books:', books.length);
    res.json(books);
  } catch (error) {
    console.error('Error in GET /api/books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/books/:id - получить книгу по ID
router.get('/:id', async (req, res) => {
  try {
    console.log('GET /api/books/:id', req.params.id);
    const book = await BookController.getBookById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('Error in GET /api/books/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/books - создать новую книгу
router.post('/', async (req, res) => {
  try {
    console.log('POST /api/books body:', req.body);
    const { title, author, publishDate } = req.body;
    
    if (!title || !author || !publishDate) {
      return res.status(400).json({ error: 'Missing required fields: title, author, publishDate' });
    }

    const newBook = await BookController.createBook({
      title,
      author,
      publishDate,
      isAvailable: true
    });

    res.status(201).json(newBook);
  } catch (error) {
    console.error('Error in POST /api/books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/books/:id - обновить книгу
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT /api/books/:id', req.params.id, req.body);
    const { title, author, publishDate } = req.body;
    
    if (!title || !author || !publishDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedBook = await BookController.updateBook(req.params.id, {
      title,
      author,
      publishDate
    });

    if (!updatedBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error in PUT /api/books/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/books/:id - удалить книгу
router.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /api/books/:id', req.params.id);
    const success = await BookController.deleteBook(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error in DELETE /api/books/:id:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/books/:id/borrow - взять книгу
router.post('/:id/borrow', async (req, res) => {
  try {
    console.log('POST /api/books/:id/borrow', req.params.id, req.body);
    const { readerName, returnDate } = req.body;
    
    if (!readerName || !returnDate) {
      return res.status(400).json({ error: 'Missing reader name or return date' });
    }

    const book = await BookController.borrowBook(req.params.id, readerName, returnDate);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found or not available' });
    }

    res.json(book);
  } catch (error) {
    console.error('Error in POST /api/books/:id/borrow:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/books/:id/return - вернуть книгу
router.post('/:id/return', async (req, res) => {
  try {
    console.log('POST /api/books/:id/return', req.params.id);
    const book = await BookController.returnBook(req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found or already returned' });
    }

    res.json(book);
  } catch (error) {
    console.error('Error in POST /api/books/:id/return:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;