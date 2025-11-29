var Entity = {
    pos_x: 0, pos_y: 0, //позиция объекта
    size_x: 32, size_y: 32, //размеры объекта
    extend: function (extendProto) {
        //расширение сущности
        var object = Object.create(this); //создание нового объекта
        for (var property in extendProto) {
            //для всех новых свойств объекта
            if (this.hasOwnProperty(property) || typeof object[property] === 'undefined') {
                //если их нет в родительском -  добавить
                object[property] = extendProto[property];
            }
        }//конец цикла for
        return object;
    }//конец функции extend
};
var card = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 0,
    flippedSprite: "cardt_1", // будет назначен при инициализации
    isFlipped: false,
    isMatched: false, // найдена пара
    draw: function(ctx) {
        var sprite = (this.isFlipped || this.isMatched) ? this.flippedSprite : "card";
        spriteManager.drawSprite(ctx, sprite, this.pos_x, this.pos_y);
    },
    update: function() {},
    flip: function() {
        if (this.isFlipped || this.isMatched) return false;
        this.isFlipped = true;
        return true;
    },
    unflip: function() {
        if (!this.isMatched) this.isFlipped = false;
    }
});
var Player = Entity.extend({
    lifetime: 3,
    move_x: 0,
    move_y: 0,
    speed: 10,
    facingRight: true, // направление взгляда
    draw: function(ctx) {
        var sprite = this.facingRight ? "cat_r" : "cat_l";
        spriteManager.drawSprite(ctx, sprite, this.pos_x, this.pos_y);
    },
    update: function() {
        // Обновляем направление взгляда
        if (this.move_x > 0) {
            this.facingRight = true;
        } else if (this.move_x < 0) {
            this.facingRight = false;
        }
        physicManager.update(this);
    }
});
var enemy = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 2.5,

    // квадратный маршрут
    path: [
        { x: 1, y: 0, dist:16 },   // вправо
        { x: 0, y: 1, dist: 16 },   // вниз
        { x: -1, y: 0, dist:16 },  // влево
        { x: 0, y: -1, dist: 16 }   // вверх
    ],

    currentStep: 0,
    moved: 0,

    // новые свойства для преследования
    chasing: false,
    chaseTimer: null,
    startPos: { x: 0, y: 0 },

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, "enemy", this.pos_x, this.pos_y);
    },

    update: function () {
        const player = gameManager.player;
        if (!player) return;

        // если враг только что создан — запоминаем стартовую позицию
        if (!this.startPos.x && !this.startPos.y) {
            this.startPos.x = this.pos_x;
            this.startPos.y = this.pos_y;
        }

        // зона обнаружения игрока (например, 100 пикселей вокруг)
        const detectionRange = 70;
        const distX = player.pos_x - this.pos_x;
        const distY = player.pos_y - this.pos_y;
        const distance = Math.sqrt(distX*distX + distY*distY);

        // начинаем преследование
        if (!this.chasing && distance <= detectionRange) {
            this.chasing = true;

            // через 1.5 секунды враг прекращает преследование
            clearTimeout(this.chaseTimer);
            this.chaseTimer = setTimeout(() => {
                this.chasing = false;
            }, 1500);
        }

        if (this.chasing) {
            // движение к игроку
            const angle = Math.atan2(distY, distX);
            this.pos_x += Math.cos(angle) * this.speed;
            this.pos_y += Math.sin(angle) * this.speed;
        } else {
            // движение по стандартному маршруту
            var step = this.path[this.currentStep];
            this.pos_x += step.x * this.speed;
            this.pos_y += step.y * this.speed;

            this.moved += this.speed;
            if (this.moved >= step.dist) {
                this.currentStep = (this.currentStep + 1) % this.path.length;
                this.moved = 0;
            }
        }
    }
});
var bonus_1 = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 0.5,

    // квадратный маршрут
    path: [
        { x: 0, y: 1, dist: 4 },   // вниз
        { x: 0, y: -1, dist: 4 }   // вверх
    ],
    sprite: ["heal", "glass", "speed"][Math.floor(Math.random() * 3)],
    currentStep: 0,
    moved: 0,

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.sprite, this.pos_x, this.pos_y);
    },

    update: function () {

        var step = this.path[this.currentStep];

        // Двигаем врага
        this.pos_x += step.x * this.speed;
        this.pos_y += step.y * this.speed;

        this.moved += this.speed;

        // Когда пройден нужный путь — переключаем фазу
        if (this.moved >= step.dist) {
            this.currentStep = (this.currentStep + 1) % this.path.length;
            this.moved = 0;
        }
    }
});
var bonus_2 = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 0.5,

    // квадратный маршрут
    path: [
        { x: 0, y: 1, dist: 4 },   // вниз
        { x: 0, y: -1, dist: 4 }   // вверх
    ],
    sprite: ["heal", "glass", "speed"][Math.floor(Math.random() * 3)],
    currentStep: 0,
    moved: 0,

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.sprite, this.pos_x, this.pos_y);
    },

    update: function () {

        var step = this.path[this.currentStep];

        // Двигаем врага
        this.pos_x += step.x * this.speed;
        this.pos_y += step.y * this.speed;

        this.moved += this.speed;

        // Когда пройден нужный путь — переключаем фазу
        if (this.moved >= step.dist) {
            this.currentStep = (this.currentStep + 1) % this.path.length;
            this.moved = 0;
        }
    }
});
var bonus_3 = Entity.extend({
    move_x: 0,
    move_y: 0,
    speed: 0.5,

    // квадратный маршрут
    path: [
        { x: 0, y: 1, dist: 4 },   // вниз
        { x: 0, y: -1, dist: 4 }   // вверх
    ],
    sprite: ["heal", "glass", "speed"][Math.floor(Math.random() * 3)],
    currentStep: 0,
    moved: 0,

    draw: function (ctx) {
        spriteManager.drawSprite(ctx, this.sprite, this.pos_x, this.pos_y);
    },

    update: function () {

        var step = this.path[this.currentStep];

        // Двигаем врага
        this.pos_x += step.x * this.speed;
        this.pos_y += step.y * this.speed;

        this.moved += this.speed;

        // Когда пройден нужный путь — переключаем фазу
        if (this.moved >= step.dist) {
            this.currentStep = (this.currentStep + 1) % this.path.length;
            this.moved = 0;
        }
    }
});
