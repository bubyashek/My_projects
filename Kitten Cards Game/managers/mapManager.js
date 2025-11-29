var mapManager = {
    mapData: null,
    tileLayers: [], // заменили tLayer на массив слоёв
    xCount: 12,
    yCount: 12,
    tSize: { x: 32, y: 32 },
    mapSize: { x: 384, y: 384 },
    tilesets: [],
    imgloadCount: 0,
    imgLoaded: false,
    jsonLoaded: false,
    view: { x: 0, y: 0, w: 384, h: 384 },

    // Методы:
    parseMap: function (tilesJSON) {
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;
        this.yCount = this.mapData.height;
        this.tSize.x = this.mapData.tilewidth;
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount * this.tSize.x;
        this.mapSize.y = this.yCount * this.tSize.y;

        for (var i = 0; i < this.mapData.tilesets.length; i++) {
            var t = this.mapData.tilesets[i];
            var img = new Image();
            img.onload = () => {
                this.imgloadCount++;
                if (this.imgloadCount === this.mapData.tilesets.length) this.imgLoaded = true;
            };
            img.src = t.image;

            var ts = {
                firstgid: t.firstgid,
                image: img,
                name: t.name,
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                yCount: Math.floor(t.imageheight / this.tSize.y)
            };
            this.tilesets.push(ts);
        }

        // собираем все слои tilelayer в массив
        this.tileLayers = [];
        for (var l = 0; l < this.mapData.layers.length; l++) {
            var layer = this.mapData.layers[l];
            if (layer.type === "tilelayer") {
                this.tileLayers.push(layer);
            }
        }

        this.jsonLoaded = true;
    },

    draw: function (ctx) {
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => { this.draw(ctx); }, 100);
            return;
        }

        for (var l = 0; l < this.tileLayers.length; l++) {
            var layer = this.tileLayers[l];

            for (var row = 0; row < this.yCount; row++) {
                for (var col = 0; col < this.xCount; col++) {
                    var idx = row * this.xCount + col;
                    var tileIndex = layer.data[idx];
                    if (tileIndex === 0) continue;

                    var tile = this.getTile(tileIndex);
                    if (!tile) continue;

                    ctx.drawImage(
                        tile.img,
                        tile.px, tile.py,
                        this.tSize.x, this.tSize.y,
                        col * this.tSize.x - this.view.x,
                        row * this.tSize.y - this.view.y,
                        this.tSize.x, this.tSize.y
                    );
                }
            }
        }
    },

    getTile: function (tileIndex) {
        var tileset = this.getTileset(tileIndex);
        if (!tileset) return null; // тайл не найден

        var id = tileIndex - tileset.firstgid;
        var x = id % tileset.xCount;
        var y = Math.floor(id / tileset.xCount);

        return {
            img: tileset.image,
            px: x * this.tSize.x,
            py: y * this.tSize.y
        };
    },

    getTileset: function (tileIndex) {
        for (var i = this.tilesets.length - 1; i >= 0; i--) {
            if (this.tilesets[i].firstgid <= tileIndex) return this.tilesets[i];
        }
        return null;
    },

    isVisible: function (x, y, width, height) {
        if (x + width < this.view.x || y + height < this.view.y ||
            x > this.view.x + this.view.w || y > this.view.y + this.view.h)
            return false;
        return true;
    },

    loadMap: function (path) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                this.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        request.send();
    },

    parseEntities: function () {
        // Если карта или изображения ещё не загружены — повторяем через 100 мс
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => { this.parseEntities(); }, 100);
        } else {
            // Проходим по всем слоям карты
            for (var j = 0; j < this.mapData.layers.length; j++) {
                if (this.mapData.layers[j].type === 'objectgroup') {
                    var entities = this.mapData.layers[j]; // слой с объектами
                    // "разбираем" все объекты слоя
                    for (var i = 0; i < entities.objects.length; i++) {
                        var e = entities.objects[i];
                        try {
                            // Создаём объект в соответствии с типом через фабрику
                            var obj = Object.create(gameManager.factory[e.type]);
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            // Добавляем объект в массив сущностей
                            gameManager.entities.push(obj);
                            if (obj.name === "Player_1") {
                                // Инициализируем параметры игрока
                                gameManager.initPlayer(obj);
                            }
                        } catch (ex) {
                            console.log(
                                "Error while creating: [" + e.gid + "] " + e.type + ", " + ex
                            ); // сообщение об ошибке
                        }
                    }
                } // Конец if проверки типа слоя на равенство objectgroup
            }
            // После создания всех сущностей — распределяем спрайты карточек
            gameManager.assignCardSprites();
        }
    },

    // Получение индекса блока по координатам на карте
    getTilesetIdx: function (x, y) {
        var col = Math.floor(x / this.tSize.x);
        var row = Math.floor(y / this.tSize.y);

        // Ограничиваем по размеру карты
        if (col < 0) col = 0;
        if (row < 0) row = 0;
        if (col >= this.xCount) col = this.xCount - 1;
        if (row >= this.yCount) row = this.yCount - 1;

        var idx = row * this.xCount + col;

        var maxTile = 0;
        for (var l = 0; l < this.tileLayers.length; l++) {
            var val = this.tileLayers[l].data[idx];
            if (val > maxTile) maxTile = val;
        }
        return maxTile;
    },

    // Центрирование карты на позиции (x, y)
    centerAt: function (x, y) {
        if (x < this.view.w / 2)  // Центрирование по горизонтали
            this.view.x = 0;
        else if (x > this.mapSize.x - this.view.w / 2)
            this.view.x = this.mapSize.x - this.view.w;
        else
            this.view.x = x - (this.view.w / 2);

        if (y < this.view.h / 2)  // Центрирование по вертикали
            this.view.y = 0;
        else if (y > this.mapSize.y - this.view.h / 2)
            this.view.y = this.mapSize.y - this.view.h;
        else
            this.view.y = y - (this.view.h / 2);
    }
};
