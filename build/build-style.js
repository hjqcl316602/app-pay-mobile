const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const less = require('gulp-less');
const pump = require('pump');

gulp.task('basis', async function() {
  await pump([
    gulp.src('../src/css/basis/index.less'),
    less(),
    autoprefixer({
      browsers: ['last 2 versions', 'not ie <= 8', '> 1%'] //取消该设置，构建时才不会报警告，但是取消后则不会打包兼容性
    }),
    rename('index.css'), //{'suffix':'.min'}
    gulp.dest('../src/css/basis')
  ]);
});

gulp.task('ui-style', async function() {
  await pump([
    gulp.src('../src/ui/style/index.less'),
    less(),
    autoprefixer({
      browsers: ['last 2 versions', 'not ie <= 8', '> 1%'] //取消该设置，构建时才不会报警告，但是取消后则不会打包兼容性
    }),
    rename('index.css'), //{'suffix':'.min'}
    gulp.dest('../src/ui/style')
  ]);
});

gulp.task('watch-ui-style', async function() {
  await gulp.watch(['../src/ui/style/*.less'], gulp.series('ui-style'));
});

gulp.task('default', gulp.series('watch-ui-style'));
