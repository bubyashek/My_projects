import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import booksRouter from './routes/books.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Автоматическое определение путей
const isDevelopment = process.env.NODE_ENV !== 'production';
let viewsPath: string;
let publicPath: string;

if (isDevelopment) {
    // В режиме разработки - используем исходные файлы
    viewsPath = path.join(process.cwd(), 'src', 'views');
    publicPath = path.join(process.cwd(), 'src', 'public');
} else {
    // В продакшене - используем скомпилированные файлы
    viewsPath = path.join(__dirname, 'views');
    publicPath = path.join(__dirname, 'public');
}

console.log('Environment:', isDevelopment ? 'Development' : 'Production');
console.log('Views path:', viewsPath);
console.log('Public path:', publicPath);

app.set('view engine', 'pug');
app.set('views', viewsPath);
app.use(express.static(publicPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/books', booksRouter);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/book/:id', (req, res) => {
    res.render('book-detail', { bookId: req.params.id });
});

// Обработка 404
app.use((req, res) => {
    res.status(404).send('<h1>404 - Страница не найдена</h1><a href="/">Вернуться на главную</a>');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Views directory: ${viewsPath}`);
    console.log(`Public directory: ${publicPath}`);
});