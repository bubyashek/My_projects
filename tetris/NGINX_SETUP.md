# Настройка Nginx для Tetris Game

## Установка Nginx

### macOS
```bash
brew install nginx
```

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install nginx
```

### CentOS/RHEL
```bash
sudo yum install nginx
```

## Конфигурация для HTTP (порт 80)

Создайте файл конфигурации:

```bash
sudo nano /etc/nginx/sites-available/tetris
```

Добавьте следующую конфигурацию:

```nginx
server {
    listen 80;
    server_name localhost;  # Замените на ваш домен
    
    root /Users/ledatu/Documents/WEB Labs/lab1;  # Путь к проекту
    index index.html;
    
    # Логи
    access_log /var/log/nginx/tetris_access.log;
    error_log /var/log/nginx/tetris_error.log;
    
    # Основная локация
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3|wav)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # MIME types
    types {
        text/html html;
        text/css css;
        application/javascript js;
        audio/mpeg mp3;
        audio/wav wav;
        image/x-icon ico;
    }
}
```

## Конфигурация для HTTPS (порт 443)

### Шаг 1: Получение SSL сертификата

#### Вариант А: Let's Encrypt (бесплатный, для production)

```bash
# Установка Certbot
brew install certbot  # macOS
# или
sudo apt install certbot python3-certbot-nginx  # Ubuntu

# Получение сертификата
sudo certbot --nginx -d your-domain.com
```

#### Вариант Б: Самоподписанный сертификат (для разработки)

```bash
# Создание директории для сертификатов
sudo mkdir -p /etc/nginx/ssl

# Генерация self-signed сертификата
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/tetris.key \
  -out /etc/nginx/ssl/tetris.crt \
  -subj "/CN=localhost"
```

### Шаг 2: Конфигурация HTTPS

```bash
sudo nano /etc/nginx/sites-available/tetris-ssl
```

Добавьте:

```nginx
# Редирект с HTTP на HTTPS
server {
    listen 80;
    server_name localhost;  # Замените на ваш домен
    return 301 https://$server_name$request_uri;
}

# HTTPS конфигурация
server {
    listen 443 ssl http2;
    server_name localhost;  # Замените на ваш домен
    
    root /Users/ledatu/Documents/WEB Labs/lab1;
    index index.html;
    
    # SSL сертификаты
    ssl_certificate /etc/nginx/ssl/tetris.crt;
    ssl_certificate_key /etc/nginx/ssl/tetris.key;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # Логи
    access_log /var/log/nginx/tetris_ssl_access.log;
    error_log /var/log/nginx/tetris_ssl_error.log;
    
    # Основная локация
    location / {
        try_files $uri $uri/ =404;
    }
    
    # Кэширование статических файлов
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|mp3|wav)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # MIME types
    types {
        text/html html;
        text/css css;
        application/javascript js;
        audio/mpeg mp3;
        audio/wav wav;
        image/x-icon ico;
    }
}
```

## Активация конфигурации

### macOS
```bash
# Создать symlink
sudo ln -s /etc/nginx/sites-available/tetris-ssl /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезапустить nginx
sudo nginx -s reload
```

### Ubuntu/Debian
```bash
# Создать symlink
sudo ln -s /etc/nginx/sites-available/tetris-ssl /etc/nginx/sites-enabled/

# Удалить дефолтную конфигурацию
sudo rm /etc/nginx/sites-enabled/default

# Проверить конфигурацию
sudo nginx -t

# Перезапустить nginx
sudo systemctl restart nginx

# Автозапуск nginx
sudo systemctl enable nginx
```

## Проверка работы

### HTTP
```bash
curl http://localhost
```

### HTTPS
```bash
# Если самоподписанный сертификат
curl -k https://localhost

# Если Let's Encrypt
curl https://your-domain.com
```

## Управление Nginx

```bash
# Запуск
sudo nginx
# или
sudo systemctl start nginx

# Остановка
sudo nginx -s stop
# или
sudo systemctl stop nginx

# Перезагрузка конфигурации
sudo nginx -s reload
# или
sudo systemctl reload nginx

# Проверка статуса
sudo systemctl status nginx

# Просмотр логов
tail -f /var/log/nginx/tetris_ssl_access.log
tail -f /var/log/nginx/tetris_ssl_error.log
```

## Устранение неполадок

### Проблема: "Permission denied"

```bash
# Дать nginx права на чтение файлов
sudo chmod -R 755 /Users/ledatu/Documents/WEB\ Labs/lab1
sudo chown -R $(whoami):staff /Users/ledatu/Documents/WEB\ Labs/lab1
```

### Проблема: "Port already in use"

```bash
# Проверить что использует порт
sudo lsof -i :443
sudo lsof -i :80

# Остановить другой процесс или изменить порт
```

### Проблема: SSL ошибки

```bash
# Проверить сертификаты
openssl x509 -in /etc/nginx/ssl/tetris.crt -text -noout

# Проверить приватный ключ
openssl rsa -in /etc/nginx/ssl/tetris.key -check
```

## Firewall (если нужно)

### macOS
```bash
# Firewall обычно не нужен на локальной машине
```

### Ubuntu/Debian
```bash
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### CentOS/RHEL
```bash
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## Доступ к игре

После настройки игра будет доступна по адресу:
- **HTTP**: `http://localhost` или `http://your-domain.com`
- **HTTPS**: `https://localhost` или `https://your-domain.com`

## Примечания

1. **Замените пути**: Измените `/Users/ledatu/Documents/WEB Labs/lab1` на актуальный путь к проекту
2. **Замените домен**: Измените `localhost` на ваш домен если используете реальный сервер
3. **Production**: Для production обязательно используйте Let's Encrypt вместо самоподписанного сертификата
4. **SELinux**: На CentOS/RHEL может потребоваться настройка SELinux:
   ```bash
   sudo setsebool -P httpd_can_network_connect 1
   sudo chcon -R -t httpd_sys_content_t /path/to/tetris
   ```

## Удаление server.sh

После настройки nginx вы можете удалить `server.sh`:
```bash
rm server.sh
```

И обновить `package.json`:
```json
{
  "scripts": {
    "build": "tsc",
    "watch": "tsc --watch"
  }
}
```

