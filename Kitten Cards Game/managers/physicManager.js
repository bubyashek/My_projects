var physicManager = {
    lastHitTime: 0, // время последнего удара

    update: function (obj) {
        if (obj.move_x === 0 && obj.move_y === 0) return "stop";

        let speed = obj.speed;
        let newX = obj.pos_x + obj.move_x * speed;
        let newY = obj.pos_y + obj.move_y * speed;

        let obstacleLayer = mapManager.tileLayers.find(layer => layer.name === "Obstacles");
        if (!obstacleLayer) return "move";

        const isBlocked = (x, y) => {
            let corners = [
                { x: x, y: y },
                { x: x + obj.size_x - 1, y: y },
                { x: x, y: y + obj.size_y - 1 },
                { x: x + obj.size_x - 1, y: y + obj.size_y - 1 }
            ];

            for (let c of corners) {
                let col = Math.floor(c.x / mapManager.tSize.x);
                let row = Math.floor(c.y / mapManager.tSize.y);
                if (col < 0 || row < 0 || col >= mapManager.xCount || row >= mapManager.yCount)
                    return true;
                let idx = row * mapManager.xCount + col;
                if (obstacleLayer.data[idx] !== 0) return true;
            }
            return false;
        };

        if (!isBlocked(newX, obj.pos_y)) obj.pos_x = newX;
        if (!isBlocked(obj.pos_x, newY)) obj.pos_y = newY;

        let entity = physicManager.entityAtXY(obj, obj.pos_x, obj.pos_y);
        if (entity) {
            // бонусы
            if (entity.sprite === "heal" || entity.sprite === "glass" || entity.sprite === "speed") {
                if (entity.sprite === "heal") {
                    if(gameManager.lives == 3) return "bonus";
                    soundManager.play("levels/sounds/pickup_bonus.wav", { volume: 0.7 });
                    gameManager.lives = Math.min(gameManager.lives + 1, 3);
                    gameManager.updateLivesDisplay();
                }
                if (entity.sprite === "speed") {
                    soundManager.play("levels/sounds/pickup_bonus.wav", { volume: 0.7 });
                    obj.speed += 5;
                    setTimeout(() => { obj.speed -= 5; }, 2000);
                }
                if (entity.sprite === "glass") {
                    soundManager.play("levels/sounds/pickup_bonus.wav", { volume: 0.7 });
                    gameManager.revealAllCards();
                }
                gameManager.kill(entity);
                return "bonus";
            }

            // враги
            if (entity.name.startsWith("enemy_")) {
                let now = Date.now();
                // наносим урон только если прошло >= 1000 мс с последнего удара
                if (now - physicManager.lastHitTime >= 1000) { 
                    soundManager.play("levels/sounds/attack-swift-punch-bop-audio-1-1-00-00.mp3", { volume: 0.7 });
                    gameManager.lives--;
                    gameManager.updateLivesDisplay();
                    physicManager.lastHitTime = now;

                    if (gameManager.lives <= 0) {
                        showGameOver();};
                }
                return "enemy";
            }
        }

        return "move";
    },

    entityAtXY: function (obj, x, y) {
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i];
            if (e.name === obj.name) continue;
            if (x + obj.size_x <= e.pos_x || y + obj.size_y <= e.pos_y || x >= e.pos_x + e.size_x || y >= e.pos_y + e.size_y) continue;
            return e;
        }
        return null;
    }
};
