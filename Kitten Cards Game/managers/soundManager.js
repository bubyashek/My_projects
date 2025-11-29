var soundManager = {
    clips: {}, //звуковые эффекты
    context: null, //аудиоконтекст
    gainNode: false, // главный узел для управлением громкостью звука
    loaded: false, // все звуки загружены
    init: function () {
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ?
            this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination); //подключение к динамикам
    }, // инициализация менеджера звука
    load: function (path, callback) { // проверяем, что уже загружены
        if (this.clips[path]) {
            callback(this.clips[path]);//вызываем уже загруженный
            return;// выход
        }
        var clip = { path: path, buffer: null, loaded: false }; //клип, буфер, загружен
        clip.play = function (volume, loop) {
            soundManager.play(this.path, { looping: loop ? loop : false, volume: volume ? volume : 1 });
        };
        this.clips[path] = clip; //помещаем в массив(литерал)
        var request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            soundManager.context.decodeAudioData(request.response, function (buffer) {
                clip.buffer = buffer;
                clip.loaded = true;
                callback(clip);
            });
        };
        request.send();
    }, // загрузка одного аудиофайла
    loadArray: function (array) {
        for (var i = 0; i < array.length; i++) {
            soundManager.load(array[i], function () {
                if (array.length === Object.keys(soundManager.clips).length) {
                    //если подготовили для загрузки все звуки
                    for (sd in soundManager.clips)
                        if (!soundManager.clips[sd].loaded) return;
                    soundManager.loaded = true; //все звуки загружены
                }
            });
        }
    }, //загрузить массив звуков
    play: function (path, settings) {
        if (!soundManager.loaded) {
            //если ещё не всё загрузили
            setTimeout(function () { soundManager.play(path, settings); }, 1000);
            return;
        }
        var looping = false; //значение по умолчанию
        var volume = 1;
        if (settings) {
            //если переопредлены, то перенастраиваем значения
            if (settings.looping) looping = settings.looping;
            if (settings.volume) volume = settings.volume;
        }
        var sd = this.clips[path]; //получаем звууковой эффект
        if (sd === null)
            return false;
        // создаем новый экземпляр проигрывателя BufferSource
        var sound = soundManager.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(soundManager.gainNode);
        sound.loop = looping;
        soundManager.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    }, //проигрывание файла
}