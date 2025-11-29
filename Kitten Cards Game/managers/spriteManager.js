var spriteManager = {
    image: new Image(), //рисунок с объектами
    sprites: new Array(), // массив объектов для отображения
    imgLoaded: false, //изображения загружены
    jsonLoaded: false, //json загружен

    // ЗАГРУЗКА JSON + изображения атласа
    loadAtlas: function (atlasJson, atlasImg) {

        // подготовить запрос на разбор атласа
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                //успешно получили атлас
                this.parseAtlas(request.responseText);
            }
        };

        request.open("GET", atlasJson, true);// асинхронный запрос на рабор атласа
        request.send();// отправили запрос
        // Загружаем изображение атласа
        this.loadImg(atlasImg);
    },
    // загрузка изображения
    loadImg: function (imgName) { // загрузка изображения  
        this.image.onload = () => {
            spriteManager.imgLoaded = true; // когда изображение  
            // загружено - установить в true  
        };
        this.image.src = imgName; // давайте загрузим изображение  
    },

    // разобрать атлас с объектами
    parseAtlas: function (atlasJSON) { // разобрать атлас с объектами  
        var atlas = JSON.parse(atlasJSON);
        for (var name in atlas.frames) { // проход по всем именам в frames  
            var frame = atlas.frames[name].frame; // получение спрайта и  
            // сохранение в frame  
            // сохранение характеристик frame в виде объекта  
            this.sprites.push({ name: name, x: frame.x, y: frame.y, w: frame.w, h: frame.h });
        }
        this.jsonLoaded = true; // когда разобрали весь атлас - true  
    },
    // нарисовать спрайт
    drawSprite: function (ctx, name, x, y) {
        // если изображение не загружено, то повторить запрос через
        // 100 мсек
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => {
                spriteManager.drawSprite(ctx, name, x, y);
            }, 100);
        } else {
            var sprite = this.getSprite(name); // получить спрайт по имени

            if (!mapManager.isVisible(x, y, sprite.w, sprite.h))
                return; // не рисуем за пределами видимой зоны

            // сдвигаем видимую зону
            x -= mapManager.view.x;
            y -= mapManager.view.y;

            // отображаем спрайт на холсте
            ctx.drawImage(
                this.image,
                sprite.x, sprite.y, sprite.w, sprite.h,
                x, y,
                sprite.w, sprite.h
            );
        }
    },
    // получить объект по имени  
    getSprite: function(name) { // получить объект по имени  
        for (var i = 0; i < this.sprites.length; i++) {  
            var s = this.sprites[i];  
            if (s.name === name) // имя совпало - вернуть объект  
                return s;  
        }  
        return null; // не нашли  
    }
}
