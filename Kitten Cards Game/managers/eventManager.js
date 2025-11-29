var eventsManager = {
    bind: [], // сопоставление клавиш действиям
    action: [], // действия
    setup: function (canvas) { // настройка сопоставления
        this.bind[87] = 'up'; // w – двигаться вверх
        this.bind[65] = 'left'; // a – двигаться влево
        this.bind[83] = 'down'; // s – двигаться вниз
        this.bind[68] = 'right'; // d – двигаться вправо
        this.bind[70] = 'interact';
        document.body.addEventListener("keydown", (e) => this.onKeyDown(e));
        document.body.addEventListener("keyup", (e) => this.onKeyUp(e));
    },

    onKeyDown: function (event) { // нажали на кнопку
        // на клавиатуре, проверили, есть ли сопоставление действию
        // для события с кодом keyCode
        var action = this.bind[event.keyCode];
        if (action) // проверка на action === true
            this.action[action] = true; // согласились
        // выполнять действие
    },

    onKeyUp: function (event) { // отпустили кнопку на клавиатуре
        // проверили, есть ли сопоставление действию для события
        // с кодом keyCode
        var action = this.bind[event.keyCode]; // проверили
        // наличие действия
        if (action) // проверка на action === true
            this.action[action] = false; // отменили действие
    }
};