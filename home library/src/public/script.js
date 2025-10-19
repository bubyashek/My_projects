class LibraryApp {
    constructor() {
        this.books = [];
        this.currentPage = 1;
        this.booksPerPage = 12;
        this.currentFilters = {
            status: 'all'
        };
        this.currentBookId = null;

        this.init();
    }

    init() {
        console.log('LibraryApp initialized');
        this.bindEvents();
        this.loadBooks();
    }

    bindEvents() {
        // Кнопка добавления книги
        const addBookBtn = document.getElementById('add-book-btn');
        if (addBookBtn) {
            addBookBtn.addEventListener('click', () => this.showAddBookDialog());
        }

        // Кнопки фильтров
        const applyFiltersBtn = document.getElementById('apply-filters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => this.applyFilters());
        }

        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.applyFilters());
        }

        const resetFiltersBtn = document.getElementById('reset-filters');
        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => this.resetFilters());
        }

        // Кнопки пагинации
        const prevPageBtn = document.getElementById('prev-page');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.prevPage());
        }

        const nextPageBtn = document.getElementById('next-page');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.nextPage());
        }

        // Диалог добавления книги
        const bookDialog = document.getElementById('book-dialog');
        if (bookDialog) {
            const form = bookDialog.querySelector('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('Book dialog form submitted');
                    this.addBook();
                });
            }
        }

        // Диалог взятия книги
        const borrowDialog = document.getElementById('borrow-dialog');
        if (borrowDialog) {
            const form = borrowDialog.querySelector('form');
            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('Borrow dialog form submitted');
                    this.borrowBook();
                });
            }
        }
    }

    async loadBooks() {
        try {
            console.log('Loading books from /api/books...');
            const response = await fetch('/api/books');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.books = await response.json();
            console.log('Books loaded successfully:', this.books);
            this.renderBooks();
            this.updatePagination();
        } catch (error) {
            console.error('Error loading books:', error);
            this.showError('Не удалось загрузить книги: ' + error.message);
        }
    }

    async applyFilters() {
        const statusFilter = document.getElementById('status-filter');
        if (!statusFilter) return;

        const status = statusFilter.value;
        this.currentFilters.status = status;

        let url = '/api/books?';
        const params = new URLSearchParams();

        if (status === 'available') {
            params.append('available', 'true');
        } else if (status === 'borrowed') {
            params.append('available', 'false');
        } else if (status === 'overdue') {
            params.append('overdue', 'true');
        }

        try {
            const response = await fetch(url + params.toString());
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.books = await response.json();
            this.currentPage = 1;
            this.renderBooks();
            this.updatePagination();
        } catch (error) {
            console.error('Error applying filters:', error);
            this.showError('Не удалось применить фильтры: ' + error.message);
        }
    }

    resetFilters() {
        const statusFilter = document.getElementById('status-filter');
        if (statusFilter) {
            statusFilter.value = 'all';
        }
        this.currentFilters.status = 'all';
        this.currentPage = 1;
        this.loadBooks();
    }

    renderBooks() {
        const grid = document.getElementById('books-grid');
        if (!grid) {
            console.error('Books grid element not found!');
            return;
        }

        const startIndex = (this.currentPage - 1) * this.booksPerPage;
        const endIndex = startIndex + this.booksPerPage;
        const booksToShow = this.books.slice(startIndex, endIndex);

        console.log('Rendering books:', booksToShow.length);

        if (booksToShow.length === 0) {
            grid.innerHTML = '<div class="loading">Книги не найдены</div>';
            return;
        }

        grid.innerHTML = booksToShow.map(book => this.createBookCard(book)).join('');
    }

    createBookCard(book) {
        const today = new Date().toISOString().split('T')[0];
        const isOverdue = !book.isAvailable && book.reader && book.reader.returnDate < today;

        let statusClass = 'available';
        let statusText = 'Доступна';

        if (isOverdue) {
            statusClass = 'overdue';
            statusText = 'Просрочена';
        } else if (!book.isAvailable) {
            statusClass = 'borrowed';
            statusText = 'На руках';
        }

        return `
            <div class="book-card ${statusClass}" data-id="${book.id}">
                <div class="book-card-header">
                    <h3 class="book-title">${escapeHtml(book.title)}</h3>
                    <span class="book-status status-${statusClass}">${statusText}</span>
                </div>
                <p class="book-author">Автор: ${escapeHtml(book.author)}</p>
                <p class="book-meta">Опубликовано: ${new Date(book.publishDate).toLocaleDateString('ru-RU')}</p>
                
                ${!book.isAvailable && book.reader ? `
                    <div class="book-reader">
                        <strong>Читатель:</strong> ${escapeHtml(book.reader.name)}<br>
                        <strong>Взята:</strong> ${new Date(book.reader.borrowDate).toLocaleDateString('ru-RU')}<br>
                        <strong>Вернуть до:</strong> ${new Date(book.reader.returnDate).toLocaleDateString('ru-RU')}
                        ${isOverdue ? '<br><strong style="color: var(--blood-red);">ПРОСРОЧЕНА!</strong>' : ''}
                    </div>
                ` : ''}
                
                <div class="book-actions">
                    <button class="pixel-btn" onclick="app.viewBook('${book.id}')">
                        <i class="fas fa-eye"></i> Просмотр
                    </button>
                    ${book.isAvailable ? `
                        <button class="pixel-btn" onclick="app.showBorrowDialog('${book.id}')">
                            <i class="fas fa-hand-holding"></i> Взять
                        </button>
                    ` : `
                        <button class="pixel-btn" onclick="app.returnBook('${book.id}')">
                            <i class="fas fa-undo"></i> Вернуть
                        </button>
                    `}
                    <button class="pixel-btn pixel-btn-danger" onclick="app.deleteBook('${book.id}')">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
        `;
    }

    showAddBookDialog() {
        const dialog = document.getElementById('book-dialog');
        if (dialog) {
            const publishDateInput = document.getElementById('publishDate');
            if (publishDateInput) {
                publishDateInput.min = '0001-01-01';
                publishDateInput.max = new Date().toISOString().split('T')[0];
            }
            // Сбросим форму
            const form = dialog.querySelector('form');
            if (form) form.reset();

            dialog.showModal();
            console.log('Add book dialog opened');
        }
    }

    async addBook() {
        const titleInput = document.getElementById('title');
        const authorInput = document.getElementById('author');
        const publishDateInput = document.getElementById('publishDate');

        if (!titleInput || !authorInput || !publishDateInput) {
            this.showError('Элементы формы не найдены');
            return;
        }

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const publishDate = publishDateInput.value;

        console.log('Adding book:', { title, author, publishDate });

        if (!title || !author || !publishDate) {
            this.showError('Пожалуйста, заполните все поля');
            return;
        }
        
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const returnDateInput = document.getElementById('returnDate');
        if (returnDateInput) {
            returnDateInput.min = tomorrow.toISOString().split('T')[0];
            returnDateInput.max = '9999-12-31';
        }
        try {
            const response = await fetch('/api/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: title,
                    author: author,
                    publishDate: publishDate
                }),
            });

            console.log('Add book response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server error response:', errorText);
                throw new Error(`Не удалось добавить книгу: ${response.status} ${errorText}`);
            }

            const newBook = await response.json();
            console.log('Book added successfully:', newBook);

            // Закрываем диалог
            const dialog = document.getElementById('book-dialog');
            if (dialog) dialog.close();

            // Перезагружаем список книг
            await this.loadBooks();
            this.showSuccess('Книга успешно добавлена!');

        } catch (error) {
            console.error('Error adding book:', error);
            this.showError('Не удалось добавить книгу: ' + error.message);
        }
    }

    showBorrowDialog(bookId) {
        console.log('Showing borrow dialog for book:', bookId);
        this.currentBookId = bookId;
        const dialog = document.getElementById('borrow-dialog');
        if (dialog) {
            // Установим минимальную дату возврата (завтра)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const returnDateInput = document.getElementById('returnDate');
            if (returnDateInput) {
                returnDateInput.min = tomorrow.toISOString().split('T')[0];
                returnDateInput.max = '9999-12-31';
            }

            // Сбросим форму
            const form = dialog.querySelector('form');
            if (form) form.reset();

            dialog.showModal();
        }
    }

    async borrowBook() {
        const readerNameInput = document.getElementById('readerName');
        const returnDateInput = document.getElementById('returnDate');

        if (!readerNameInput || !returnDateInput) {
            this.showError('Элементы формы не найдены');
            return;
        }

        const readerName = readerNameInput.value.trim();
        const returnDate = returnDateInput.value;

        console.log('Borrowing book:', this.currentBookId, readerName, returnDate);

        if (!readerName || !returnDate) {
            this.showError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            const response = await fetch(`/api/books/${this.currentBookId}/borrow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    readerName: readerName,
                    returnDate: returnDate
                }),
            });

            console.log('Borrow book response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Не удалось взять книгу: ${response.status} ${errorText}`);
            }

            const updatedBook = await response.json();
            console.log('Book borrowed successfully:', updatedBook);

            const dialog = document.getElementById('borrow-dialog');
            if (dialog) dialog.close();

            await this.loadBooks();
            this.showSuccess('Книга успешно выдана!');

        } catch (error) {
            console.error('Error borrowing book:', error);
            this.showError('Не удалось взять книгу: ' + error.message);
        }
    }

    async returnBook(bookId) {
        console.log('Returning book:', bookId);

        const confirmed = await showConfirmDialog(
            'Вы уверены, что хотите вернуть эту книгу?',
            'Возврат книги'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/books/${bookId}/return`, {
                method: 'POST',
            });

            console.log('Return book response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Не удалось вернуть книгу: ${response.status} ${errorText}`);
            }

            const returnedBook = await response.json();
            console.log('Book returned successfully:', returnedBook);

            await this.loadBooks();
            this.showSuccess('Книга успешно возвращена!');

        } catch (error) {
            console.error('Error returning book:', error);
            this.showError('Не удалось вернуть книгу: ' + error.message);
        }
    }

    async deleteBook(bookId) {
        console.log('Deleting book:', bookId);

        const confirmed = await showConfirmDialog(
            'Вы уверены, что хотите удалить эту книгу? Это действие нельзя отменить.',
            'Удаление книги'
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(`/api/books/${bookId}`, {
                method: 'DELETE',
            });

            console.log('Delete book response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Не удалось удалить книгу: ${response.status} ${errorText}`);
            }

            await this.loadBooks();
            this.showSuccess('Книга успешно удалена!');

        } catch (error) {
            console.error('Error deleting book:', error);
            this.showError('Не удалось удалить книгу: ' + error.message);
        }
    }

    viewBook(bookId) {
        console.log('Viewing book:', bookId);
        window.location.href = `/book/${bookId}`;
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.renderBooks();
            this.updatePagination();
        }
    }

    nextPage() {
        const totalPages = Math.ceil(this.books.length / this.booksPerPage);
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.renderBooks();
            this.updatePagination();
        }
    }

    updatePagination() {
        const pageInfo = document.getElementById('page-info');
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (pageInfo && prevBtn && nextBtn) {
            const totalPages = Math.max(1, Math.ceil(this.books.length / this.booksPerPage));
            const currentPage = this.books.length === 0 ? 0 : this.currentPage;

            if (this.books.length === 0) {
                pageInfo.textContent = 'Нет книг';
            } else {
                pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
            }

            prevBtn.disabled = currentPage <= 1;
            nextBtn.disabled = currentPage >= totalPages || this.books.length === 0;
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Удаляем существующие уведомления
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${type === 'error' ? 'var(--blood-red)' : 'var(--neon-purple)'};
            color: var(--ghost-white);
            border: 2px solid var(--ancient-gold);
            font-family: 'Courier New', monospace;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 4px 4px 0 var(--void-black);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// Функция для загрузки деталей книги (используется на странице book-detail)
async function loadBookDetail(bookId) {
    try {
        console.log('Loading book detail for:', bookId);
        const response = await fetch(`/api/books/${bookId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const book = await response.json();
        console.log('Book detail loaded:', book);

        displayBookDetail(book);
        setupBookDetailButtons(book);
    } catch (error) {
        console.error('Error loading book detail:', error);
        const container = document.getElementById('book-detail');
        if (container) {
            container.innerHTML = `<div class="error">Не удалось загрузить детали книги: ${error.message}</div>`;
        }
    }
}

function displayBookDetail(book) {
    const container = document.getElementById('book-detail');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const isOverdue = !book.isAvailable && book.reader && book.reader.returnDate < today;

    let statusClass = 'available';
    let statusText = 'Доступна';

    if (isOverdue) {
        statusClass = 'overdue';
        statusText = 'Просрочена';
    } else if (!book.isAvailable) {
        statusClass = 'borrowed';
        statusText = 'На руках';
    }

    container.className = `book-detail-card status-${statusClass}`;
    container.innerHTML = `
        <h2>${escapeHtml(book.title)}</h2>
        <div class="book-detail-info">
            <p><strong>Автор:</strong> ${escapeHtml(book.author)}</p>
            <p><strong>Дата публикации:</strong> ${new Date(book.publishDate).toLocaleDateString('ru-RU')}</p>
            <p><strong>Статус:</strong> <span class="status-badge status-${statusClass}">${statusText}</span></p>
            
            ${!book.isAvailable && book.reader ? `
                <div class="reader-info">
                    <h3>Информация о читателе</h3>
                    <p><strong>Имя:</strong> ${escapeHtml(book.reader.name)}</p>
                    <p><strong>Дата взятия:</strong> ${new Date(book.reader.borrowDate).toLocaleDateString('ru-RU')}</p>
                    <p><strong>Дата возврата:</strong> ${new Date(book.reader.returnDate).toLocaleDateString('ru-RU')}</p>
                    ${isOverdue ? '<p class="overdue-warning"><strong>⚠️ КНИГА ПРОСРОЧЕНА!</strong></p>' : ''}
                </div>
            ` : ''}
        </div>
    `;
}

function setupBookDetailButtons(book) {
    const editBtn = document.getElementById('edit-btn');
    const borrowBtn = document.getElementById('borrow-btn');
    const returnBtn = document.getElementById('return-btn');
    const deleteBtn = document.getElementById('delete-btn');

    // Настройка видимости кнопок
    if (borrowBtn) {
        borrowBtn.style.display = book.isAvailable ? 'inline-flex' : 'none';
        borrowBtn.onclick = () => showBorrowDialogDetail(book.id);
    }

    if (returnBtn) {
        returnBtn.style.display = !book.isAvailable ? 'inline-flex' : 'none';
        returnBtn.onclick = () => returnBookDetail(book.id);
    }

    if (editBtn) {
        editBtn.onclick = () => showEditDialog(book);
    }

    if (deleteBtn) {
        deleteBtn.onclick = () => deleteBookDetail(book.id);
    }
}

function showEditDialog(book) {
    const dialog = document.getElementById('edit-dialog');
    if (!dialog) return;

    // Заполняем форму текущими данными
    const titleInput = document.getElementById('edit-title');
    const authorInput = document.getElementById('edit-author');
    const publishDateInput = document.getElementById('edit-publishDate');

    if (titleInput) titleInput.value = book.title;
    if (authorInput) authorInput.value = book.author;
    if (publishDateInput) publishDateInput.value = book.publishDate;

    dialog.showModal();

    // Обработчик отправки формы
    const form = dialog.querySelector('form');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            updateBook(book.id);
        };
    }
}

async function updateBook(bookId) {
    const titleInput = document.getElementById('edit-title');
    const authorInput = document.getElementById('edit-author');
    const publishDateInput = document.getElementById('edit-publishDate');

    if (!titleInput || !authorInput || !publishDateInput) return;

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const publishDate = publishDateInput.value;

    if (!title || !author || !publishDate) {
        showNotificationGlobal('Пожалуйста, заполните все поля', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, author, publishDate }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedBook = await response.json();

        // Закрываем диалог
        const dialog = document.getElementById('edit-dialog');
        if (dialog) dialog.close();

        // Перезагружаем детали книги
        await loadBookDetail(bookId);

        showNotificationGlobal('Книга успешно обновлена!', 'success');
    } catch (error) {
        console.error('Error updating book:', error);
        showNotificationGlobal('Не удалось обновить книгу: ' + error.message, 'error');
    }
}

function showBorrowDialogDetail(bookId) {
    const dialog = document.getElementById('borrow-dialog');
    if (!dialog) return;

    // Установим минимальную дату возврата (завтра)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const returnDateInput = document.getElementById('returnDate');
    if (returnDateInput) {
        returnDateInput.min = tomorrow.toISOString().split('T')[0];
        returnDateInput.max = '9999-12-31';
    }

    const form = dialog.querySelector('form');
    if (form) {
        form.reset();
        form.onsubmit = (e) => {
            e.preventDefault();
            borrowBookDetail(bookId);
        };
    }

    dialog.showModal();
}

async function borrowBookDetail(bookId) {
    const readerNameInput = document.getElementById('readerName');
    const returnDateInput = document.getElementById('returnDate');

    if (!readerNameInput || !returnDateInput) return;

    const readerName = readerNameInput.value.trim();
    const returnDate = returnDateInput.value;

    if (!readerName || !returnDate) {
        showNotificationGlobal('Пожалуйста, заполните все поля', 'error');
        return;
    }

    try {
        const response = await fetch(`/api/books/${bookId}/borrow`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ readerName, returnDate }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dialog = document.getElementById('borrow-dialog');
        if (dialog) dialog.close();

        await loadBookDetail(bookId);
        showNotificationGlobal('Книга успешно выдана!', 'success');
    } catch (error) {
        console.error('Error borrowing book:', error);
        showNotificationGlobal('Не удалось выдать книгу: ' + error.message, 'error');
    }
}

async function returnBookDetail(bookId) {
    const confirmed = await showConfirmDialog(
        'Вы уверены, что хотите вернуть эту книгу?',
        'Возврат книги'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/api/books/${bookId}/return`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        await loadBookDetail(bookId);
        showNotificationGlobal('Книга успешно возвращена!', 'success');
    } catch (error) {
        console.error('Error returning book:', error);
        showNotificationGlobal('Не удалось вернуть книгу: ' + error.message, 'error');
    }
}

async function deleteBookDetail(bookId) {
    const confirmed = await showConfirmDialog(
        'Вы уверены, что хотите удалить эту книгу? Это действие нельзя отменить.',
        'Удаление книги'
    );

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`/api/books/${bookId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        showNotificationGlobal('Книга успешно удалена!', 'success');
        // Задержка перед редиректом, чтобы пользователь успел увидеть уведомление
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    } catch (error) {
        console.error('Error deleting book:', error);
        showNotificationGlobal('Не удалось удалить книгу: ' + error.message, 'error');
    }
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Глобальная функция для показа уведомлений (используется на странице деталей)
function showNotificationGlobal(message, type) {
    // Удаляем существующие уведомления
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'error' ? 'var(--blood-red)' : 'var(--neon-purple)'};
        color: var(--ghost-white);
        border: 2px solid var(--ancient-gold);
        font-family: 'Courier New', monospace;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 4px 4px 0 var(--void-black);
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Глобальная функция для показа кастомного диалога подтверждения
function showConfirmDialog(message, title = 'Подтверждение') {
    return new Promise((resolve) => {
        const dialog = document.getElementById('confirm-dialog');
        const titleElement = document.getElementById('confirm-title');
        const messageElement = document.getElementById('confirm-message');
        const cancelBtn = document.getElementById('confirm-cancel');
        const okBtn = document.getElementById('confirm-ok');

        if (!dialog || !titleElement || !messageElement || !cancelBtn || !okBtn) {
            // Fallback на стандартный confirm если элементы не найдены
            resolve(confirm(message));
            return;
        }

        titleElement.textContent = title;
        messageElement.textContent = message;

        // Удаляем старые обработчики
        const newCancelBtn = cancelBtn.cloneNode(true);
        const newOkBtn = okBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        okBtn.parentNode.replaceChild(newOkBtn, okBtn);

        // Обработчик отмены
        newCancelBtn.onclick = () => {
            dialog.close();
            resolve(false);
        };

        // Обработчик подтверждения
        newOkBtn.onclick = () => {
            dialog.close();
            resolve(true);
        };

        // Обработчик закрытия диалога (ESC или клик вне диалога)
        dialog.onclose = () => {
            resolve(false);
        };

        dialog.showModal();
    });
}

// Инициализация приложения когда DOM загружен
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded, initializing app...');
    window.app = new LibraryApp();
});