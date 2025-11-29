var gameManager = {
    //менеджер игры
    factory: {}, // фабрика объектов на карте
    entities: [], // объекты на карте
    player: null, // укзатель на объект игрока
    enemy: null,
    bonus_1: null,
    bonus_2: null,
    bonus_3: null,
    playerName: "Игрок",
    startTime: 0,
    elapsedTime: 0,
    card: null,
    lives: 3,
    timerInterval: null,
    laterKill: [], // отложенное уничтожение объектов
    collectedKittens: 0, // счётчик собранных котиков
    // Для механики карточек
    firstFlippedCard: null, // первая открытая карточка
    isCheckingMatch: false, // флаг проверки пары (блокировка на 1 сек)
    lastInteractTime: 0, // защита от спама F
    initPlayer: function (obj, name) {
        //инициализация игрока
        this.player = obj;
        // Если имя передано — используем его, иначе оставляем текущее значение playerName
        if (name) {
            this.playerName = name;
        }
    },
    kill: function (obj) {
        this.laterKill.push(obj);
    },
    update: function () {
        if (this.player === null)
            return;
        //по умолчанию игрок никуда не двигается
        this.player.move_x = 0;
        this.player.move_y = 0;
        //поймали событие - обрабатываем
        if (eventsManager.action["up"]) this.player.move_y = -1;
        if (eventsManager.action["down"]) this.player.move_y = 1;
        if (eventsManager.action["left"]) this.player.move_x = -1;
        if (eventsManager.action["right"]) this.player.move_x = 1;
        //обновление информации по всем объектам на карте
        this.entities.forEach(function (e) {
            try {//защита от ошибок при выполнении update
                e.update();
            } catch (ex) { }
        });
        //удаление всех объектов, попавших в laterKill
        for (var i = 0; i < this.laterKill.length; i++) {
            var idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1) this.entities.splice(idx, 1); // удаление из массива 1 объекта
        };
        if (this.laterKill.length > 0) //очистка массива laterKill
            this.laterKill.length = 0;
        
        // --- обработка взаимодействия с карточками ---
        if (eventsManager.action["interact"]) {
            this.handleCardInteraction();
        }

        mapManager.draw(ctx);
        mapManager.centerAt(this.player.pos_x, this.player.pos_y);
        this.draw(ctx);
    },
    draw: function (ctx) {
        for (var e = 0; e < this.entities.length; e++)
            this.entities[e].draw(ctx);
    },
    loadAll: function () {
        mapManager.loadMap("levels/level1.json"); // загрузка карты
        spriteManager.loadAtlas("levels/sprites.json", "levels/spritesheet.png");        // загрузка атласа
        gameManager.factory["card"] = card;
        gameManager.factory["Player"] = Player; // инициализация фабрики
        gameManager.factory["enemy"] = enemy;
        gameManager.factory["bonus_1"] = bonus_1;
        gameManager.factory["bonus_2"] = bonus_2;
        gameManager.factory["bonus_3"] = bonus_3;
        mapManager.parseEntities(); // разбор сущностей карты
        mapManager.draw(ctx); // отобразить карту
        eventsManager.setup(canvas); // настройка событий
    },
    play: function () {
        this.updateLivesDisplay();
        setInterval(updateWorld, 100);
    },
    startTimer: function () {
        soundManager.play(("levels/sounds/main-theme.mp3"),{looping: true, volume: 0.4});
        this.startTime = Date.now();
        var self = this;
        this.timerInterval = setInterval(function () {
            self.elapsedTime = Math.floor((Date.now() - self.startTime) / 1000);
            document.getElementById("timer").innerText = self.elapsedTime;
        }, 1000);
    },
    updateLivesDisplay: function () {
        const el = document.getElementById("lives");
        if (el) el.innerText = this.lives;
    },
    updateKittensDisplay: function () {
        const el = document.getElementById("kittens");
        if (el) el.innerText = this.collectedKittens;
    },
    // Бонус "лупа" — показать все карточки на 2 секунды
    revealAllCards: function() {
        var self = this;
        var cards = this.entities.filter(function(e) {
            return e.name && e.name.startsWith("card_") && !e.isMatched;
        });
        
        // Сбрасываем состояние первой открытой карточки, чтобы избежать багов с парами
        if (this.firstFlippedCard) {
            this.firstFlippedCard = null;
        }
        
        // Переворачиваем все карточки
        cards.forEach(function(card) {
            card.isFlipped = true;
        });
        
        // Блокируем взаимодействие на время показа
        this.isCheckingMatch = true;
        
        // Через 2 секунды переворачиваем обратно (кроме уже собранных)
        setTimeout(function() {
            cards.forEach(function(card) {
                if (!card.isMatched) {
                    card.isFlipped = false;
                }
            });
            self.isCheckingMatch = false;
        }, 2000);
    },
    stopTimer: function () {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    },
    // Распределение спрайтов карточек парами
    assignCardSprites: function() {
        var cards = this.entities.filter(function(e) {
            return e.name && e.name.startsWith("card_");
        });
        
        if (cards.length === 0) return;
        
        var spriteTypes = ["cardt_1", "cardt_2", "cardt_3", "cardt_4"];
        var sprites = [];
        
        // Создаём массив спрайтов парами
        var pairsNeeded = Math.floor(cards.length / 2);
        for (var i = 0; i < pairsNeeded; i++) {
            var sprite = spriteTypes[i % spriteTypes.length];
            sprites.push(sprite, sprite); // добавляем пару
        }
        
        // Если нечётное количество карточек — добавляем ещё один
        if (cards.length % 2 !== 0) {
            sprites.push(spriteTypes[pairsNeeded % spriteTypes.length]);
        }
        
        // Перемешиваем массив спрайтов (Fisher-Yates)
        for (var i = sprites.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = sprites[i];
            sprites[i] = sprites[j];
            sprites[j] = temp;
        }
        
        // Назначаем спрайты карточкам
        for (var i = 0; i < cards.length; i++) {
            cards[i].flippedSprite = sprites[i];
        }
    },
    // Найти ближайшую карточку к игроку
    getNearbyCard: function() {
        if (!this.player) return null;
        
        var interactDistance = 40; // дистанция взаимодействия
        var nearestCard = null;
        var nearestDist = Infinity;
        
        for (var i = 0; i < this.entities.length; i++) {
            var e = this.entities[i];
            if (!e.name || !e.name.startsWith("card_")) continue;
            if (e.isMatched) continue; // уже найденная пара
            
            var dx = (this.player.pos_x + this.player.size_x / 2) - (e.pos_x + e.size_x / 2);
            var dy = (this.player.pos_y + this.player.size_y / 2) - (e.pos_y + e.size_y / 2);
            var dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < interactDistance && dist < nearestDist) {
                nearestDist = dist;
                nearestCard = e;
            }
        }
        
        return nearestCard;
    },
    // Обработка взаимодействия с карточками
    handleCardInteraction: function() {
        if (this.isCheckingMatch) return; // ждём завершения проверки
        
        var now = Date.now();
        if (now - this.lastInteractTime < 300) return; // защита от спама
        
        var card = this.getNearbyCard();
        if (!card) return;
        
        if (!card.flip()) return; // карточка уже открыта
        soundManager.play("levels/sounds/pickup_bonus.wav", { volume: 0.7 });
        this.lastInteractTime = now;
        
        if (this.firstFlippedCard === null) {
            // Это первая карточка
            this.firstFlippedCard = card;
        } else {
            // Это вторая карточка — проверяем пару
            var first = this.firstFlippedCard;
            var second = card;
            var self = this;
            
            this.isCheckingMatch = true;
            
            if (first.flippedSprite === second.flippedSprite) {
                // Пара найдена! Через 1 сек удаляем обе карточки
                first.isMatched = true;
                second.isMatched = true;
                // Увеличиваем счётчик котиков (2 карточки = 1 пара = 2 котика)
                self.collectedKittens += 2;
                self.updateKittensDisplay();
                setTimeout(function() {
                    soundManager.play("levels/sounds/two_cards.wav", { volume: 0.7 });
                    self.kill(first);
                    self.kill(second);
                    self.firstFlippedCard = null;
                    self.isCheckingMatch = false;
                    // Проверяем через небольшую задержку, чтобы laterKill успел отработать
                    setTimeout(function() {
                        self.checkAllCardsCollected();
                    }, 150);
                }, 1000);
            } else {
                // Не совпали — через 1 сек переворачиваем обратно
                setTimeout(function() {
                    first.unflip();
                    second.unflip();
                    self.firstFlippedCard = null;
                    self.isCheckingMatch = false;
                }, 1000);
            }
        }
    },
    // Проверка: все карточки собраны?
    checkAllCardsCollected: function() {
        var remainingCards = this.entities.filter(function(e) {
            return e.name && e.name.startsWith("card_");
        });
        
        if (remainingCards.length === 0) {
            // Все карточки собраны — переход на следующий уровень
            this.nextLevel();
        }
    },
    // Переход на следующий уровень
    currentLevel: 1,
    nextLevel: function() {
        this.currentLevel++;
        var nextLevelPath = "levels/level" + this.currentLevel + ".json";
        var self = this;
        
        // Проверяем, существует ли следующий уровень
        var request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    // Уровень существует — загружаем
                    self.loadLevel(nextLevelPath);
                } else {
                    // Уровней больше нет — победа!
                    self.showVictory();
                }
            }
        };
        request.open("HEAD", nextLevelPath, true);
        request.send();
    },
    // Загрузка нового уровня
    loadLevel: function(levelPath) {
        // Сбрасываем состояние карточек
        this.firstFlippedCard = null;
        this.isCheckingMatch = false;
        
        // Очищаем сущности
        this.entities = [];
        this.laterKill = [];
        this.player = null;
        
        // Сбрасываем mapManager
        mapManager.mapData = null;
        mapManager.tileLayers = [];
        mapManager.tilesets = [];
        mapManager.imgloadCount = 0;
        mapManager.imgLoaded = false;
        mapManager.jsonLoaded = false;
        
        // Загружаем новый уровень
        mapManager.loadMap(levelPath);
        mapManager.parseEntities();
    },
    // Экран победы
    showVictory: function() {
        if (this.gameOver) return;
        this.gameOver = true;
        
        this.stopTimer();
        soundManager.play("levels/sounds/new-level.wav", { volume: 0.7 });
        // Заполняем модальное окно
        document.getElementById("victory-player-name").innerText = this.playerName;
        document.getElementById("victory-time").innerText = this.elapsedTime;
        document.getElementById("victory-kittens").innerText = this.collectedKittens;
        
        // Сохраняем результат в таблицу лидеров
        var leaderboard = new Leaderboard();
        leaderboard.addEntry(this.playerName, this.elapsedTime, this.collectedKittens);
        renderLeaderboard(leaderboard, "victory-leaderboard-container");
        
        // Показываем модальное окно
        document.getElementById("victory-modal").classList.remove("hidden");
        
        document.getElementById("btn-victory-exit").onclick = function() {
            window.location.href = "index.html";
        };
    }
};
function showGameOver() {
    if (gameManager.gameOver) return;
    gameManager.gameOver = true;

    clearInterval(gameManager.gameInterval);
    gameManager.stopTimer();
    soundManager.play("levels/sounds/game-over.wav", { volume: 0.7 });    // Заполняем модальное окно
    document.getElementById("modal-player-name").innerText = gameManager.playerName;
    document.getElementById("player-time").innerText = gameManager.elapsedTime;
    document.getElementById("modal-kittens").innerText = gameManager.collectedKittens;
    
    document.getElementById("game-over-modal").classList.remove("hidden");

    const leaderboard = new Leaderboard();
    leaderboard.addEntry(gameManager.playerName, gameManager.elapsedTime, gameManager.collectedKittens);
    renderLeaderboard(leaderboard, "leaderboard-container");

    document.getElementById("btn-exit").onclick = () => { window.location.href = "index.html"; };
}

function updateWorld() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameManager.update();
};