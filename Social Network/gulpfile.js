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

// Paths configuration
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

// TypeScript configuration
const tsProject = gulpTypescript.createProject('tsconfig.json', {
  module: 'ES2015',
  target: 'ES2015'
});

// Task: Compile SCSS to CSS
function styles() {
  return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.styles.dest));
}

// Task: Compile TypeScript and process with Babel
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

// Task: Minify JavaScript (separate task for production)
function minifyScripts() {
  return src('dist-gulp/public/js/**/*.js')
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(dest(paths.scripts.dest));
}

// Task: Compile Pug to HTML
function views() {
  return src(paths.views.src)
    .pipe(pug({
      pretty: true,
      locals: {
        page: 'users' // default page
      }
    }))
    .pipe(dest(paths.views.dest));
}

// Task: Watch files for changes
function watchFiles() {
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
  watch('src/views/**/*.pug', views);
}

// Task: Clean (optional - manually delete dist-gulp folder before build)
function clean(cb) {
  const fs = require('fs');
  const path = require('path');
  const dir = path.join(__dirname, 'dist-gulp');
  
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('✅ Cleaned dist-gulp directory');
  }
  cb();
}

// Export tasks
exports.styles = styles;
exports.scripts = scripts;
exports.minifyScripts = minifyScripts;
exports.views = views;
exports.watch = watchFiles;
exports.clean = clean;

// Build task (compile everything)
exports.build = series(
  clean,
  parallel(styles, scripts, views)
);

// Default task
exports.default = series(
  parallel(styles, scripts, views),
  watchFiles
);

