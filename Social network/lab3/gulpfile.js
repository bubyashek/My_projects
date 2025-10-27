const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const cleanCSS = require('gulp-clean-css');
const gulpTypescript = require('gulp-typescript');
const replace = require('gulp-replace');

// настройка путей
const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist-gulp/public/css/'
  },
  scripts: {
    src: 'src/ts/**/*.ts',
    dest: 'dist-gulp/public/js/'
  },
  views: {
    src: 'src/views/*.pug',
    dest: 'dist-gulp/'
  }
};

// TypeScript конфигурация
const tsProject = gulpTypescript.createProject('tsconfig.json', {
  module: 'ES2015',
  target: 'ES2015'
});

// Задача: скомпилировать SCSS в CSS
function styles() {
  return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.styles.dest));
}

// Задача: компилировать TypeScript и обработать с Babel
function scripts() {
  return src(paths.scripts.src)
    .pipe(tsProject())
    .pipe(babel({
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: ["> 1%", "last 2 versions", "not dead"]
          },
          modules: false
        }]
      ]
    }))
    .pipe(replace(/import\s+['"]\.\.\/styles\/.*?\.scss['"];?\s*/g, '// SCSS import removed for Gulp build\n'))
    .pipe(dest(paths.scripts.dest));
}

// Задча: минимизировать JavaScript 
function minifyScripts() {
  return src('dist-gulp/public/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.scripts.dest));
}

// Задача: скомпилировать Pug в HTML
function views() {
  return src(paths.views.src)
    .pipe(pug({
      pretty: true,
      locals: {
        page: 'users' 
      }
    }))
    .pipe(dest(paths.views.dest));
}

// Задача: просмотр файлов на предмет изменения
function watchFiles() {
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
  watch('src/views/**/*.pug', views);
}

// Задача: Clean
function clean(cb) {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, 'dist-gulp');
  
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('Cleaned dist-gulp directory');
  }
  cb();
}

// Экспортирование задач
exports.styles = styles;
exports.scripts = scripts;
exports.minifyScripts = minifyScripts;
exports.views = views;
exports.watch = watchFiles;
exports.clean = clean;

// Задача сборки (скомпилировать всё)
exports.build = series(
  clean,
  parallel(styles, scripts, views)
);

// Задача по умолчанию
exports.default = series(
  parallel(styles, scripts, views),
  watchFiles
);

